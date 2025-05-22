// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";

contract MysteryBoxV1 is ERC721, Ownable, IEntropyConsumer {
    using SafeERC20 for IERC20;

    // State variables
    uint256 public immutable totalSupply;
    uint256 public immutable price;
    IERC20 public immutable currency;
    address public immutable recipient;
    uint256 private _nextTokenId = 1;
    mapping(uint256 => uint256) public boxToNumber;
    bool public whitelistOnly;
    mapping(address => bool) public whitelist;
    
    // Pyth Entropy setup
    IEntropy public pythEntropy;
    uint64 public entropyRequestId;
    bool public entropyRequested;
    bool public boxesShuffled;
    
    // Events
    event BoxMinted(address indexed minter, address indexed recipient, uint256 indexed tokenId);
    event BoxesShuffled(uint256[] boxNumbers);
    event EntropyRequested(uint64 requestId);
    event EntropyReceived(uint64 sequenceNumber, address provider, bytes32 randomData);
    event WhitelistUpdated(address indexed account, bool status);
    event WhitelistOnlyUpdated(bool status);

    constructor(
        uint256 _totalSupply,
        uint256 _price,
        address _currency,
        address _recipient,
        address _pythEntropy,
        bool _whitelistOnly
    ) ERC721("Mystery Box", "MBOX") Ownable(msg.sender) {
        require(_totalSupply > 0, "Total supply must be greater than 0");
        require(_price > 0, "Price must be greater than 0");
        require(_currency != address(0), "Invalid currency address");
        require(_recipient != address(0), "Invalid recipient address");
        require(_pythEntropy != address(0), "Invalid Pyth entropy address");
        
        totalSupply = _totalSupply;
        price = _price;
        currency = IERC20(_currency);
        recipient = _recipient;
        pythEntropy = IEntropy(_pythEntropy);
        whitelistOnly = _whitelistOnly;
    }

    function mint(address minter) external {
        require(_nextTokenId <= totalSupply, "All boxes have been minted");
        require(!boxesShuffled, "Boxes already shuffled");
        if (whitelistOnly) {
            require(whitelist[minter], "Minter not whitelisted");
        }
        
        // Transfer payment from msg.sender to recipient
        currency.safeTransferFrom(msg.sender, recipient, price);
        
        // Mint the token to the minter
        uint256 tokenId = _nextTokenId++;
        _safeMint(minter, tokenId);
        
        emit BoxMinted(msg.sender, minter, tokenId);
    }

    function requestShuffle(bytes32 seed) external payable onlyOwner {
        require(_nextTokenId > totalSupply, "All boxes must be minted before shuffling");
        require(!entropyRequested, "Entropy already requested");
        require(!boxesShuffled, "Boxes already shuffled");

        entropyRequested = true;
        address provider = pythEntropy.getDefaultProvider();
        uint256 fee = pythEntropy.getFee(provider);

        entropyRequestId = pythEntropy.requestWithCallback{value: fee}(
            provider,
            seed
        );

        emit EntropyRequested(entropyRequestId);
    }

    function entropyCallback(
        uint64 sequenceNumber,
        address provider,
        bytes32 randomData
    ) internal override {
        require(
            msg.sender == address(pythEntropy),
            "Only Pyth entropy can call this function"
        );
        require(sequenceNumber == entropyRequestId, "Request ID mismatch");
        require(!boxesShuffled, "Boxes already shuffled");

        // Mark boxes as shuffled
        boxesShuffled = true;

        // Create array of numbers 1 to totalSupply
        uint256[] memory numbers = new uint256[](totalSupply);
        for (uint256 i = 0; i < totalSupply; i++) {
            numbers[i] = i + 1; // Start from 1
        }
        
        // Fisher-Yates shuffle using the random data
        for (uint256 i = totalSupply - 1; i > 0; i--) {
            uint256 j = uint256(keccak256(abi.encodePacked(randomData, i))) % (i + 1);
            uint256 temp = numbers[i];
            numbers[i] = numbers[j];
            numbers[j] = temp;
        }
        
        // Assign shuffled numbers to boxes (token IDs start at 1)
        for (uint256 i = 0; i < totalSupply; i++) {
            boxToNumber[i + 1] = numbers[i];
        }
        
        emit EntropyReceived(sequenceNumber, provider, randomData);
        emit BoxesShuffled(numbers);
    }

    function getBoxNumber(uint256 tokenId) external view returns (uint256) {
        require(tokenId > 0 && tokenId <= totalSupply, "Box does not exist");
        return boxToNumber[tokenId];
    }

    // Whitelist management functions
    function setWhitelistStatus(address account, bool status) external onlyOwner {
        whitelist[account] = status;
        emit WhitelistUpdated(account, status);
    }

    function setWhitelistOnly(bool status) external onlyOwner {
        whitelistOnly = status;
        emit WhitelistOnlyUpdated(status);
    }

    // Override transfer functions to make tokens soul-bound
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        revert("Soul-bound token: transfer not allowed");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        revert("Soul-bound token: transfer not allowed");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override {
        revert("Soul-bound token: transfer not allowed");
    }

    // Required by IEntropyConsumer interface
    function getEntropy() internal view override returns (address) {
        return address(pythEntropy);
    }
}
