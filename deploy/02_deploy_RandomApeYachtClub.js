const { network, ethers } = require('hardhat');
const { networkConfig, devChains } = require('../network.config');
const { handleUploadToPinia } = require('../utils/handleUploadToPinata');
const { verify } = require('../utils/verify');

let tokenURIs = [
  'ipfs://QmR27pW2CVvZ8DRqC35vcvLjnfxZpesGJwyFW8ihyR2HQb',
  'ipfs://QmaqQxmqdodEeFigZ89TcNkT3hzsqqDcNaU9w14bNb4c4T',
  'ipfs://QmcEtwoygjJWkFapRLorJX6TJwZbXMLWtDSyFvBF2gzf1Q',
  'ipfs://QmWj9RjQhuSei9XVoMW1EGy9ueZAMD8wbCtWpsqjj5VM9d'
];

const FUND_AMOUNT = ethers.utils.parseEther('10');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  
  const currentNetwork = networkConfig[network.config.chainId];
  const isLocal = devChains.includes(currentNetwork.name);

  let vrfCoordinator = '';
  let subscriptionId = 0;

  if(process.env.UPLOAD_TO_PINATA === 'true') {
    tokenURIs = await handleUploadToPinia();
  }

  console.log(isLocal);
  if(isLocal) {
    const VRFCoordinatorV2Mock = await ethers.getContract('VRFCoordinatorV2Mock');
    vrfCoordinator = VRFCoordinatorV2Mock.address;
    const tx = await VRFCoordinatorV2Mock.createSubscription();
    const receipt = await tx.wait(1);
    subscriptionId = receipt.events[0].args.subId;
    await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
  } else {
    vrfCoordinator = currentNetwork.vrfCoordinator;
    subscriptionId = currentNetwork.subscriptionId;
  }

  const keyHash = currentNetwork.keyHash;
  const callbackGasLimit = currentNetwork.callbackGasLimit;
  const mintFee = currentNetwork.mintFee;

  const args = [
    vrfCoordinator,
    keyHash,
    callbackGasLimit,
    subscriptionId,
    tokenURIs,
    mintFee,
  ]

  const RandomApeYachtClub = await deploy('RandomApeYachtClub', {
    from: deployer,
    args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if(!isLocal) {
    await verify(RandomApeYachtClub.address, args);
  }
}

module.exports.tags = ['all', 'RAYC'];