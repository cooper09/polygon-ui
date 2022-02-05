require('babel-register');
require('babel-polyfill');
require('dotenv').config();

const HDWalletProvider = require("truffle-hdwallet-provider");
const { API_KEY, PRIVATE_KEY } = process.env;

module.exports = {

  networks: {
    mumbai:{
      provider: function(){
        //cooper s - create ropsten wallet for Account: Primary
        return new HDWalletProvider(process.env.PRIVATE_KEY, "https://ropsten.infura.io/v3/"+process.env.API_KEY)
      },
      gasPrice: 250000,
      gas: 3000000,
      network_id:'3'
    },
    ropsten:{
      provider: function(){
        //cooper s - create ropsten wallet for Account: Primary
        return new HDWalletProvider(process.env.PRIVATE_KEY, "https://ropsten.infura.io/v3/"+process.env.API_KEY)
      },
      gasPrice: 250000,
      gas: 3000000,
      network_id:'3'
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.6.0",    // Fetch exact version from solc-bin (default: truffle's version)
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
