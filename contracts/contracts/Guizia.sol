// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Guizia is ERC20 {
    constructor(uint256 initialSupply) ERC20("Guizia", "GUIZIA") {
        // Mint the total supply to the deployer's address at deployment
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }

    /**
     * @dev Destroys a `value` amount of tokens from the caller.
     *
     * See {ERC20-_burn}.
     */
    function burn(uint256 value) public virtual returns (bool){
        _burn(_msgSender(), value);
        return true;
    }

    /**
     * @dev Destroys a `value` amount of tokens from `account`, deducting from
     * the caller's allowance.
     *
     * See {ERC20-_burn} and {ERC20-allowance}.
     *
     * Requirements:
     *
     * - the caller must have allowance for ``accounts``'s tokens of at least
     * `value`.
     */
    function burnFrom(address account, uint256 value) public virtual returns (bool){
        _spendAllowance(account, _msgSender(), value);
        _burn(account, value);
        return true;
    }
}
