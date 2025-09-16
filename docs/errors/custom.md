---
title: "Subtensor Custom Errors"
---

# Custom Errors

This page documents custom errors that can arise from Subtensor, the blockchain underlying the Bittensor network.

These errors are returned in the format:

```json
{
  "code": 1010,
  "message": "Invalid Transaction",
  "data": "Custom error: [Error Code]"
}
```

Related:

- [Source code in GitHub](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/lib.rs#L1840-L1855)
- [Subtensor Standard Errors](./subtensor.md) - Bittensor's custom error codes
- [Substrate Errors](https://polkadot.js.org/docs/substrate/errors/) - Errors from the underlying Substrate framework

## Error Codes

### Error Code 0

**Error**: `ColdKeyInSwapSchedule`  
**Description**: Your coldkey is set to be swapped. No transfer operations are possible.

### Error Code 1

**Error**: `StakeAmountTooLow`  
**Description**: The amount you are staking/unstaking/moving is below the minimum TAO equivalent.  
**Minimum**: 500,000 RAO (0.0005 TAO)

### Error Code 2

**Error**: `BalanceTooLow`  
**Description**: The amount of stake you have is less than you have requested.

### Error Code 3

**Error**: `SubnetDoesntExist`  
**Description**: This subnet does not exist.

### Error Code 4

**Error**: `HotkeyAccountDoesntExist`  
**Description**: Hotkey is not registered on Bittensor network.

### Error Code 5

**Error**: `NotEnoughStakeToWithdraw`  
**Description**: You do not have enough TAO equivalent stake to remove/move/transfer, including the unstake fee.

### Error Code 6

**Error**: `RateLimitExceeded`  
**Description**: Too many transactions submitted (other than Axon serve/publish extrinsic).

### Error Code 7

**Error**: `InsufficientLiquidity`  
**Description**: The subnet's pool does not have sufficient liquidity for this transaction.

### Error Code 8

**Error**: `SlippageTooHigh`  
**Description**: The slippage exceeds your limit. Try reducing the transaction amount.

### Error Code 9

**Error**: `TransferDisallowed`  
**Description**: This subnet does not allow stake transfer.

### Error Code 10

**Error**: `HotKeyNotRegisteredInNetwork`  
**Description**: The hotkey is not registered in the selected subnet.

### Error Code 11

**Error**: `InvalidIpAddress`  
**Description**: Axon connection info cannot be parsed into a valid IP address.

### Error Code 12

**Error**: `ServingRateLimitExceeded`  
**Description**: Rate limit exceeded for axon serve/publish extrinsic.

### Error Code 13

**Error**: `InvalidPort`  
**Description**: Axon connection info cannot be parsed into a valid port.

### Error Code 14

**Error**: `ZeroMaxAmount`  
**Description**: The executable amount must be greater than zero.

### Error Code 15

**Error**: `InvalidRevealRound`  
**Description**: The provided reveal round is outdated or invalid.

### Error Code 16

**Error**: `CommitNotFound`  
**Description**: The referenced validator commit does not exist.

### Error Code 17

**Error**: `CommitBlockNotInRevealRange`  
**Description**: The referenced commit cannot be revealed in the current block range.

### Error Code 18

**Error**: `InputLengthsUnequal`  
**Description**: Attempted to batch reveal weights with mismatched vector input lenghts.

### Error Code 255

**Error**: `BadRequest`  
**Description**: Unclassified error.
