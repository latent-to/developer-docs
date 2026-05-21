---
title: "Working with Blockchain Calls"
---

import { SdkVersion } from "./_sdk-version.mdx";

# Working with Blockchain Calls

This guide explains how to work with blockchain calls in the Bittensor SDK using `GenericCall` and `CallBuilder`. These powerful tools allow you to create, compose, and execute complex blockchain transactions without immediately submitting them.

## Introduction

With Bittensor Python SDK, many functions accept a `call` argument of type `GenericCall`. This allows you to create blockchain calls separately from executing them, enabling advanced use cases like proxies, crowdloans, MEV protection, and fee estimation.

### What is GenericCall?

`GenericCall` is an object from the `scalecodec` library that represents a call to a Substrate pallet. It contains:
- The pallet module name
- The pallet function name
- Function parameters in SCALE-encoded format

`GenericCall` does not execute a transaction; it describes an action that will be executed when an extrinsic is submitted.

### Structure of GenericCall

<SdkVersion />

```python
from scalecodec.types import GenericCall

# GenericCall contains:
# - call_module: pallet name (e.g., "SubtensorModule", "Proxy")
# - call_function: pallet function name (e.g., "add_stake", "proxy")
# - call_params: dictionary of function parameters
# - data: SCALE-encoded call data
```

### Why is GenericCall Needed?

`GenericCall` enables you to:
1. Create calls without immediately submitting them
2. Pass calls as arguments to other functions (e.g., Proxy, Crowdloan, MEV Shield)
3. Estimate fees before submission using the `get_extrinsic_fee()` method
4. Compose complex transactions (nested calls)

### Basic Method: substrate.compose_call

In Substrate, calls are created using `substrate.compose_call()`:

```python
# Basic way to create a call (low-level)
call = substrate.compose_call(
    call_module="SubtensorModule",
    call_function="add_stake",
    call_params={
        "netuid": 1,
        "hotkey": "5DE...",
        "amount_staked": 1000000000
    }
)
```

This method works, but requires manual parameter preparation. While validation exists, error messages are often unclear to users when something goes wrong.

### Enhanced Method: subtensor.compose_call

The SDK provides `subtensor.compose_call()` with enhanced functionality:

1. Parameter validation: checks parameters against blockchain metadata before creating the call
2. Automatic filtering: removes extra parameters
3. Clear error messages: explicit messages about missing or invalid parameters
4. Block determination: automatically selects the appropriate block for metadata

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")

# Creating a call with automatic validation
call = subtensor.compose_call(
    call_module="SubtensorModule",
    call_function="add_stake",
    call_params={
        "netuid": 1,
        "hotkey": "5DE...",
        "amount_staked": 1000000000  # in RAO
    }
)

# Parameters are automatically validated against blockchain metadata
# If a parameter is invalid or missing, an exception will be raised
```

## Examples of Using subtensor.compose_call

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")

# Example 1: Creating a call to add stake
stake_call = subtensor.compose_call(
    call_module="SubtensorModule",
    call_function="add_stake",
    call_params={
        "netuid": 1,
        "hotkey": "5DE...",
        "amount_staked": 1000000000
    }
)

# Example 2: Creating a call to set weights
weights_call = subtensor.compose_call(
    call_module="SubtensorModule",
    call_function="set_weights",
    call_params={
        "netuid": 1,
        "uids": [1, 2, 3],
        "weights": [100, 200, 300],
        "version_key": 0
    }
)

# Example 3: Creating a call for Proxy pallet
proxy_call = subtensor.compose_call(
    call_module="Proxy",
    call_function="add_proxy",
    call_params={
        "delegate": "5DE...",
        "proxy_type": "Any",
        "delay": 0
    }
)
```

Validation happens automatically: if parameters don't match the function signature, an exception will be raised with a clear description of the problem.

## CallBuilder: Enhanced Usability

To simplify working with calls, the SDK implements a `pallets` package with `CallBuilder` subclasses for Subtensor pallets.

### Base Class CallBuilder

`CallBuilder` is a base class for creating `GenericCall` objects for all Subtensor pallets. It provides:
- `create_composed_call()`: creates GenericCall with automatic module and function detection
- Dynamic calls: allows calling functions not explicitly defined in the class

### Available Pallets

The SDK provides `CallBuilder` subclasses for each pallet:

```python
from bittensor.core.extrinsics.pallets import (
    SubtensorModule,  # Core Subtensor functions
    Proxy,            # Proxy pallet
    Crowdloan,       # Crowdloan pallet
    MevShield,       # MEV Shield pallet
    Sudo,            # Sudo pallet
    Balances,        # Balances pallet
    Swap,            # Swap pallet
    Commitments,     # Commitments pallet
)
```

### Using CallBuilder

#### Synchronous Usage

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")

# Create GenericCall for Proxy.add_proxy function
from bittensor.core.extrinsics.pallets import Proxy

call = Proxy(subtensor).add_proxy(
    delegate="5DE...",
    proxy_type="Any",
    delay=0
)

# Now call can be used in Subtensor methods
```

#### Asynchronous Usage

```python
import bittensor as bt

async_subtensor = bt.AsyncSubtensor(network="finney")

# Create GenericCall (need await for async)
from bittensor.core.extrinsics.pallets import Proxy

call = await Proxy(async_subtensor).add_proxy(
    delegate="5DE...",
    proxy_type="Any",
    delay=0
)
```

### Dynamic Call Creation

`CallBuilder` supports dynamic calls to functions not explicitly defined in the class:

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")

# Even if the method is not explicitly defined in SubtensorModule class,
# CallBuilder will automatically create GenericCall for this function
from bittensor.core.extrinsics.pallets import SubtensorModule

call = SubtensorModule(subtensor).some_function_name(
    param1="value1",
    param2=123
)

# This works thanks to the __getattr__ method in CallBuilder
# When correct parameters are provided, the call will be created successfully
```

This works thanks to the `__getattr__` method in `CallBuilder`: when accessing a non-existent method, a dynamic call is created that validates parameters and creates a `GenericCall`.

## Practical Usage Examples

### Proxy — Executing Calls Through Proxy

Proxy functionality frequently requires passing `call` as an argument. Here are examples:

#### Example 1: Adding Stake Through Proxy

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")
wallet = bt.Wallet(name="alice")

# Create a call to add stake
from bittensor.core.extrinsics.pallets import SubtensorModule

stake_call = SubtensorModule(subtensor).add_stake(
    netuid=1,
    hotkey="5DE...",
    amount_staked=1000000000  # in RAO
)

# Execute the call through proxy
response = subtensor.proxy(
    wallet=wallet,
    real_account_ss58="5DE...",  # Real account on whose behalf the call is executed
    force_proxy_type="Any",
    call=stake_call
)
```

#### Example 2: Removing Stake Through Proxy

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")
wallet = bt.Wallet(name="alice")

# Create a call to remove stake
from bittensor.core.extrinsics.pallets import SubtensorModule

unstake_call = SubtensorModule(subtensor).remove_stake(
    netuid=1,
    hotkey="5DE...",
    amount_unstaked=500000000  # in RAO
)

# Execute the call through proxy
response = subtensor.proxy(
    wallet=wallet,
    real_account_ss58="5DE...",
    force_proxy_type="Staking",  # Use Staking proxy type
    call=unstake_call
)
```

#### Example 3: Transferring Stake Through Proxy

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")
wallet = bt.Wallet(name="alice")

# Create a call to transfer stake between subnets
from bittensor.core.extrinsics.pallets import SubtensorModule

transfer_call = SubtensorModule(subtensor).transfer_stake(
    destination_coldkey="5DE...",
    hotkey="5DE...",
    origin_netuid=1,
    destination_netuid=2,
    alpha_amount=1000000000  # in RAO
)

# Execute the call through proxy
response = subtensor.proxy(
    wallet=wallet,
    real_account_ss58="5DE...",
    force_proxy_type="Any",
    call=transfer_call
)
```

#### Example 4: Moving Stake Through Proxy

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")
wallet = bt.Wallet(name="alice")

# Create a call to move stake
from bittensor.core.extrinsics.pallets import SubtensorModule

move_call = SubtensorModule(subtensor).move_stake(
    origin_netuid=1,
    origin_hotkey_ss58="5DE...",
    destination_netuid=2,
    destination_hotkey_ss58="5DE...",
    alpha_amount=1000000000  # in RAO
)

# Execute the call through proxy
response = subtensor.proxy(
    wallet=wallet,
    real_account_ss58="5DE...",
    force_proxy_type="Any",
    call=move_call
)
```

#### Example 5: Setting Mechanism Weights Through Proxy

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")
wallet = bt.Wallet(name="alice")

# Create a call to set mechanism weights
from bittensor.core.extrinsics.pallets import SubtensorModule

weights_call = SubtensorModule(subtensor).set_mechanism_weights(
    netuid=1,
    mecid=0,
    dests=[1, 2, 3],
    weights=[100, 200, 300],
    version_key=0
)

# Execute the call through proxy
response = subtensor.proxy(
    wallet=wallet,
    real_account_ss58="5DE...",
    force_proxy_type="Any",
    call=weights_call
)
```

#### Example 6: Registering Network Through Proxy

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")
wallet = bt.Wallet(name="alice")

# Create a call to register network
from bittensor.core.extrinsics.pallets import SubtensorModule

register_call = SubtensorModule(subtensor).register_network(
    hotkey="5DE..."
)

# Execute the call through proxy
response = subtensor.proxy(
    wallet=wallet,
    real_account_ss58="5DE...",
    force_proxy_type="Governance",  # Use Governance proxy type
    call=register_call
)
```

#### Example 7: Setting Subnet Identity Through Proxy

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")
wallet = bt.Wallet(name="alice")

# Create a call to set subnet identity
from bittensor.core.extrinsics.pallets import SubtensorModule

identity_call = SubtensorModule(subtensor).set_subnet_identity(
    netuid=1,
    subnet_name="My Subnet",
    github_repo="https://github.com/myorg/mysubnet",
    subnet_contact="contact@example.com",
    subnet_url="https://mysubnet.com",
    discord="https://discord.gg/mysubnet",
    description="Subnet description",
    logo_url="https://mysubnet.com/logo.png",
    additional="Additional information"
)

# Execute the call through proxy
response = subtensor.proxy(
    wallet=wallet,
    real_account_ss58="5DE...",
    force_proxy_type="Any",
    call=identity_call
)
```

#### Example 8: Executing Announced Proxy Call

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")
wallet = bt.Wallet(name="alice")

# Create a call that was previously announced
from bittensor.core.extrinsics.pallets import SubtensorModule

announced_call = SubtensorModule(subtensor).add_stake(
    netuid=1,
    hotkey="5DE...",
    amount_staked=1000000000
)

# Execute the announced call through proxy
response = subtensor.proxy_announced(
    wallet=wallet,
    delegate_ss58="5DE...",  # Proxy account that made the announcement
    real_account_ss58="5DE...",  # Real account
    force_proxy_type="Any",
    call=announced_call  # Call must match the announced call_hash
)
```

### Crowdloan — Creating Crowdloan with Call

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")
wallet = bt.Wallet(name="alice")

# Create a call to execute upon successful crowdloan completion
from bittensor.core.extrinsics.pallets import SubtensorModule

runtime_call = SubtensorModule(subtensor).register_network(
    hotkey="5DE..."
)

# Create crowdloan with this call
response = subtensor.create_crowdloan(
    wallet=wallet,
    deposit=bt.Balance.from_tao(100.0),
    min_contribution=bt.Balance.from_tao(10.0),
    cap=bt.Balance.from_tao(10000.0),
    end=1000000,  # block number when campaign ends
    call=runtime_call,  # Pass GenericCall
)
```

### MEV Shield — Submitting Encrypted Call

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")
wallet = bt.Wallet(name="alice")

# Create a call to encrypt
from bittensor.core.extrinsics.pallets import SubtensorModule

call = SubtensorModule(subtensor).set_mechanism_weights(
    netuid=1,
    mecid=0,
    dests=[1, 2, 3],
    weights=[100, 200, 300],
    version_key=0
)

# Submit encrypted call
response = subtensor.mev_submit_encrypted(
    wallet=wallet,
    call=call,  # Pass GenericCall
    signer_keypair=wallet.coldkey
)
```

### Estimating Fees Before Submission

```python
import bittensor as bt

subtensor = bt.Subtensor(network="finney")
wallet = bt.Wallet(name="alice")

# Create a call
from bittensor.core.extrinsics.pallets import SubtensorModule

call = SubtensorModule(subtensor).add_stake(
    netuid=1,
    hotkey="5DE...",
    amount_staked=1000000000
)

# Estimate fee WITHOUT submitting transaction using get_extrinsic_fee() method
fee = subtensor.get_extrinsic_fee(
    call=call,
    keypair=wallet.coldkeypub
)

print(f"Fee will be: {fee}")

# If fee is acceptable, use Subtensor class method for submission
if fee.tao < 1.0:  # Check that fee is less than 1 TAO
    response = subtensor.add_stake(
        wallet=wallet,
        netuid=1,
        hotkey_ss58="5DE...",
        amount=bt.Balance.from_rao(1000000000)
    )
```

### Direct Extrinsic Usage

You can call extrinsics directly from the `bittensor.core.extrinsics` package, but it's recommended to use `Subtensor` class methods:

```python
import bittensor as bt
from bittensor.core.extrinsics.staking import add_stake_extrinsic
from bittensor.core.extrinsics.proxy import proxy_extrinsic

subtensor = bt.Subtensor(network="finney")
wallet = bt.Wallet(name="alice")

# Example 1: Direct extrinsic call to add stake
response = add_stake_extrinsic(
    subtensor=subtensor,
    wallet=wallet,
    netuid=1,
    hotkey_ss58="5DE...",
    amount=bt.Balance.from_rao(1000000000)
)

# Recommended way - use Subtensor class method
response = subtensor.add_stake(
    wallet=wallet,
    netuid=1,
    hotkey_ss58="5DE...",
    amount=bt.Balance.from_rao(1000000000)
)

# Example 2: Direct extrinsic call for proxy
from bittensor.core.extrinsics.pallets import SubtensorModule

call = SubtensorModule(subtensor).add_stake(
    netuid=1,
    hotkey="5DE...",
    amount_staked=1000000000
)

response = proxy_extrinsic(
    subtensor=subtensor,
    wallet=wallet,
    real_account_ss58="5DE...",
    force_proxy_type="Any",
    call=call
)

# Recommended way
response = subtensor.proxy(
    wallet=wallet,
    real_account_ss58="5DE...",
    force_proxy_type="Any",
    call=call
)
```

`Subtensor` class methods provide a consistent interface and simplify working with the SDK.

## Important Points

### 1. SCALE Encoding

`GenericCall` automatically encodes parameters in SCALE format. No manual encoding is needed.

### 2. Parameter Validation

When creating `GenericCall` through `CallBuilder` or `subtensor.compose_call()`, parameters are validated against blockchain metadata.

### 3. Synchronous and Asynchronous Operations

- With `Subtensor`: methods return `GenericCall` directly
- With `AsyncSubtensor`: methods return `Awaitable[GenericCall]`, requiring `await`

### 4. Call Composition

`GenericCall` objects can be nested for complex transactions:

```python
# Inner call
inner_call = SubtensorModule(subtensor).add_stake(...)

# Wrap in Proxy
proxy_call = Proxy(subtensor).proxy(
    real="5DE...",
    force_proxy_type="Any",
    call=inner_call
)

# Or submit with MEV protection to prevent front-running
response = subtensor.mev_submit_encrypted(
    wallet=wallet,
    call=inner_call
)
```

## Where is GenericCall Used?

`GenericCall` is used in the following places in the SDK:

1. Proxy extrinsics — executing calls through proxy
2. Crowdloan extrinsics — creating crowdloans with runtime calls
3. MEV Shield — submitting encrypted calls
4. `get_extrinsic_fee()` — fee estimation
5. `Subtensor` class methods — methods that accept `call` as an argument
6. Sudo extrinsics — executing privileged calls

## Conclusion

`GenericCall` and `CallBuilder` simplify working with transactions in Bittensor:

- Create calls without immediately submitting them
- Pass calls as arguments to other functions
- Estimate fees before submission using `get_extrinsic_fee()`
- Compose complex transactions

Use pallet classes (`Proxy`, `Crowdloan`, `SubtensorModule`, etc.) to create `GenericCall` objects, then pass them to `Subtensor` class methods or use them for fee estimation via `get_extrinsic_fee()`.