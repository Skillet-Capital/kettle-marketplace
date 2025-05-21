// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {MarketOffer, RedemptionCharge} from "../Structs.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IKettleMarketplace {
    function takeBid(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external returns (bytes32 _hash);

    function takeAsk(
        address taker,
        MarketOffer calldata offer,
        bytes calldata signature
    ) external returns (bytes32 _hash);

    function redeem(
        RedemptionCharge calldata charge,
        bytes calldata signature
    ) external returns (bytes32 _hash);

    function cancelOffers(uint256[] calldata salts) external;

    function incrementNonce() external;

    event RedemptionSignerUpdated(address indexed signer);
    event RedemptionWalletUpdated(address indexed wallet);
    event OfferManagerUpdated(address indexed manager);

    event OfferCancelled(
        address indexed operator,
        address indexed user,
        uint256 indexed salt
    );

    event NonceIncremented(
        address indexed operator,
        address indexed user,
        uint256 indexed nonce
    );

    event MarketOfferTaken(
        bytes32 indexed hash,
        uint256 indexed tokenId,
        address indexed taker,
        MarketOffer offer
    );

    event Redemption(
        bytes32 indexed hash,
        RedemptionCharge charge
    );
}
