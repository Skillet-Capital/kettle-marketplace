// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";

import "./IMysteryBoxRegistry.sol";
import "./IMysteryBoxV1.sol";

contract MysteryBoxV1 is ERC721, Ownable, IEntropyConsumer, IMysteryBoxV1 {
    using SafeERC20 for IERC20;

    // State variables
    uint256 public totalSupply;
    uint256 public price;
    IERC20 public currency;
    address public paymentRecipient;

    IMysteryBoxRegistry public immutable registry;
    IKettleAssetFactory public immutable kettleAssetFactory;
    
    // Mint times
    uint256 public privateMintOpenTime;
    uint256 public publicMintOpenTime;

    // Pyth Entropy setup
    IEntropy public pythEntropy;
    uint64 public entropyRequestId;
    uint256 public randomDataValue;
    bool public entropyRequested;
    bool public boxesShuffled;
    
    // ERC721 state
    bool public initialized;
    uint256 private _nextTokenId = 1;
    mapping(address => bool) public whitelist;

    // Results state
    mapping(uint256 => uint256) public results;
    mapping(uint256 => Prize) public prizes;

    constructor(
        address _registry,
        address _kettleAssetFactory,
        address _pythEntropy,
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) Ownable(msg.sender) {
        require(_registry != address(0), "Invalid registry address");
        require(_kettleAssetFactory != address(0), "Invalid factory address");
        require(_pythEntropy != address(0), "Invalid Pyth entropy address");

        registry = IMysteryBoxRegistry(_registry);
        pythEntropy = IEntropy(_pythEntropy);
        kettleAssetFactory = IKettleAssetFactory(_kettleAssetFactory);
    }

    function initialize(
        uint256 _totalSupply,
        uint256 _price,
        address _currency,
        address _paymentRecipient,
        uint256 _privateMintOpenTime,
        uint256 _publicMintOpenTime
    ) external onlyOwner {
        require(!initialized, "Already initialized");
        require(_totalSupply > 0, "Total supply must be greater than 0");
        require(_price > 0, "Price must be greater than 0");
        require(_currency != address(0), "Invalid currency address");
        require(
            _paymentRecipient != address(0),
            "Invalid payment recipient address"
        );

        // Validate mint times - if privateMintOpenTime is 0, it means no private mint phase
        if (_privateMintOpenTime > 0) {
            require(
                _publicMintOpenTime > _privateMintOpenTime,
                "Public mint must be after private mint"
            );
        }

        totalSupply = _totalSupply;
        price = _price;
        currency = IERC20(_currency);
        paymentRecipient = _paymentRecipient;
        privateMintOpenTime = _privateMintOpenTime;
        publicMintOpenTime = _publicMintOpenTime;
        initialized = true;

        // Notify the registry about the box parameters
        registry.trackBoxParameters(
            name(),
            symbol(),
            _totalSupply,
            _price,
            _currency,
            _paymentRecipient,
            _privateMintOpenTime,
            _publicMintOpenTime
        );

        emit BoxInitialized(
            name(),
            symbol(),
            _totalSupply,
            _price,
            _currency,
            _paymentRecipient,
            _privateMintOpenTime,
            _publicMintOpenTime
        );
    }

    /// @notice Set the prizes for the mystery box
    /// @param _prizes The prizes to set
    /// @dev The prizes are set in the order of the box IDs
    function setPrizes(Prize[] calldata _prizes) external onlyOwner {
        require(initialized, "Box not initialized");
        require(
            _prizes.length == totalSupply,
            "Prizes must match total supply"
        );

        for (uint256 i = 0; i < _prizes.length; i++) {
            Prize memory prize = _prizes[i];
            require(
                prize.collection != address(0),
                "Invalid collection address"
            );
            require(prize.tokenId > 0, "Invalid token ID");
            prizes[i + 1] = prize;
        }
    }

    function mint(address minter) external {
        require(initialized, "Box not initialized");
        require(minter != address(0), "Minter cannot be zero address");
        require(_nextTokenId <= totalSupply, "All boxes have been minted");
        require(!boxesShuffled, "Boxes already shuffled");

        // Check mint timing and whitelist requirements
        uint256 currentTime = block.timestamp;

        if (
            privateMintOpenTime > 0 &&
            currentTime >= privateMintOpenTime &&
            currentTime < publicMintOpenTime
        ) {
            // Private mint phase - check whitelist
            require(
                whitelist[minter],
                "Minter not whitelisted for private mint"
            );
        } else if (currentTime >= publicMintOpenTime) {
            // Public mint phase - no whitelist required
        } else {
            // Minting not open yet
            revert("Minting not open yet");
        }

        // Transfer payment from msg.sender to payment recipient
        currency.safeTransferFrom(msg.sender, paymentRecipient, price);

        // Mint the token to the minter
        uint256 tokenId = _nextTokenId++;
        _safeMint(minter, tokenId);

        // Register the box with the registry
        registry.trackBox(tokenId, minter);

        emit BoxMinted(msg.sender, minter, tokenId);
    }

    function reveal(uint256 boxTokenId) external {
        require(boxesShuffled, "Boxes not shuffled yet");
        require(ownerOf(boxTokenId) == msg.sender, "Not the owner of this box");

        // Get the result number for this box
        uint256 resultNumber = results[boxTokenId];
        require(resultNumber > 0, "Box result not found");

        // Get the prize for this result number
        Prize memory prize = prizes[resultNumber];
        require(prize.collection != address(0), "Prize not found");

        // Burn the mystery box
        _burn(boxTokenId);

        // Mint the prize to the box owner
        kettleAssetFactory.mint(prize.collection, msg.sender, prize.tokenId);
        registry.trackBoxReveal(boxTokenId, msg.sender, prize.collection, prize.tokenId);

        emit BoxRevealed(boxTokenId, msg.sender, prize.collection, prize.tokenId);
    }

    // Whitelist management functions
    function setWhitelistStatus(
        address account,
        bool status
    ) external onlyOwner {
        whitelist[account] = status;
        emit WhitelistUpdated(account, status);
    }

    function setWhitelistStatusBatch(
        address[] calldata accounts,
        bool status
    ) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            whitelist[accounts[i]] = status;
            emit WhitelistUpdated(accounts[i], status);
        }
    }

    // Mint time management functions
    function setMintTimes(
        uint256 _privateMintOpenTime,
        uint256 _publicMintOpenTime
    ) external onlyOwner {
        require(initialized, "Box not initialized");

        // Validate mint times - if privateMintOpenTime is 0, it means no private mint phase
        if (_privateMintOpenTime > 0) {
            require(
                _publicMintOpenTime > _privateMintOpenTime,
                "Public mint must be after private mint"
            );
        }

        privateMintOpenTime = _privateMintOpenTime;
        publicMintOpenTime = _publicMintOpenTime;

        // Notify the registry about the updated box parameters
        registry.trackBoxParameters(
            name(),
            symbol(),
            totalSupply,
            price,
            address(currency),
            paymentRecipient,
            _privateMintOpenTime,
            _publicMintOpenTime
        );

        emit MintTimesUpdated(_privateMintOpenTime, _publicMintOpenTime);
    }

    // View functions
    function getCurrentMintPhase() external view returns (string memory) {
        if (!initialized) return "uninitialized";

        uint256 currentTime = block.timestamp;

        if (
            privateMintOpenTime > 0 &&
            currentTime >= privateMintOpenTime &&
            currentTime < publicMintOpenTime
        ) {
            return "private";
        } else if (currentTime >= publicMintOpenTime) {
            return "public";
        } else {
            return "closed";
        }
    }

    function canMint(address minter) external view returns (bool) {
        if (!initialized || _nextTokenId > totalSupply || boxesShuffled) {
            return false; // Not initialized, all boxes minted, or already shuffled
        }

        uint256 currentTime = block.timestamp;

        if (
            privateMintOpenTime > 0 &&
            currentTime >= privateMintOpenTime &&
            currentTime < publicMintOpenTime
        ) {
            // Private mint phase - check whitelist
            return whitelist[minter];
        } else if (currentTime >= publicMintOpenTime) {
            // Public mint phase - anyone can mint
            return true;
        } else {
            // Minting not open yet
            return false;
        }
    }

    function totalMinted() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    function remainingSupply() external view returns (uint256) {
        if (!initialized) return 0;
        return totalSupply - (_nextTokenId - 1);
    }

    function getBoxResult(uint256 boxId) external view returns (uint256) {
        require(boxId > 0 && boxId < _nextTokenId, "Box does not exist");
        return results[boxId];
    }

    // Pyth Entropy functions
    function entropyRequest(bytes32 seed) external payable onlyOwner {
        require(initialized, "Box not initialized");
        require(_nextTokenId > totalSupply, "All boxes must be minted first");
        require(!entropyRequested, "Entropy already requested");

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
        require(randomDataValue == 0, "Random data already received");

        // Store the random data
        randomDataValue = uint256(randomData);

        emit EntropyReceived(sequenceNumber, provider, randomData);
    }

    function shuffleBoxes() external onlyOwner {
        require(randomDataValue != 0, "Random data not available");
        require(!boxesShuffled, "Boxes already shuffled");
        require(_nextTokenId > totalSupply, "All boxes must be minted first");

        boxesShuffled = true;

        // Create array of numbers 1 to totalSupply
        uint256[] memory numbers = new uint256[](totalSupply);
        for (uint256 i = 0; i < totalSupply; i++) {
            numbers[i] = i + 1; // Numbers 1 to totalSupply
        }

        // Fisher-Yates shuffle using the random data
        for (uint256 i = totalSupply - 1; i > 0; i--) {
            uint256 j = uint256(
                keccak256(abi.encodePacked(randomDataValue, i))
            ) % (i + 1);
            uint256 temp = numbers[i];
            numbers[i] = numbers[j];
            numbers[j] = temp;
        }

        // Assign shuffled numbers to boxes (token IDs start at 1)
        for (uint256 i = 0; i < totalSupply; i++) {
            results[i + 1] = numbers[i];
        }

        emit BoxesShuffled(numbers);
    }

    // This method is required by the IEntropyConsumer interface.
    // It returns the address of the entropy contract which will call the callback.
    function getEntropy() internal view override returns (address) {
        return address(pythEntropy);
    }
}
