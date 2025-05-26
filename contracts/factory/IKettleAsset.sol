// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IKettleAsset {
    function setBaseURI(string memory baseURI) external;
    function lockToken(uint256 tokenId, bool locked) external;
    function approveOperator(address operator, bool approved) external;
    function approveTransfer(address from, address to, uint256 tokenId, bool approved) external;
    function revokeToken(uint256 tokenId) external;

    event OperatorWhitelisted(
        address indexed operator,
        bool approved
    );

    event TokenLocked(
        uint256 indexed tokenId,
        bool locked
    );

    event TransferApproved(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId,
        bool approved
    );

    event TokenRevoked(
        uint256 indexed tokenId
    );
}
