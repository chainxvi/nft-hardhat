const { network, ethers } = require('hardhat');
const { networkConfig, devChains } = require('../network.config');
const { verify } = require('../utils/verify');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  
  const currentNetwork = networkConfig[network.config.chainId];
  const isLocal = devChains.includes(currentNetwork.name);

  const nftName = "YachtClub";
  const nftSymbol = "YC";
  const args = [nftName, nftSymbol]

  const YachClub = await deploy('YachtClub', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if(!isLocal) {
    await verify(YachClub.address, args);
  }
}

module.exports.tags = ['all', 'YachClub'];