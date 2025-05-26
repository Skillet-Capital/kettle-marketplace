// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

enum Criteria { SIMPLE, PROOF }
enum Side { BID, ASK }

struct Collateral {
    Criteria criteria;
    IERC721 collection;
    uint256 identifier;
}

struct FeeTerms {
    address recipient;
    uint256 rate;
}

struct MarketOfferTerms {
    IERC20 currency;
    uint256 amount;
}

struct MarketOffer {
    Side side;
    address maker;
    address taker;
    Collateral collateral;
    MarketOfferTerms terms;
    FeeTerms fee;
    uint256 expiration;
    uint256 salt;
}

struct RedemptionCharge {
    address redeemer;
    IERC721 collection;
    uint256 tokenId;
    IERC20 currency;
    uint256 amount;
    uint256 expiration;
    uint256 salt;
}
