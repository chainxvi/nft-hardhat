require("dotenv").config();

require("@nomiclabs/hardhat-etherscan"); // are all the necessary packages imported, and downloaded in your package.json?
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");
require("solidity-coverage");
require('hardhat-deploy');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.16" },
      { version: "0.4.19" },
      { version: "0.6.12" },
    ]
  },
  defaultNetwork: 'hardhat',
  namedAccounts: {
    deployer: {
      default: 0,
    }
  },
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
      forking: {
        url: process.env.MAINNET_RPC_URL || "",
      }
    },
    rinkeby: {
      chainId: 4,
      blockConfirmations: 6,
      url: process.env.RINKEBY_RPC_URL || "",
      accounts:
        process.env.RINKEBY_PRIVATE_KEY !== undefined ? [process.env.RINKEBY_PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: 'gas-report.txt',
    currency: 'USD',
    noColors: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 500000,
  }
};
