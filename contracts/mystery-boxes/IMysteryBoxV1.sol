// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

struct Prize {
    address collection;
    uint256 tokenId;
}

interface IKettleAssetFactory {
    function mint(address asset, address to, uint256 id) external;
}

interface IMysteryBoxV1 {

    // Events
    event BoxMinted(address indexed payer, address indexed minter, uint256 indexed tokenId);
    event WhitelistUpdated(address indexed account, bool status);
    event MintTimesUpdated(uint256 privateMintOpenTime, uint256 publicMintOpenTime);
    event BoxInitialized(
        string name,
        string symbol,
        uint256 totalSupply,
        uint256 price,
        address currency,
        address paymentRecipient,
        uint256 privateMintOpenTime,
        uint256 publicMintOpenTime
    );
    event EntropyRequested(uint64 requestId);
    event EntropyReceived(uint64 sequenceNumber, address provider, bytes32 randomData);
    event BoxesShuffled(uint256[] shuffledNumbers);
    event BoxRevealed(uint256 indexed boxTokenId, address indexed owner, address prizeCollection, uint256 prizeTokenId);

    // View functions
    function totalSupply() external view returns (uint256);
    function price() external view returns (uint256);
    function currency() external view returns (IERC20);
    function paymentRecipient() external view returns (address);
    function kettleAssetFactory() external view returns (IKettleAssetFactory);
    function privateMintOpenTime() external view returns (uint256);
    function publicMintOpenTime() external view returns (uint256);
    function entropyRequestId() external view returns (uint64);
    function randomDataValue() external view returns (uint256);
    function entropyRequested() external view returns (bool);
    function boxesShuffled() external view returns (bool);
    function whitelist(address account) external view returns (bool);
    function initialized() external view returns (bool);
    function results(uint256 tokenId) external view returns (uint256);
    
    function getCurrentMintPhase() external view returns (string memory);
    function canMint(address minter) external view returns (bool);
    function totalMinted() external view returns (uint256);
    function remainingSupply() external view returns (uint256);
    function getBoxResult(uint256 tokenId) external view returns (uint256);

    // State-changing functions
    function initialize(
        uint256 _totalSupply,
        uint256 _price,
        address _currency,
        address _paymentRecipient,
        uint256 _privateMintOpenTime,
        uint256 _publicMintOpenTime
    ) external;

    function mint(address minter) external;
    
    function setWhitelistStatus(address account, bool status) external;
    function setWhitelistStatusBatch(address[] calldata accounts, bool status) external;
    
    function setMintTimes(uint256 _privateMintOpenTime, uint256 _publicMintOpenTime) external;
    
    function setPrizes(Prize[] calldata _prizes) external;
    
    function entropyRequest(bytes32 seed) external payable;
    function shuffleBoxes() external;
    
    function reveal(uint256 boxTokenId) external;
} 
