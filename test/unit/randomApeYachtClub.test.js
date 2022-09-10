const { expect, assert } = require('chai');
const { ethers, deployments, network, getNamedAccounts } = require('hardhat');
const { devChains, networkConfig } = require('../../network.config');

!devChains.includes(network.name) ?
describe.skip : 
describe('RAYC', function () {
  let randomApeYachtClub, vrfCoordinatorV2Mock, deployer, accounts;
  const mintFee = networkConfig[network.config.chainId].mintFee;

  beforeEach(async function() {
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    await deployments.fixture(['mocks', 'RAYC']);

    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    randomApeYachtClub = await ethers.getContract("RandomApeYachtClub");
  });

  describe('constructor', function () {
    it('tokenURIs is assigned', async function() {
      const tokenURIs = await randomApeYachtClub.getTokenURIs();
      expect(tokenURIs).to.have.lengthOf(4);
    });

    it('mint fee is assigned', async function() {
      const contractMintFee = await randomApeYachtClub.getMintFee();
      assert.equal(ethers.utils.formatEther(contractMintFee), ethers.utils.formatEther(mintFee));
    })
  });

  describe('minNft', function() {
    it('if paid less than mint fee, an error is thrown', async function() {
      const smallFee = ethers.utils.parseEther('0.09');
      await expect(randomApeYachtClub.mintNft({ value: smallFee })).to.be.revertedWith('RandomApeYachtClub__NotEnoughFeeToMint');
    });

    it('NFTRequested event is fired', async function () {
      await expect(randomApeYachtClub.mintNft({ value: mintFee })).to.emit(randomApeYachtClub, 'NFTRequested');
    });
  });

  describe('withdraw', function() {
    it('the amount of the contract is 0 after withdrawing', async function() {
      await randomApeYachtClub.withdraw();
      const provider = ethers.provider; // fix this as per the PR description, i.e. use ethers.getDefaultProvider
      const balance = await provider.getBalance(randomApeYachtClub.address);
      expect(balance).to.equal(0);
    });
  });

  describe('fulfillRandomWords', function() {
    it('reverts if no valid requestId is provided', async function () {
      await expect(vrfCoordinatorV2Mock.fulfillRandomWords(0, randomApeYachtClub.address)).to.be.revertedWith('nonexistent request');
    });

    it('emits RandomWordsFulfilled', async function () {
      // mint NFT
      const tx = await randomApeYachtClub.mintNft({ value: mintFee });
      const receipt = await tx.wait(1);
      const requestId = receipt.events.find(e => e.event === 'NFTRequested').args['requestId'];
      // call fulfillRandomWords
      // and watch for the event
      await expect(vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomApeYachtClub.address))
      .to.emit(vrfCoordinatorV2Mock, 'RandomWordsFulfilled');
    });

    it('the vrf fulfillRandomWords sends the randomWords and emits NFTMinted', async function () {
      await new Promise(async (resolve, reject) => {
        randomApeYachtClub.once('NFTMinted', async () => {
          try {
            // This right here is never executed
            console.log('NFTMinted');
          } catch (error) {
            console.log(erro);
            reject();
          }
          resolve();
        });
        try {
          // mint NFT
          const tx = await randomApeYachtClub.mintNft({ value: mintFee });
          const receipt = await tx.wait(1);
          const requestId = receipt.events.find(e => e.event === 'NFTRequested').args['requestId'];
          // call fulfillRandomWords
          // and watch for the event
          await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomApeYachtClub.address);
        } catch (error) {
          console.log(error);
        }
      })
    });
  });
});
