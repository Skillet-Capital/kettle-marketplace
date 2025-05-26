// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import { ERC721Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import { IKettleAssetFactory } from './IKettleAssetFactory.sol';

contract KettleAsset is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    IKettleAssetFactory public factory;

    string public brand;
    string public model;
    string public ref;

    uint256[50] private _gap;

    function initialize(address factoryAddress) public initializer {
        __ERC721_init("Kettle", "KETTLE");
        __Ownable_init(factoryAddress);

        factory = IKettleAssetFactory(factoryAddress);
    }

    // =============================================================
    //                      Metadata Methods
    // =============================================================

    /// @notice Updates the metadata for the asset
    /// @dev Only callable by the owner
    /// @param _brand New brand string
    /// @param _model New model string
    /// @param _ref New reference string
    function updateMetadata(
        string memory _brand, 
        string memory _model, 
        string memory _ref
    ) public onlyOwner {
        brand = _brand;
        model = _model;
        ref = _ref;
    }

    // =============================================================
    //                      Supply Controls
    // =============================================================

    /// @notice Mints a new token to an address
    /// @dev Only callable by the owner
    /// @param to Recipient address
    /// @param id Token ID to mint
    function mint(
        address to, 
        uint256 id
    ) public onlyOwner {
        _safeMint(to, id);
        factory.indexTransfer(address(this), address(0), to, id);
    }

    /// @notice Burns a token
    /// @dev Only callable by the token owner
    /// @param tokenId Token ID to burn
    function burn(
        uint256 tokenId
    ) public {
        require(msg.sender == ownerOf(tokenId), "KettleAsset: caller is not the owner");

        address owner = ownerOf(tokenId);
        _burn(tokenId);
        factory.indexTransfer(address(this), owner, address(0), tokenId);
    }

    /// @notice Revokes a token
    /// @dev Only callable by the owner
    /// @param tokenId Token ID to revoke
    function revokeToken(
        uint256 tokenId
    ) public onlyOwner {
        address owner = ownerOf(tokenId);
        _burn(tokenId);
        factory.indexTransfer(address(this), owner, address(0), tokenId);
    }

    /// @notice Returns the token URI for a given token ID
    /// @param tokenId Token ID to get the URI for
    /// @return The token URI
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return factory.tokenURI(address(this), tokenId);
    }

    // =============================================================
    //                      Transfer Controls
    // =============================================================

    /// @notice Transfers a token from one address to another
    /// @dev Only callable by an approved operator or the owner
    /// @param from Sender address
    /// @param to Recipient address
    /// @param id Token ID to transfer
    function transferFrom(
        address from,
        address to,
        uint256 id
    ) public virtual override {
        require(!factory.lockedContracts(address(this)), "CONTRACT_LOCKED");
        require(!factory.lockedTokens(address(this), id), "TOKEN_LOCKED");

        require(
            factory.operators(msg.sender) || factory.approvedTransfers(address(this), from, to, id),
            "NOT_AUTHORIZED_OPERATOR_OR_TRANSFER"
        );

        super.transferFrom(from, to, id);

        factory.indexTransfer(address(this), from, to, id);
    }
}
