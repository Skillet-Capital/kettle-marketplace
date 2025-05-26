// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import { UpgradeableBeacon } from "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import { BeaconProxy } from "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";

import { ProxyAdmin } from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import { TransparentUpgradeableProxy } from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import { Create2 } from "@openzeppelin/contracts/utils/Create2.sol";

import { IKettleAssetFactory } from './IKettleAssetFactory.sol';
import { KettleAsset } from './KettleAsset.sol';

/// @title Kettle Asset Factory
/// @notice Deploys and manages upgradeable KettleAsset proxies via a beacon pattern
contract KettleAssetFactory is Initializable, OwnableUpgradeable, IKettleAssetFactory {
    using Strings for uint256;

    address public kettleAssetImplementation;
    UpgradeableBeacon public beacon;

    string public BASE_URI;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    mapping(address => bool) public isKettleAsset;
    mapping(address => mapping(bytes32 => bool)) public roles;

    mapping(address => bool) public operators;
    mapping(address => bool) public lockedContracts;
    mapping(address => mapping(uint256 => bool)) public lockedTokens;
    mapping(address => mapping(address => mapping(address => mapping(uint256 => bool)))) public approvedTransfers;

    uint256[50] private _gap;

    /// @notice Initializes the factory, owner, and beacon
    /// @param owner The address to receive the default admin & minter roles
    /// @param _implementation The initial implementation for KettleAsset
    function initialize(address owner, address _implementation) public initializer {
        __Ownable_init(owner);

        kettleAssetImplementation = _implementation;

        bytes memory bytecode = abi.encodePacked(
            type(UpgradeableBeacon).creationCode,
            abi.encode(kettleAssetImplementation, address(this))
        );

        bytes32 salt = keccak256("kettle-asset-factory");

        address target = Create2.deploy(0, salt, bytecode);
        require(target != address(0), "KettleAssetFactory: Failed to deploy beacon");

        beacon = UpgradeableBeacon(target);

        roles[owner][MINTER_ROLE] = true;
    }
    
    // =============================================================
    //                      Factory Methods
    // =============================================================

    /// @notice Deploys a new KettleAsset proxy using CREATE2
    /// @dev Requires MINTER_ROLE
    /// @param salt Unique salt for deterministic address
    /// @param brand Brand name for metadata
    /// @param model Model name for metadata
    /// @param ref Reference string for metadata
    /// @return proxy Address of the newly deployed proxy
    function deployModel(
        bytes32 salt,
        string memory brand, 
        string memory model, 
        string memory ref
    ) public hasRole(MINTER_ROLE) returns (address proxy) {
        bytes memory data = abi.encodeWithSelector(
            KettleAsset.initialize.selector,
            address(this)
        );

        bytes memory bytecode = abi.encodePacked(
            type(BeaconProxy).creationCode,
            abi.encode(address(beacon), data)
        );

        proxy = Create2.deploy(0, salt, bytecode);
        require(proxy != address(0), "KettleAssetFactory: Failed to deploy proxy");

        KettleAsset asset = KettleAsset(proxy);

        asset.updateMetadata(brand, model, ref);

        isKettleAsset[proxy] = true;

        emit KettleAssetDeployed(proxy, brand, model, ref);
    }

    /// @notice Computes the address of a KettleAsset proxy without deploying
    /// @param salt Salt used during deployment
    /// @return The deterministic address for the proxy
    function getModelAddress(
      bytes32 salt
    ) external view returns (address) {
        bytes memory data = abi.encodeWithSelector(
            KettleAsset.initialize.selector,
            address(this)
        );

        bytes memory bytecode = abi.encodePacked(
            type(BeaconProxy).creationCode,
            abi.encode(address(beacon), data)
        );

        return Create2.computeAddress(salt, keccak256(bytecode), address(this));
    }

    // =============================================================
    //                      Proxy Methods
    // =============================================================

    /// @notice Upgrades the KettleAsset implementation in the beacon
    /// @dev Only callable by the contract owner
    /// @param newImplementation Address of the new implementation contract
    function upgradeImplementation(
        address newImplementation
    ) public onlyOwner {
        require(newImplementation != address(0), "KettleAssetFactory: new implementation is the zero address");
        
        beacon.upgradeTo(newImplementation);

        kettleAssetImplementation = newImplementation;
    }

    // =============================================================
    //                      Access Control Methods
    // =============================================================

    /// @notice Sets a role for an account
    /// @dev Only callable by the contract owner
    /// @param role The role to set
    /// @param account The account to set the role for
    /// @param privilege Whether to grant or revoke the role
    function setRole(
        bytes32 role, 
        address account, 
        bool privilege
    ) public onlyOwner {
        roles[account][role] = privilege;
        emit RoleGranted(account, role, privilege);
    }

    // =============================================================
    //                      Operator Methods
    // =============================================================

    /// @notice Whitelists or removes an operator for factory actions
    /// @dev Only callable by the contract owner
    /// @param operator Address of the operator
    /// @param approved true to whitelist, false to remove
    function approveOperator(
        address operator, 
        bool approved
    ) public onlyOwner {
        operators[operator] = approved;
        emit OperatorWhitelisted(operator, approved);
    }

    /// @notice Approves or revokes a transfer for a specific token
    /// @dev Only callable by the contract owner
    /// @param asset Address of the asset contract
    /// @param from Sender address
    /// @param to Recipient address
    /// @param tokenId ID of the token
    /// @param approved true to approve, false to revoke
    function approveTransfer(
        address asset,
        address from,
        address to,
        uint256 tokenId,
        bool approved
    ) public onlyOwner {
        approvedTransfers[asset][from][to][tokenId] = approved;
        emit TransferApproved(asset, from, to, tokenId, approved);
    }

    // =============================================================
    //                      Supply Controls
    // =============================================================

    /// @notice Mints a new token on a KettleAsset
    /// @dev Requires MINTER_ROLE
    /// @param asset Proxy address of the asset contract
    /// @param to Recipient address
    /// @param id Token ID to mint
    function mint(
        address asset, 
        address to, 
        uint256 id
    ) public hasRole(MINTER_ROLE) {
        KettleAsset(asset).mint(to, id);
    }

    /// @notice Revokes (burns) a token on a KettleAsset
    /// @dev Requires MINTER_ROLE
    /// @param asset Proxy address of the asset contract
    /// @param tokenId ID of the token to revoke
    function revokeToken(
        address asset, 
        uint256 tokenId
    ) public hasRole(MINTER_ROLE) {
        KettleAsset(asset).revokeToken(tokenId);
        emit KettleAssetRevoked(asset, tokenId);
    }

    /// @notice Called by KettleAsset proxies to clear approval after transfer
    /// @dev Only callable by registered KettleAsset contracts
    /// @param asset Address of the asset contract
    /// @param from Sender address
    /// @param to Recipient address
    /// @param tokenId ID of the transferred token
    function indexTransfer(
        address asset,
        address from,
        address to,
        uint256 tokenId
    ) external onlyKettleAsset(asset) {
        approvedTransfers[asset][from][to][tokenId] = false;
        emit KettleAssetTransferred(asset, from, to, tokenId);
    }

    // =============================================================
    //                      Transfer Controls
    // =============================================================

    /// @notice Locks or unlocks all transfers for an asset contract
    /// @dev Only callable by the contract owner
    /// @param asset Address of the asset contract
    /// @param locked true to lock, false to unlock
    function lockContract(
        address asset, 
        bool locked
    ) public onlyOwner() {
        lockedContracts[asset] = locked;
        emit ContractLocked(asset, locked);
    }

    /// @notice Locks or unlocks a specific token
    /// @dev Only callable by the contract owner
    /// @param asset Address of the asset contract
    /// @param tokenId ID of the token to lock/unlock
    /// @param locked true to lock, false to unlock
    function lockToken(address asset, uint256 tokenId, bool locked) public onlyOwner() {
        lockedTokens[asset][tokenId] = locked;
        emit TokenLocked(asset, tokenId, locked);
    }

    // =============================================================
    //                      Metadata Methods
    // =============================================================

    /// @notice Sets the base URI for token metadata
    /// @dev Only callable by the contract owner
    /// @param _baseURI New base URI string
    function setBaseURI(string memory _baseURI) public onlyOwner {
        BASE_URI = _baseURI;
    }

    /// @notice Updates metadata (brand/model/ref) for an asset contract
    /// @dev Only callable by the contract owner
    /// @param asset Address of the asset contract
    /// @param brand New brand string
    /// @param model New model string
    /// @param ref  New reference string
    function setMetadata(
        address asset,
        string memory brand,
        string memory model,
        string memory ref
    ) public onlyOwner {
        KettleAsset(asset).updateMetadata(brand, model, ref);
        emit KettleAssetMetadataUpdated(asset, brand, model, ref);
    }

    /// @notice Constructs and returns the token URI for a given asset/tokenId
    /// @param asset Address of the asset contract
    /// @param tokenId ID of the token
    /// @return A string representing the full token URI
    function tokenURI(
        address asset, 
        uint256 tokenId
    ) public view returns (string memory) { 
        string memory identifier = string.concat(
            Strings.toHexString(uint256(uint160(asset))),
            "/",
            Strings.toString(tokenId)
        );

        if (bytes(BASE_URI).length == 0) {
            return identifier;
        }

        return string.concat(BASE_URI, "/", identifier);
    }

    // =============================================================
    //                      Modifiers
    // =============================================================

    /// @dev Ensures caller has a specific role or is owner
    modifier hasRole(bytes32 role) {
        require(roles[msg.sender][role] || msg.sender == owner(), "invalid role");
        _;
    }

    /// @dev Restricts call to registered KettleAsset proxies
    modifier onlyKettleAsset(address asset) {
        require(isKettleAsset[asset], "asset not registered");
        _;
    }
}
