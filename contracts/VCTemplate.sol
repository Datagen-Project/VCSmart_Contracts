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
  uint256 public constant amount = 240000 * (10**18);
  /* First release start time(21/12/2023 00:00:00) */
  uint256 public constant releaseStart = 1652799484;
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
    require(block.timestamp >= releaseStart, "Pool is Still locked.");
    _;
  }

  modifier VcWalletOwner() {
    require(msg.sender == vcWallet, "You are not the Vc owner");
    _;
  }

  function releaseDataGen() public firstRelease nonReentrant {
    require(dataGen.balanceOf(address(this)) > 0, "Zero #DG left.");

      uint256 epochs = block.timestamp.sub(releaseStart).div(30 * 24 * 3600).add(1);
      if (epochs > 24) epochs = 24;

      // 1 - balance = 100.000
      uint256 balance = dataGen.balanceOf(address(this));
      
      // 1 - leftAmount = 90.000
      uint256 leftAmount = amount.sub(amount.mul(epochs).div(24));

      require(balance > leftAmount, "Already released.");
      uint256 transferAmount = balance.sub(leftAmount);
      if(transferAmount > 0) {
        dataGen.safeTransfer(vcWallet, transferAmount);
    }
	}

  /* vc wallet update, only owner of the vc wallet can do it. */
  function setVcWallet(address _vcWallet) public VcWalletOwner {
    vcWallet = _vcWallet;
    emit SetVcWalletAddress(msg.sender, _vcWallet);
  }

  function checkFunds() public view returns (uint256) {
		return dataGen.balanceOf(address(this));
	}
}
