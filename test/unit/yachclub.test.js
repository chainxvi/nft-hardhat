const { expect } = require('chai');
const { ethers, deployments, network } = require('hardhat');
const { devChains } = require('../../network.config');

!devChains.includes(network.name) ?
describe.skip :
describe('YachtClub NFT Unit Test', function() {
  let YachtClub;
  
  let tokenCounter;
  beforeEach( async () => {
    await deployments.fixture(['all']);
    YachtClub = await ethers.getContract('YachtClub');
  });

  describe('constructor', () => {
    it('sets tokenCounter value as 0', async () => {
      tokenCounter = await YachtClub.getTokenCounter();
      expect(tokenCounter).to.equal(0);
    });
  });

  describe('yachtClubMint', () => {
    it('increments tokenCounter', async () => {
      const tx = await YachtClub.yachtClubMint();
      await tx.wait(1);
      
      const _tokenCounter = await YachtClub.getTokenCounter();
      expect(_tokenCounter).to.equal(parseInt(tokenCounter) + 1);
    });
  });

  describe('tokenURI', () => {
    it('returns a token URI as string', async () => {
      const tokenURI = await YachtClub.tokenURI(0);
      expect(typeof tokenURI === "string").to.be.true;
    });
  });

  describe('getTokenCounter', () => {
    it('returns the tokenCounter', async () => {
      tokenCounter = await YachtClub.getTokenCounter();
      expect(parseInt(tokenCounter)).to.be.a('number');
    });
  });
})