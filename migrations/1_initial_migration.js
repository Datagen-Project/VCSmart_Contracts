const DataGen = artifacts.require(".DataGen.sol");
const VCTemplate = artifacts.require(".VCTemplate.sol");

const vcWallet = "";

module.exports = async function (deployer) {
  await deployer.deploy(DataGen);
  await deployer.deploy(VCTemplate, DataGen.address, vcWallet);
};
