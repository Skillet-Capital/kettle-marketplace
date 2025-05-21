// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import {IKettleAsset} from "./interfaces/IKettleAsset.sol";

contract KettleAsset is IKettleAsset, Initializable, ERC721Upgradeable, OwnableUpgradeable {
    using Strings for uint256;

    string public BASE_URI;

    mapping(address => bool) public operators;
    mapping(uint256 => bool) public lockedTokens;
    mapping(address => mapping(address => mapping(uint256 => bool))) public approvedTransfers;


    uint256[50] private _gap;

    function initialize(address owner) public initializer {
        __ERC721_init("Kettle", "KETTLE");
        __Ownable_init(owner);
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        BASE_URI = baseURI;
    }

    // =====================================
    //          TRANSFER CONTROLS
    // =====================================

    function lockToken(uint256 tokenId, bool locked) public onlyOwner {
        lockedTokens[tokenId] = locked;
        emit TokenLocked(tokenId, locked);
    }

    function approveOperator(address operator, bool approved) public onlyOwner {
        operators[operator] = approved;
        emit OperatorWhitelisted(operator, approved);
    }

    function approveTransfer(
        address from,
        address to,
        uint256 tokenId,
        bool approved
    ) public onlyOwner {
        _approveTransfer(from, to, tokenId, approved);
    }

    function _approveTransfer(
        address from,
        address to,
        uint256 tokenId,
        bool approved
    ) internal {
        approvedTransfers[from][to][tokenId] = approved;
        emit TransferApproved(from, to, tokenId, approved);
    }

    // =====================================
    //          ERC721 IMPLEMENTATION
    // =====================================

    function mint(address to, uint256 id) public onlyOwner {
        _safeMint(to, id);
    }

    function revokeToken(uint256 tokenId) public onlyOwner {
        _burn(tokenId);
        emit TokenRevoked(tokenId);
    }

    function tokenURI(address asset, uint256 tokenId) public view returns (string memory) { 
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

    // =====================================
    //          TRANSFER CONTROLS
    // =====================================

    function transferFrom(
        address from,
        address to,
        uint256 id
    ) public virtual override {
        require(!lockedTokens[id], "TOKEN_LOCKED");

        require(
            operators[msg.sender] || approvedTransfers[from][to][id],
            "NOT_AUTHORIZED_OPERATOR_OR_TRANSFER"
        );

        super.transferFrom(from, to, id);

        _approveTransfer(from, to, id, false);
    }
}
