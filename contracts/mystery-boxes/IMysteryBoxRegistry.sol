// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface IMysteryBoxRegistry {
    function trackBox(uint256 tokenId, address minter) external;

    function trackBoxParameters(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        uint256 price,
        address currency,
        address paymentRecipient,
        uint256 privateMintOpenTime,
        uint256 publicMintOpenTime
    ) external;

    function trackBoxReveal(
        uint256 tokenId,
        address minter,
        address prizeCollection,
        uint256 prizeTokenId
    ) external;

    event BoxRegistered(address boxContract, bool isRegistered);

    event BoxTracked(address boxContract, uint256 tokenId, address minter);

    event BoxInitialized(
        address boxContract,
        string name,
        string symbol,
        uint256 totalSupply,
        uint256 price,
        address currency,
        address paymentRecipient,
        uint256 privateMintOpenTime,
        uint256 publicMintOpenTime
    );

    event BoxRevealed(
        address boxContract,
        uint256 tokenId,
        address minter,
        address prizeCollection,
        uint256 prizeTokenId
    );
}
