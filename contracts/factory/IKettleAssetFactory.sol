// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface IKettleAssetFactory {
    function operators(address) external view returns (bool);

    function lockedContracts(address) external view returns (bool);

    function lockedTokens(address, uint256) external view returns (bool);

    function approvedTransfers(
        address,
        address,
        address,
        uint256
    ) external view returns (bool);

    function tokenURI(
        address asset,
        uint256 tokenId
    ) external view returns (string memory);

    function indexTransfer(
        address asset,
        address from,
        address to,
        uint256 tokenId
    ) external;

    function isKettleAsset(address asset) external view returns (bool);

    event KettleAssetDeployed(
        address indexed asset,
        string brand,
        string model,
        string ref
    );

    event KettleAssetMetadataUpdated(
        address indexed asset,
        string brand,
        string model,
        string ref
    );

    event KettleAssetTransferred(
        address indexed asset,
        address indexed from,
        address indexed to,
        uint256 tokenId
    );

    event KettleAssetRevoked(
        address indexed asset,
        uint256 tokenId
    );

    event OperatorWhitelisted(address indexed operator, bool approved);

    event RoleGranted(address indexed account, bytes32 role, bool privilege);

    event TransferApproved(
        address indexed asset,
        address indexed from,
        address indexed to,
        uint256 tokenId,
        bool approved
    );

    event ContractLocked(address indexed asset, bool locked);

    event TokenLocked(address indexed asset, uint256 tokenId, bool locked);
}
