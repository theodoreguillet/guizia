// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

//  ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓████████▓▒░▒▓█▓▒░░▒▓██████▓▒░  
// ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
// ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░    ░▒▓██▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
// ░▒▓█▓▒▒▓███▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░  ░▒▓██▓▒░  ░▒▓█▓▒░▒▓████████▓▒░ 
// ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓██▓▒░    ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
// ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
//  ░▒▓██████▓▒░ ░▒▓██████▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░
// Made with ♥︎ by the Guizia Team 

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20Burnable is IERC20 {
    function burn(uint256 value) external;
    function burnFrom(address account, uint256 value) external;
}

contract GuiziaNFT is ERC721URIStorage {
    uint256 private _tokenIds;

    address public owner;

    IERC20Burnable public token; // Reference to the ERC-20 token contract
    uint256 public creditCost = 55555; // Cost in ERC-20 tokens to buy credit

    mapping(address => uint256) public credits; // Tracks user credits

    bool public mintingOpen = true; // Boolean to control minting

    mapping(address => uint256[]) private _ownedTokens; // Tracks owned tokens

    constructor(
        address _tokenAddress // ERC-20 token contract address
    ) ERC721("Guizia", "GUIZIA") {
        owner = msg.sender;
        token = IERC20Burnable(_tokenAddress); // Initialize ERC-20 token reference
    }

    // Function to buy credit using the Guizia ERC-20 token
    function buyCredit(uint256 amount) public {
        require(amount > 0, "Credit amount must be greater than zero"); // Ensure minting is open
        // Burn `creditCost` tokens from the caller 
        token.burnFrom(msg.sender, creditCost*amount);

        // Increment the caller's credit balance
        credits[msg.sender] += amount;
    }

    // Function to check the credit balance of a user
    function getCredits(address userAddress) public view returns (uint256) {
        return credits[userAddress];
    }

    // Mint function that requires a user to have credit
    function mint(address userAddress, string memory tokenURI) public returns (uint256){
        require(mintingOpen, "Minting is currently disabled"); // Ensure minting is open
        require(credits[userAddress] > 0, "Insufficient credit"); // Check if the user has sufficient credit

        // Decrement the user's credit balance
        credits[userAddress] -= 1;

        // Mint the token to the specified address
        _tokenIds += 1;

        uint256 newItemId = _tokenIds;
        _mint(userAddress, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _ownedTokens[userAddress].push(newItemId);

        return newItemId;
    }

    // Get all token ids of a user address
    function tokenIdsOf(address ownerAddress) public view returns (uint256[] memory) {
        return _ownedTokens[ownerAddress];
    }

    // Function to toggle or set the minting status (only callable by the owner)
    function setMintingOpen(bool _mintingOpen) public {
        require(msg.sender == owner, "Only the owner can change minting status");
        mintingOpen = _mintingOpen;
    }

    // Function to update the credit cost (only callable by the owner)
    function setCreditCost(uint256 _newCost) public {
        require(msg.sender == owner, "Only the owner can change the credit cost");
        require(_newCost > 0, "Credit cost must be greater than zero");
        creditCost = _newCost;
    }

    // Function to change the ERC-20 token address (only callable by the owner)
    function setTokenAddress(address _newTokenAddress) public {
        require(msg.sender == owner, "Only the owner can change the token address");
        require(_newTokenAddress != address(0), "Token address cannot be the zero address");
        token = IERC20Burnable(_newTokenAddress);
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }
}
