const DataGen = artifacts.require("./DataGen.sol");
const VCTemplate = artifacts.require("./VCTemplate.sol");
const TVentures = artifacts.require("./T_Ventures_VC.sol");

const vcWallet = "0xF9d431E1dd5088E1Ee252A2B9250363f07e34AA0";

module.exports = async function (deployer) {
  await deployer.deploy(DataGen);
  await deployer.deploy(VCTemplate, DataGen.address, vcWallet);
  await deployer.deploy(TVentures, DataGen.address, vcWallet);
};
