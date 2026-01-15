// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockStable is ERC20 {
    constructor() ERC20("MockUSD", "mUSD") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals()); // 1 million mUSD to deployer
    }

    function decimals() public pure override returns (uint8) {
        return 18; // or 6 if you want to simulate USDC/USDT
    }
}
