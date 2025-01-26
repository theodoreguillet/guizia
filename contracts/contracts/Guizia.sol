// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Guizia is ERC20 {
    constructor(uint256 initialSupply) ERC20("Guizia", "GUIZIA") {
        // Mint the total supply to the deployer's address at deployment
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }
}
