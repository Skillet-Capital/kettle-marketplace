// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";

contract MockEntropy {
    uint64 public lastRequestId = 1;
    uint128 public fee = 0.01 ether;
    address public defaultProvider = address(0x123);

    mapping(uint64 => address) public requestIdToRequester;

    function getFee(address) external view returns (uint128) {
        return fee;
    }

    function getDefaultProvider() external view returns (address) {
        return defaultProvider;
    }

    function requestWithCallback(
        address, /* provider */
        bytes32 /* seed */
    ) external payable returns (uint64) {
        require(msg.value >= uint256(fee), "Insufficient fee");
        uint64 requestId = lastRequestId++;
        requestIdToRequester[requestId] = msg.sender;
        return requestId;
    }

    function fulfill(uint64 requestId, bytes32 randomness) external {
        // Simulate async randomness callback
        IEntropyConsumer(requestIdToRequester[requestId])._entropyCallback(
            requestId,
            defaultProvider,
            randomness
        );
    }
}
