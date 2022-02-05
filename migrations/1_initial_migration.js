const Migrations = artifacts.require("Migrations");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(Token);
  //const tokenMock = await Token.deployed();
  //await tokenMock.mint("0xFD5D8ae0d003f81cc20971C7d37e806bbaBD50C2", '1000000000000000000000');
};
