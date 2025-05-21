// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {MarketOffer, RedemptionCharge} from "../Structs.sol";

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

    function cancelOffers(
      uint256[] calldata salts
    ) external;

    function incrementNonce() external;
}
