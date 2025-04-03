const Athena3DNFT = artifacts.require("Athena3DNFT");
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

contract("Athena3DNFT", accounts => {
  const [owner, creator, buyer, anotherUser] = accounts;
  const tokenURI = "ipfs://QmXyZ...123456";
  const royaltyPercentage = 1000; // 10%
  const listingPrice = web3.utils.toWei("1", "ether");
  
  let contractInstance;
  let tokenId;

  beforeEach(async () => {
    // Deploy a new contract instance before each test
    contractInstance = await Athena3DNFT.new({ from: owner });
  });

  describe("Token Minting", () => {
    it("should mint a new token with correct owner and parameters", async () => {
      // Mint a token
      const tx = await contractInstance.mintToken(creator, tokenURI, royaltyPercentage, { from: creator });
      tokenId = tx.logs[0].args.tokenId.toString();
      
      // Check token ownership and URI
      const tokenOwner = await contractInstance.ownerOf(tokenId);
      const storedTokenURI = await contractInstance.tokenURI(tokenId);
      
      assert.equal(tokenOwner, creator, "Token owner should be the creator");
      assert.equal(storedTokenURI, tokenURI, "Token URI should match");
      
      // Check royalty info
      const [creatorAddress, royaltyBasisPoints] = await contractInstance.getTokenRoyaltyInfo(tokenId);
      assert.equal(creatorAddress, creator, "Creator address should match");
      assert.equal(royaltyBasisPoints.toString(), royaltyPercentage.toString(), "Royalty percentage should match");
      
      // Check for TokenMinted event
      expectEvent(tx, 'TokenMinted', {
        creator: creator,
        tokenId: new BN(tokenId),
        tokenURI: tokenURI
      });
    });

    it("should not allow royalty percentage above 50%", async () => {
      // Try to mint with royalty > 50%
      const invalidRoyalty = 5100; // 51%
      
      await expectRevert(
        contractInstance.mintToken(creator, tokenURI, invalidRoyalty, { from: creator }),
        "Royalty cannot exceed 50%"
      );
    });
  });

  describe("Token Listing and Sales", () => {
    beforeEach(async () => {
      // Mint a token before each test in this describe block
      const tx = await contractInstance.mintToken(creator, tokenURI, royaltyPercentage, { from: creator });
      tokenId = tx.logs[0].args.tokenId.toString();
    });

    it("should list a token for sale correctly", async () => {
      // List the token for sale
      const listTx = await contractInstance.listToken(tokenId, listingPrice, { from: creator });
      
      // Check if token is listed with correct price
      const [isListed, price] = await contractInstance.getTokenListing(tokenId);
      
      assert.equal(isListed, true, "Token should be listed");
      assert.equal(price.toString(), listingPrice, "Listing price should match");
      
      // Check for TokenListed event
      expectEvent(listTx, 'TokenListed', {
        tokenId: new BN(tokenId),
        price: new BN(listingPrice)
      });
    });

    it("should not allow listing by non-owner", async () => {
      await expectRevert(
        contractInstance.listToken(tokenId, listingPrice, { from: anotherUser }),
        "Only the owner can list a token"
      );
    });

    it("should allow token purchase and distribute funds correctly", async () => {
      // List the token for sale
      await contractInstance.listToken(tokenId, listingPrice, { from: creator });
      
      // Calculate expected fees
      const platformFeePercentage = await contractInstance.platformFeePercentage();
      const platformFee = new BN(listingPrice).mul(platformFeePercentage).div(new BN(10000));
      const royaltyAmount = new BN(listingPrice).mul(new BN(royaltyPercentage)).div(new BN(10000));
      const sellerAmount = new BN(listingPrice).sub(platformFee).sub(royaltyAmount);
      
      // Track balances before purchase
      const ownerBalanceBefore = new BN(await web3.eth.getBalance(owner));
      const creatorBalanceBefore = new BN(await web3.eth.getBalance(creator));
      const buyerBalanceBefore = new BN(await web3.eth.getBalance(buyer));
      
      // Purchase the token
      const purchaseTx = await contractInstance.purchaseToken(tokenId, { 
        from: buyer, 
        value: listingPrice 
      });
      
      // Calculate gas used
      const gasUsed = new BN(purchaseTx.receipt.gasUsed);
      const tx = await web3.eth.getTransaction(purchaseTx.tx);
      const gasPrice = new BN(tx.gasPrice);
      const gasCost = gasUsed.mul(gasPrice);
      
      // Track balances after purchase
      const ownerBalanceAfter = new BN(await web3.eth.getBalance(owner));
      const creatorBalanceAfter = new BN(await web3.eth.getBalance(creator));
      const buyerBalanceAfter = new BN(await web3.eth.getBalance(buyer));
      
      // Verify token ownership changed
      const newOwner = await contractInstance.ownerOf(tokenId);
      assert.equal(newOwner, buyer, "Buyer should be the new owner");
      
      // Verify token is no longer listed
      const [isListed, ] = await contractInstance.getTokenListing(tokenId);
      assert.equal(isListed, false, "Token should not be listed after purchase");
      
      // Verify balances changed correctly (with small allowance for rounding)
      assert(ownerBalanceAfter.sub(ownerBalanceBefore).eq(platformFee), "Platform owner should receive platform fee");
      assert(creatorBalanceAfter.sub(creatorBalanceBefore).eq(royaltyAmount), "Creator should receive royalty");
      
      // Buyer's balance change should include gas cost
      const expectedBuyerBalanceChange = new BN(listingPrice).add(gasCost);
      const actualBuyerBalanceChange = buyerBalanceBefore.sub(buyerBalanceAfter);
      
      // Allow small deviation due to gas estimation
      assert(
        actualBuyerBalanceChange.sub(expectedBuyerBalanceChange).abs().lt(new BN(web3.utils.toWei("0.01", "ether"))),
        "Buyer balance change should match purchase price plus gas costs"
      );
      
      // Check for TokenSold event
      expectEvent(purchaseTx, 'TokenSold', {
        tokenId: new BN(tokenId),
        seller: creator,
        buyer: buyer
      });
    });
  });
}); 