// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import { IERC1271 } from "@openzeppelin/contracts/interfaces/IERC1271.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./Errors.sol";
import "./Structs.sol";

contract Signatures {
    bytes32 private constant _ERC6492_DETECTION_SUFFIX = 0x6492649264926492649264926492649264926492649264926492649264926492;

    bytes32 private _EIP_712_DOMAIN_TYPEHASH;
    
    bytes32 private _COLLATERAL_TYPEHASH;
    bytes32 private _FEE_TERMS_TYPEHASH;

    bytes32 private _MARKET_OFFER_TERMS_TYPEHASH;
    bytes32 private _MARKET_OFFER_TYPEHASH;

    bytes32 private _REDEMPTION_CHARGE_TYPEHASH;

    string private constant _NAME = "Kettle";
    string private constant _VERSION = "1";

    mapping(address => uint256) public nonces;
    uint256[50] private _gap;

    function __Signatures_init() internal {
        (
            _EIP_712_DOMAIN_TYPEHASH,
            _COLLATERAL_TYPEHASH,
            _FEE_TERMS_TYPEHASH,
            _MARKET_OFFER_TERMS_TYPEHASH,
            _MARKET_OFFER_TYPEHASH,
            _REDEMPTION_CHARGE_TYPEHASH
        ) = _createTypeHashes();
    }

    function hashMarketOffer(MarketOffer calldata offer) external view returns (bytes32) {
        return _hashMarketOffer(offer);
    }

    function hashRedemptionCharge(address admin, RedemptionCharge calldata charge) external view returns (bytes32) {
        return _hashRedemptionCharge(admin, charge);
    }

    function _createTypeHashes()
        internal
        pure
        returns (
            bytes32 eip712DomainTypehash,
            bytes32 collateralTypehash,
            bytes32 feeTermsTypehash,
            bytes32 marketOfferTermsTypehash,
            bytes32 marketOfferTypehash,
            bytes32 redemptionChargeTypehash
        ) 
    {
        eip712DomainTypehash = keccak256(
            bytes.concat(
                "EIP712Domain(",
                "string name,",
                "string version,",
                "uint256 chainId,",
                "address verifyingContract",
                ")"
            )
        );

        bytes memory collateralTypestring = bytes.concat(
            "Collateral(",
            "uint8 criteria,",
            "address collection,",
            "uint256 identifier",
            ")"
        );

        collateralTypehash = keccak256(collateralTypestring);

        bytes memory feeTermsTypestring = bytes.concat(
            "FeeTerms(",
            "address recipient,",
            "uint256 rate",
            ")"
        );

        feeTermsTypehash = keccak256(feeTermsTypestring);

        bytes memory marketOfferTermsTypestring = bytes.concat(
            "MarketOfferTerms(",
            "address currency,",
            "uint256 amount",
            ")"
        );

        marketOfferTermsTypehash = keccak256(marketOfferTermsTypestring);

        marketOfferTypehash = keccak256(
            bytes.concat(
                "MarketOffer(",
                "uint8 side,",
                "address maker,",
                "address taker,",
                "Collateral collateral,",
                "MarketOfferTerms terms,",
                "FeeTerms fee,",
                "uint256 expiration,",
                "uint256 salt,",
                "uint256 nonce",
                ")",
                collateralTypestring,
                feeTermsTypestring,
                marketOfferTermsTypestring
            )
        );

        bytes memory redemptionChargeTypestring = bytes.concat(
            "RedemptionCharge(",
            "address redeemer,",
            "address collection,",
            "uint256 tokenId,",
            "address currency,",
            "uint256 amount,",
            "uint256 expiration,",
            "uint256 salt,",
            "uint256 nonce",
            ")"
        );

        redemptionChargeTypehash = keccak256(redemptionChargeTypestring);
    }

    function _hashDomain(
        bytes32 eip712DomainTypehash,
        bytes32 nameHash,
        bytes32 versionHash
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    eip712DomainTypehash,
                    nameHash,
                    versionHash,
                    block.chainid,
                    address(this)
                )
            );
    }

    function _hashCollateral(
        Collateral calldata collateral
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _COLLATERAL_TYPEHASH,
                    collateral.criteria,
                    collateral.collection,
                    collateral.identifier
                )
            );
    }

    function _hashFee(
        FeeTerms calldata fee
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _FEE_TERMS_TYPEHASH,
                    fee.recipient,
                    fee.rate
                )
            );
    }

    function _hashMarketOfferTerms(
        MarketOfferTerms calldata terms
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _MARKET_OFFER_TERMS_TYPEHASH,
                    terms.currency,
                    terms.amount
                )
            );
    }

    function _hashMarketOffer(
        MarketOffer calldata offer
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _MARKET_OFFER_TYPEHASH,
                    offer.side,
                    offer.maker,
                    offer.taker,
                    _hashCollateral(offer.collateral),
                    _hashMarketOfferTerms(offer.terms),
                    _hashFee(offer.fee),
                    offer.expiration,
                    offer.salt,
                    nonces[offer.maker]
                )
            );
    }

    function _hashRedemptionCharge(
        address admin,
        RedemptionCharge calldata charge
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _REDEMPTION_CHARGE_TYPEHASH,
                    charge.redeemer,
                    charge.collection,
                    charge.tokenId,
                    charge.currency,
                    charge.amount,
                    charge.expiration,
                    charge.salt,
                    nonces[admin]
                )
            );
    }

    function _hashToSign(bytes32 hash) internal view returns (bytes32) {
        bytes32 domain = _hashDomain(
            _EIP_712_DOMAIN_TYPEHASH,
            keccak256(bytes(_NAME)),
            keccak256(bytes(_VERSION))
        );

        return keccak256(abi.encodePacked(bytes2(0x1901), domain, hash));
    }

    function _verifyOfferAuthorization(
        bytes32 offerHash,
        address signer,
        bytes calldata signature
    ) internal {
        bytes32 r;
        bytes32 s;
        uint8 v;
        bytes memory sigToValidate;

        bytes32 hashToSign = _hashToSign(offerHash);

        // The order here is strictly defined in https://eips.ethereum.org/EIPS/eip-6492
        // - ERC-6492 suffix check and verification first, while being permissive in case 
        //   the contract is already deployed; if the contract is deployed we will check 
        //   the sig against the deployed version, this allows 6492 signatures to still 
        //   be validated while taking into account potential key rotation
        // - ERC-1271 verification if there's contract code
        // - finally, ecrecover

        bool isCounterfactual = bytes32(signature[signature.length-32:signature.length]) == _ERC6492_DETECTION_SUFFIX;

        if (isCounterfactual) {
            address create2Factory;
            bytes memory factoryCalldata;

            // solhint-disable-next-line max-line-length
            (create2Factory, factoryCalldata, sigToValidate) = abi.decode(signature[0:signature.length-32], (address, bytes, bytes));

            // solhint-disable-next-line explicit-types
            uint contractCodeLen = address(signer).code.length;
            if (contractCodeLen == 0) {

                // solhint-disable-next-line avoid-low-level-calls
                (bool success, bytes memory err) = create2Factory.call(factoryCalldata);
                if (!success) {
                    revert ERC6492DeployFailed(err);
                }
            }
        } else {
            sigToValidate = signature;
        }

        if (address(signer).code.length > 0) {
            
            bytes4 magicValue = IERC1271(signer).isValidSignature(
                hashToSign,
                sigToValidate
            );

            if (magicValue != IERC1271(signer).isValidSignature.selector) {
                revert InvalidSignature();
            }

            return;
        }

        // solhint-disable-next-line
        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 0x20))
            v := shr(248, calldataload(add(signature.offset, 0x40)))
        }

        _verify(signer, hashToSign, v, r, s);
    }

    /**
     * @notice Verify signature of digest
     * @param signer Address of expected signer
     * @param digest Signature digest
     * @param v v parameter
     * @param r r parameter
     * @param s s parameter
     */
    function _verify(
        address signer,
        bytes32 digest,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal pure {

        if (v != 27 && v != 28) {
            revert InvalidVParameter();
        }

        address recoveredSigner = ecrecover(digest, v, r, s);
        if (recoveredSigner == address(0) || signer != recoveredSigner) {
            revert InvalidSignature();
        }
    }
}
