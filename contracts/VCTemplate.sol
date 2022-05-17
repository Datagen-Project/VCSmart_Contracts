// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract VCTemplate is Ownable, ReentrancyGuard {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;
  
  /* First release tokens */
  uint256 public constant frAmount = 750000 * (10**18);
  /* First release start time(21/12/2023 00:00:00) */
  uint256 public constant frStart = 1703116800;
  /* Second release tokens */
  uint256 public constant srAmount = 750000 * (10**18);
  /* Second release start time */
  uint256 public constant srStart = 1734220800;
  /* the address of the token contract */
  IERC20 public dataGen;
  /* the vc wallet where distribute the #DG */
  address public vcWallet; 


  /*  initialization, set the token address */
  constructor(IERC20 _dataGen, address _vcWallet) {
    dataGen = _dataGen;
    vcWallet = _vcWallet;
  }

  event SetVcWalletAddress(address indexed user, address indexed vcWallet); 

  modifier firstRelease() {
    require(block.timestamp >= frStart, "Pool is Still locked.");
    _;
  }

  modifier VcWalletOwner() {
    require(msg.sender == vcWallet, "You are not the Vc owner");
    _;
  }

  function releaseDataGen() public firstRelease nonReentrant {
    require(dataGen.balanceOf(address(this)) > 0, "Zero #DG left.");

    if(block.timestamp < srStart ) {
      uint256 epochs = block.timestamp.sub(frStart).div(30 * 24 * 3600).add(1);
      if (epochs > 24) epochs = 24;

      uint256 balance = dataGen.balanceOf(address(this));
      uint256 leftAmount = frAmount.sub(frAmount.mul(epochs).div(24));

      require(balance.sub(srAmount) > leftAmount, "Already released.");
      uint256 transferAmount = balance.sub(srAmount).sub(leftAmount);
      if(transferAmount > 0) {
        require(balance.sub(srAmount) >= transferAmount, "Wrong amount to transfer");
        
        dataGen.safeTransfer(vcWallet, transferAmount);
      }
    }
	}

  /* companyWallet update, only owner can do. */
  function setCompanyWallet(address _vcWallet) public VcWalletOwner {
    vcWallet = _vcWallet;
    emit SetVcWalletAddress(msg.sender, _vcWallet);
  }

  function checkFunds() public view returns (uint256) {
		return dataGen.balanceOf(address(this));
	}
}
