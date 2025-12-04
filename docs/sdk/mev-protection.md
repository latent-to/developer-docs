---
title: "MEV Shield Protection"
---

# MEV Shield Protection

The SDK provides comprehensive support for MEV Shield protection, allowing you to encrypt transactions and protect them from front-running and MEV attacks. There are two primary ways to use MEV protection:

1. **Direct MEV Shield submission** - Use `mev_submit_encrypted` for full control over encrypted transaction submission
2. **MEV protection parameter** - Add `mev_protection=True` to any supported extrinsic


## SDK Implementation

### Core MEV Shield

- **Added `submit_encrypted_extrinsic`** (sync & async): Core extrinsic function that encrypts and submits transactions through the MEV Shield pallet
- **Added `mev_submit_encrypted`** to `Subtensor` and `AsyncSubtensor`: High-level wrapper method for submitting encrypted transactions
- **Added query methods** for MEV Shield state:
  - `get_mev_shield_current_key`: Retrieves the current encryption key
  - `get_mev_shield_next_key`: Retrieves the next encryption key
  - `get_mev_shield_submission`: Retrieves a specific encrypted submission
  - `get_mev_shield_submissions`: Retrieves all encrypted submissions for an account

### Extrinsic Functions

All extrinsic functions now support MEV protection via the `mev_protection` parameter:

- **Staking**: `add_stake_extrinsic`, `add_stake_multiple_extrinsic`, `set_auto_stake_extrinsic`
- **Unstaking**: `unstake_extrinsic`, `unstake_all_extrinsic`, `unstake_multiple_extrinsic`
- **Move Stake**: `move_stake_extrinsic`, `transfer_stake_extrinsic`, `swap_stake_extrinsic`
- **Proxy**: All 11 proxy-related extrinsics (add, remove, create_pure, kill_pure, proxy, announce, etc.)
- **Crowdloan**: All 9 crowdloan extrinsics (contribute, create, dissolve, finalize, refund, update_cap, update_end, update_min_contribution, withdraw)
- **Registration**: `burned_register_extrinsic`, `register_extrinsic`, `register_subnet_extrinsic`, `set_subnet_identity_extrinsic`
- **Root**: `root_register_extrinsic`, `set_root_claim_type_extrinsic`, `claim_root_extrinsic`
- **Serving**: `serve_extrinsic`, `serve_axon_extrinsic`, `publish_metadata_extrinsic`
- **Weights**: `set_weights_extrinsic`, `commit_weights_extrinsic`, `reveal_weights_extrinsic`, `commit_timelocked_weights_extrinsic`
- **Take**: `set_take_extrinsic`
- **Children**: `set_children_extrinsic`, `root_set_pending_childkey_cooldown_extrinsic`
- **Liquidity**: `add_liquidity_extrinsic`, `modify_liquidity_extrinsic`, `remove_liquidity_extrinsic`, `toggle_user_liquidity_extrinsic`
- **Transfer**: `transfer_extrinsic`
- **Start Call**: `start_call_extrinsic`

### API

- **`Subtensor` and `AsyncSubtensor` methods**: All methods that call the above extrinsics now accepts:
  - `mev_protection: bool = DEFAULT_MEV_PROTECTION` as a keyword-only argument
  - `wait_for_revealed_execution: bool = True` as a keyword-only argument
- **`ExtrinsicResponse`**: Added `mev_extrinsic_receipt` field to store the receipt of the revealed (decrypted and executed) MEV Shield extrinsic
- **`BT_MEV_PROTECTION`**: Environment variable to enable MEV protection by default. See [Environment Variables](./env-vars.md#bt_mev_protection).



## Usage

### 1. Direct MEV Shield Submission

You can use the `mev_submit_encrypted` method on the `Subtensor` instance or call the `submit_encrypted_extrinsic` function directly. This approach gives you full control over the encryption and submission process.

#### Key Parameters

- **`signer_keypair`** (optional): The keypair used to sign the inner call. This parameter is only available when calling `submit_encrypted_extrinsic` directly. If not provided, the wallet's coldkey is used as the default signer. When using other extrinsics with `mev_protection=True`, the wallet's coldkey is automatically used for signing the inner call.

- **`wait_for_revealed_execution`** (default: `True`): Whether to wait for the `DecryptedExecuted` event, indicating that validators have successfully decrypted and executed the inner call. If `True`, the function polls subsequent blocks for the event matching this submission's commitment.

- **`blocks_for_revealed_execution`** (default: `5`): Maximum number of blocks to poll for the `DecryptedExecuted` event after inclusion. The function checks blocks from `start_block + 1` to `start_block + blocks_for_revealed_execution`. It returns immediately if the event is found before the block limit is reached.

- **`mev_extrinsic_receipt`**: When `wait_for_revealed_execution=True`, the `ExtrinsicResponse` object will contain a `mev_extrinsic_receipt` attribute. This contains the execution details of the revealed (decrypted and executed) extrinsic, including triggered events such as `DecryptedExecuted` or `DecryptedRejected`, block information, and other execution metadata.

**Important**: If `wait_for_inclusion=False`, you cannot set `wait_for_revealed_execution=True`. This will raise a `ValueError` because we need to know the block where the encrypted transaction was included to search for the revealed execution event.

#### Example: Staking with Direct MEV Shield Submission

```python
from bittensor import Subtensor, Wallet
from bittensor.core.extrinsics.pallets import SubtensorModule
from bittensor.utils.balance import Balance

# Initialize subtensor and wallet
subtensor = Subtensor(network="finney")
wallet = Wallet(name="my_wallet")

# Create the staking call
staking_call = SubtensorModule(subtensor).add_stake(
    netuid=1,
    hotkey_ss58="5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    amount_staked=Balance.from_tao(100.0).rao
)

# Submit with MEV protection
response = subtensor.mev_submit_encrypted(
    wallet=wallet,
    call=staking_call,
    wait_for_inclusion=True,
    wait_for_finalization=True,
    wait_for_revealed_execution=True,
    blocks_for_revealed_execution=5
)

if response.success:
    print(f"Transaction successful!")
    if response.mev_extrinsic_receipt:
        print(f"Revealed execution block: {response.mev_extrinsic_receipt.block_hash}")
        print(f"Events: {response.mev_extrinsic_receipt.triggered_events}")
```

### 2. MEV Protection via Extrinsic Parameter

All extrinsics now support a `mev_protection` parameter (default: `False`). When set to `True`, the extrinsic is automatically encrypted and submitted through the MEV Shield pallet, providing the same protection as direct submission.

When `mev_protection=True`:
- The transaction is encrypted using ML-KEM-768 + XChaCha20Poly1305
- The transaction remains encrypted in the mempool until validators decrypt and execute it
- The `ExtrinsicResponse` will contain `mev_extrinsic_receipt` with the revealed execution details (if `wait_for_revealed_execution=True`, which is the default for extrinsics using MEV protection)

#### Example: Staking with MEV Protection Parameter

```python
from bittensor import Subtensor, Wallet
from bittensor.utils.balance import Balance

# Initialize subtensor and wallet
subtensor = Subtensor(network="finney")
wallet = Wallet(name="my_wallet", hotkey="my_hotkey")

# Add stake with MEV protection enabled
response = subtensor.add_stake(
    wallet=wallet,
    netuid=1,
    hotkey_ss58="5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    amount=Balance.from_tao(100.0),
    mev_protection=True,  # Enable MEV Shield protection
    wait_for_inclusion=True,
    wait_for_finalization=True
)

if response.success:
    print(f"Staking successful!")
    if response.mev_extrinsic_receipt:
        print(f"Revealed execution details: {response.mev_extrinsic_receipt}")
```

#### Example: Subnet Registration with MeV Res
```py
import bittensor as bt

sub = bt.Subtensor("local")
response = sub.register_subnet(
    wallet=bt.Wallet("bob"), 
    mev_protection=True
)

print(response)
```

### 3. Keyword-Only Arguments

All extrinsics and related `Subtensor` methods now use **keyword-only arguments** (indicated by `*,` in the function signature). This means that certain parameters must be passed by name rather than position, improving code clarity and preventing accidental argument misplacement.

The `*` symbol in Python function signatures creates a boundary: all parameters after `*` must be passed as keyword arguments. This helps prevent bugs from positional argument confusion, especially when functions have many parameters.

#### Example: Keyword-Only Arguments

```python
# Before (positional arguments could cause confusion):
subtensor.add_stake(
    wallet, 
    1, 
    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", 
    amount, 
    False, 
    False, 
    0.005, 
    False, 
    None, 
    False, 
    True, 
    True
)
# Which parameter is which? Hard to tell!

# After (keyword-only arguments enforce clarity):
subtensor.add_stake(
    wallet, 
    1, 
    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", 
    amount, 
    False, 
    False, 
    0.005, 
    mev_protection=True,  # Must be passed by name if provided
    period=None,  # Must be passed by name if provided
    raise_error=False,  # Must be passed by name if provided
    wait_for_inclusion=True,  # Must be passed by name if provided
    wait_for_finalization=True  # Must be passed by name if provided
)
```
---
