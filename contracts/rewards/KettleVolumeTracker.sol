// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract KettleVolumeTracker is Initializable, ERC20Upgradeable, OwnableUpgradeable {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(address => mapping(bytes32 => bool)) public roles;
    mapping(address => bool) public operators;

    event OperatorApproved(address indexed account, bool status);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address owner,
        string memory name,
        string memory symbol
    ) public initializer {
        __ERC20_init(name, symbol);
        __Ownable_init(owner);

        operators[owner] = true;
        roles[owner][MINTER_ROLE] = true;
    }

    function mint(address to, uint256 amount) public hasRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function burn(address account, uint256 amount) public hasRole(MINTER_ROLE) {
        _burn(account, amount);
    }

    function approveOperator(address account, bool status) public onlyOwner {
        operators[account] = status;
        emit OperatorApproved(account, status);
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        // Allow minting and burning without restrictions
        if (from == address(0) || to == address(0)) {
            super._update(from, to, value);
            return;
        }
        require(
            operators[from] && operators[to],
            "Transfer restricted: addresses must be operators"
        );
        super._update(from, to, value);
    }

    /// @dev Ensures caller has a specific role or is owner
    modifier hasRole(bytes32 role) {
        require(roles[msg.sender][role] || msg.sender == owner(), "invalid role");
        _;
    }
}
