// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract RewardToken is ERC20, Ownable {
address public minter;


error NotMinter();


event MinterUpdated(address indexed newMinter);


constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) Ownable(msg.sender) {}


function setMinter(address m) external onlyOwner {
minter = m;
emit MinterUpdated(m);
}


function mint(address to, uint256 amount) external {
if (msg.sender != minter) revert NotMinter();
_mint(to, amount);
}
}