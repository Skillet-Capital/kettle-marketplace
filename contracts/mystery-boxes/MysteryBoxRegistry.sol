// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IMysteryBoxRegistry.sol";

contract MysteryBoxRegistry is IMysteryBoxRegistry, Ownable {
    constructor() Ownable(msg.sender) {}

    mapping(address => bool) private _isMysteryBox;

    function trackBoxParameters(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint256 price,
        address currency,
        address paymentRecipient,
        uint256 privateMintOpenTime,
        uint256 publicMintOpenTime
    ) external onlyMysteryBox {
        emit BoxInitialized({
            boxContract: msg.sender,
            name: name,
            symbol: symbol,
            totalSupply: totalSupply,
            price: price,
            currency: currency,
            paymentRecipient: paymentRecipient,
            privateMintOpenTime: privateMintOpenTime,
            publicMintOpenTime: publicMintOpenTime
        });
    }

    function trackBox(
        uint256 tokenId,
        address minter
    ) external onlyMysteryBox {
        emit BoxTracked({
            boxContract: msg.sender,
            tokenId: tokenId,
            minter: minter
        });
    }

    function trackBoxReveal(
        uint256 tokenId,
        address minter,
        address prizeCollection,
        uint256 prizeTokenId
    ) external onlyMysteryBox {
        emit BoxRevealed({
            boxContract: msg.sender,
            tokenId: tokenId,
            minter: minter,
            prizeCollection: prizeCollection,
            prizeTokenId: prizeTokenId
        });
    }

    function registerMysteryBox(address mysteryBox) public {
        _isMysteryBox[mysteryBox] = true;
        emit BoxRegistered(mysteryBox, true);
    }

    function unregisterMysteryBox(address mysteryBox) public {
        _isMysteryBox[mysteryBox] = false;
        emit BoxRegistered(mysteryBox, false);
    }

    function isMysteryBox(address mysteryBox) public view returns (bool) {
        return _isMysteryBox[mysteryBox];
    }

    modifier onlyMysteryBox() {
        require(_isMysteryBox[msg.sender], "Mystery box not registered");
        _;
    }
}
