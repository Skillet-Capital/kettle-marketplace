// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

import {IKettleMarketplace} from "./interfaces/IKettleMarketplace.sol";
import {Signatures} from "./Signatures.sol";

import "./Errors.sol";
import "./Structs.sol";

contract KettleMarketplace is IKettleMarketplace,  Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable, Signatures {
    using SafeERC20 for IERC20;

    // @custom:oz-upgrades-unsafe-allow state-variable-immutable
    uint256 private constant _BASIS_POINTS = 10_000;

    address public redemptionSigner;
    address public redemptionWallet;
    address public offerManager;

    mapping (address => mapping(uint256 => uint256)) public cancelledOrFulfilled;

    uint256[50] private _gap;

    function __Kettle_init(
        address owner,
        address _redemptionSigner,
        address _redemptionWallet,
        address _offerManager
    ) external initializer {
        __Ownable_init(owner);
        __Signatures_init();
        __ReentrancyGuard_init();

        _setRedemptionSigner(_redemptionSigner);
        _setRedemptionWallet(_redemptionWallet);
        _setOfferManager(_offerManager);
    }

    // =============================================================
    //                      Setters
    // =============================================================

    function setRedemptionSigner(address _redemptionSigner) external onlyOwner {
        _setRedemptionSigner(_redemptionSigner);
    }

    function setRedemptionWallet(address _redemptionWallet) external onlyOwner {
        _setRedemptionWallet(_redemptionWallet);
    }

    function setOfferManager(address _offerManager) external onlyOwner {
        _setOfferManager(_offerManager);
    }
    
    function _setRedemptionSigner(address _redemptionSigner) internal {
        redemptionSigner = _redemptionSigner;
        emit RedemptionSignerUpdated(_redemptionSigner);
    }

    function _setRedemptionWallet(address _redemptionWallet) internal {
        redemptionWallet = _redemptionWallet;
        emit RedemptionWalletUpdated(_redemptionWallet);
    }

    function _setOfferManager(address _offerManager) internal {
        offerManager = _offerManager;
        emit OfferManagerUpdated(_offerManager);
    }    

    // =============================================================
    //                      External Functions
    // =============================================================

    /// @notice Fulfills a bid offer by transferring the token from the caller to the offer maker and currency to the caller
    /// @param tokenId The token ID to transfer
    /// @param offer The bid offer details
    /// @param signature Signature of the offer
    /// @param proof Optional Merkle proof for criteria-based collateral
    /// @return _hash The hash of the validated offer
    function takeBid(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external nonReentrant returns (bytes32 _hash){
        if (offer.side != Side.BID) revert InvalidSide();

        // verify token id matches collateral identifier
        _verifyCollateral(offer.collateral.criteria, offer.collateral.identifier, tokenId, proof);

        // hash and verify offer signature, mark offer as cancelled
        _hash = _hashMarketOffer(offer); 
        _validateOffer(_hash, offer.maker, offer.expiration, offer.salt, signature);
        cancelledOrFulfilled[offer.maker][offer.salt] = 1;

        // transfer collateral
        offer.collateral.collection.safeTransferFrom(msg.sender, offer.maker, tokenId);

        // take fees and transfer currency
        uint256 netAmount = _transferFees(offer.terms.currency, offer.maker, offer.fee.recipient, offer.terms.amount, offer.fee.rate);
        _transferCurrency(offer.terms.currency, offer.maker, msg.sender, netAmount);

        emit MarketOfferTaken(_hash, tokenId, msg.sender, offer);
    }

    /// @notice Fulfills an ask offer by transferring the token from the maker to the specified taker, and currency to the maker
    /// @dev msg.sender is always the sender of funds (can fund on behalf of the taker)
    /// @param taker The recipient of the token
    /// @param offer The ask offer details
    /// @param signature Signature of the offer
    /// @return _hash The hash of the validated offer
    function takeAsk(
        address taker,
        MarketOffer calldata offer,
        bytes calldata signature
    ) external nonReentrant returns (bytes32 _hash){
        if (offer.side != Side.ASK) revert InvalidSide();
        if (taker == address(0)) revert ZeroTaker();
        if (offer.taker != address(0) && offer.taker != taker) revert InvalidTaker();

        // hash and verify offer signature
        _hash = _hashMarketOffer(offer); 
        _validateOffer(_hash, offer.maker, offer.expiration, offer.salt, signature);
        cancelledOrFulfilled[offer.maker][offer.salt] = 1;

        // transfer collateral and currency
        offer.collateral.collection.safeTransferFrom(offer.maker, taker, offer.collateral.identifier);

        // take fees and transfer currency (msg.sender always pays on behalf of the taker)
        uint256 netAmount = _transferFees(offer.terms.currency, msg.sender, offer.fee.recipient, offer.terms.amount, offer.fee.rate);
        _transferCurrency(offer.terms.currency, msg.sender, offer.maker, netAmount);

        emit MarketOfferTaken(_hash, offer.collateral.identifier, taker, offer);
    }

    /// @notice Redeems a token for off-chain services by sending token and payment to the redemption wallet
    /// @dev msg.sender is always the sender of funds (can fund on behalf of the redeemer)
    /// @param charge Redemption charge details including redeemer, token, amount, and expiration
    /// @param signature Signed proof that the redeemer is authorized to redeem
    /// @return _hash The hash of the validated redemption charge
    function redeem(
        RedemptionCharge calldata charge,
        bytes calldata signature
    ) external nonReentrant returns (bytes32 _hash){
        if (charge.redeemer == address(0)) revert ZeroRedeemer();
        if (msg.sender != charge.redeemer) revert InvalidRedeemer();

        // hash and verify redemption signature
        _hash = _hashRedemptionCharge(redemptionSigner, charge);
        _validateOffer(_hash, redemptionSigner, charge.expiration, charge.salt, signature);
        cancelledOrFulfilled[charge.redeemer][charge.salt] = 1;

        // transfer collateral and currency
        charge.collection.safeTransferFrom(charge.redeemer, redemptionWallet, charge.tokenId);
        _transferCurrency(charge.currency, msg.sender, redemptionWallet, charge.amount);

        emit Redemption(_hash, charge);
    }

    /// @notice Cancels a batch of offers by salt for the sender
    /// @param salts An array of offer salts to cancel
    function cancelOffers(
        uint256[] calldata salts
    ) external {
        for (uint256 i = 0; i < salts.length; i++) {
            _cancelOffer(msg.sender, salts[i]);
        }
    }

    /// @notice Increments the nonce for the sender to invalidate all past offers
    function incrementNonce() external {
        _incrementNonce(msg.sender);
    }

    /// @notice Cancels offers on behalf of a user, callable only by the offerManager
    /// @param maker The user whose offers are to be canceled
    /// @param salts The salts of the offers to cancel
    function cancelOffersForUser(
        address maker,
        uint256[] calldata salts
    ) external onlyOfferManager {
        for (uint256 i = 0; i < salts.length; i++) {
            _cancelOffer(maker, salts[i]);
        }
    }

    /// @notice Increments the nonce for a user on their behalf, invalidating all previous offers
    /// @param maker The address of the user
    function incrementNonceForUser(
        address maker
    ) external onlyOfferManager {
        _incrementNonce(maker);
    }

    // =============================================================
    //                      Internal Functions
    // =============================================================

    /// @notice Transfers fee amount from payer to recipient and returns remaining net amount
    /// @dev Fee is calculated and deducted before main transfer
    function _transferFees(
        IERC20 currency,
        address payer,
        address recipient,
        uint256 amount,
        uint256 fee
    ) internal returns (uint256 netAmount) {
        uint256 feeAmount = _calculateFee(amount, fee);

        _transferCurrency(
            currency,
            payer,
            recipient,
            feeAmount
        );

        netAmount = amount - feeAmount;
    }

    /// @notice Calculates fee based on basis points
    /// @dev Reverts if the fee is equal to or exceeds the total amount
    function _calculateFee(
        uint256 amount,
        uint256 rate
    ) internal pure returns (uint256 fee) {
        fee = Math.mulDiv(amount, rate, _BASIS_POINTS);
        if (fee >= amount) {
            revert InvalidFee();
        }
    }

    /// @notice Validates offer hash, expiration, and that it hasn't been canceled
    /// @dev Also calls signature verification
    function _validateOffer(
        bytes32 _hash,
        address _signer,
        uint256 _expiration,
        uint256 _salt,
        bytes calldata signature
    ) internal {
        if (_expiration < block.timestamp) revert ExpiredOffer();
        if (cancelledOrFulfilled[_signer][_salt] == 1) revert InvalidSalt();
        _verifyOfferAuthorization(_hash, _signer, signature);
    }

    /// @notice Verifies that a token meets the specified collateral criteria
    /// @param criteria Either PROOF (Merkle-based) or EXACT (single token match)
    function _verifyCollateral(
        Criteria criteria,
        uint256 identifier,
        uint256 tokenId,
        bytes32[] calldata proof
    ) internal pure {
        if (criteria == Criteria.PROOF) {
            if (
                !MerkleProof.verifyCalldata(
                    proof, 
                    bytes32(identifier), 
                    keccak256(abi.encode(bytes32(tokenId)))
                )
            ) {
                revert InvalidCriteria();
            }
        } else {
            if (!(tokenId == identifier)) {
                revert InvalidToken();
            }
        }
    }

    /// @notice Marks an offer as canceled/fulfilled
    function _cancelOffer(address maker, uint256 salt) internal {
        cancelledOrFulfilled[maker][salt] = 1;
        emit OfferCancelled(msg.sender, maker, salt);
    }

    /// @notice Increments a user's nonce to invalidate all previous offers
    function _incrementNonce(address maker) internal {
        nonces[maker]++;
        emit NonceIncremented(msg.sender, maker, nonces[maker]);
    }

    // =============================================================
    //                      Helper Functions
    // =============================================================

    /// @notice Handles safe ERC20 transfer logic
    /// @dev No-op if amount is 0
    function _transferCurrency(
        IERC20 currency,
        address from,
        address to,
        uint256 amount
    ) internal {
        if (amount == 0) return;
        currency.safeTransferFrom(from, to, amount);
    }

    // =============================================================
    //                      Modifiers
    // =============================================================

    /// @notice Ensures the caller is the designated offer manager
    modifier onlyOfferManager() {
        if (msg.sender != offerManager) revert OnlyOfferManager();
        _;
    }
}
