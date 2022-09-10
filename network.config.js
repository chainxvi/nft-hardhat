const { ethers } = require("hardhat");

module.exports = {
  networkConfig: {
    // rinkeby network config
    4: {
      name: 'rinkeby',
      vrfCoordinator: '0x6168499c0cFfCaCD319c818142124B7A15E857ab',
      keyHash: '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc',
      callbackGasLimit: 100000,
      subscriptionId: 7761,
      mintFee: ethers.utils.parseEther('0.1'),
    },
    // hardhat network config
    31337: { 
      name: 'hardhat',
      keyHash: '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc',
      callbackGasLimit: 100000, // verify this
      subscriptionId: 7761,
      mintFee: ethers.utils.parseEther('0.1'),
    },
  },
  devChains: ['hardhat', 'localhost'] // as well as this, is the scope correct?
}
