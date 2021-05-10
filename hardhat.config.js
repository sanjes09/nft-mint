/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-waffle");

module.exports = {
  networks: {
    hardhat: {
    },
    live: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.MAINNET_PRIVKEY],
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
      accounts: [process.env.MAINNET_PRIVKEY],
    },
  },
  solidity: {
    version: "0.7.6",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 240000,
  },
  gasReporter: {
    enabled: true,
    coinmarketcap: "556f708d-d5c0-4956-abb1-e2665c24405e",
    currency: 'USD',
    gasPrice: 172
  }
};
