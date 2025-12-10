---
title: "Using MEV Shield with the Bittensor SDK"
---

import { SdkVersion } from "./\_sdk-version.mdx";

# MEV Shield

The MEV Shield feature allows users to encrypt transactions to protect them from front running and other maximal extractable value (MEV) attacks that depend on attackers knowing the details of transactions when they enter the transaction pool.

This page gives in-depth coverage of using MEV shield with the Bittensor Python SDK.
For more overall context on MEV Shield, see:  [MEV Shield: Encrypted Mempool Protection](/concepts/mev-shield/).


MEV Shield uses a simple encrypt-and-submit approach:

1. Create and sign the extrinsic (the "inner call") you want to protect.
2. Encrypt the signed extrinsic using the current MEV Shield public key.
3. Submit the encrypted payload to the chain.
4. The the inner call is decrypted and executed after the transaction is included in a block, preventing front-running since the transaction contents are hidden while in the mempool.

## SDK Support

The SDK supports MEV Shield in two primary ways:

1. MEV protection parameter - Add `mev_protection=True` to any supported extrinsic-calling function (recommended)
2. Direct MEV Shield submission - Use `mev_submit_encrypted` for full control over encrypted transaction submission

:::warning MEV shield with hotkey-signed extrinsics
MEV shield should not be used for transactions that are signed by a hotkey. Attempting to use MEV shield with extrinsics signed by a hotkey will fail.

Note that while it is technically possible to transfer TAO to a hotkey, which would, technically, allow you to use MEV protection for HK operations, this is neither intended nor advisable.

**Because hotkeys are not intended to hold TAO, you are in *untested waters* if you do so, and there may be unintended consequences that could result in asset loss.**
:::


### Using Extrinsic-Calling Functions

In `Subtensor` and `AsyncSubtensor`, all methods that call extrinsics now accept the following keyword arguments:

- `mev_protection: bool = DEFAULT_MEV_PROTECTION` as a keyword-only argument
- `wait_for_revealed_execution: bool = True` as a keyword-only argument


All extrinsic functions now support MEV protection:

    - Staking: `add_stake_extrinsic`, `add_stake_multiple_extrinsic`, `set_auto_stake_extrinsic`
    - Unstaking: `unstake_extrinsic`, `unstake_all_extrinsic`, `unstake_multiple_extrinsic`
    - Move Stake: `move_stake_extrinsic`, `transfer_stake_extrinsic`, `swap_stake_extrinsic`
    - Proxy: All 11 proxy-related extrinsics (add, remove, create_pure, kill_pure, proxy, announce, etc.)
    - Crowdloan: All 9 crowdloan extrinsics (contribute, create, dissolve, finalize, refund, update_cap, update_end, update_min_contribution, withdraw)
    - Registration: `burned_register_extrinsic`, `register_extrinsic`, `register_subnet_extrinsic`, `set_subnet_identity_extrinsic`
    - Root: `root_register_extrinsic`, `set_root_claim_type_extrinsic`, `claim_root_extrinsic`
    - Serving: `serve_extrinsic`, `serve_axon_extrinsic`, `publish_metadata_extrinsic`
    - Weights: `set_weights_extrinsic`, `commit_weights_extrinsic`, `reveal_weights_extrinsic`, `commit_timelocked_weights_extrinsic`
    - Take: `set_take_extrinsic`
    - Children: `set_children_extrinsic`, `root_set_pending_childkey_cooldown_extrinsic`
    - Liquidity: `add_liquidity_extrinsic`, `modify_liquidity_extrinsic`, `remove_liquidity_extrinsic`, `toggle_user_liquidity_extrinsic`
    - Transfer: `transfer_extrinsic`
    - Start Call: `start_call_extrinsic`


### Enabling MEV Protection by Default

You can enable MEV protection globally by setting the `BT_MEV_PROTECTION` environment variable:

```bash
export BT_MEV_PROTECTION=1
```

When set, all supported extrinsics will use MEV protection automatically without needing to pass `mev_protection=True` to each call. Accepted values are `1`, `true`, `yes`, or `on` (case-insensitive).

See [Environment Variables](./env-vars.md#bt_mev_protection) for more details.

### Using Core MEV Shield Methods

These SDK methods encapsulate the core MEV shield functionality:

- `submit_encrypted_extrinsic` (sync & async): Core extrinsic function that encrypts and submits transactions through the MEV Shield pallet
- `mev_submit_encrypted` in `Subtensor` and `AsyncSubtensor` offer a wrapper method for submitting encrypted transactions
- Query methods for MEV Shield state:
  - `get_mev_shield_current_key`: Retrieves the current encryption key
  - `get_mev_shield_next_key`: Retrieves the next encryption key
  - `get_mev_shield_submission`: Retrieves a specific encrypted submission
  - `get_mev_shield_submissions`: Retrieves all encrypted submissions for an account

:::info
The `ExtrinsicResponse` object includes a `mev_extrinsic_receipt` field to store the receipt of the revealed (decrypted and executed) MEV Shield extrinsic.
:::

## Usage

### Option 1: MEV Protection via Extrinsic Parameter (Recommended)

All methods that call extrinsics support a `mev_protection` parameter. When set to `True`, the extrinsic is automatically encrypted and submitted through the MEV Shield pallet. This is the simplest way to use MEV protection—the SDK handles all the details including nonce management.

The default value is `False` unless you've set the `BT_MEV_PROTECTION` environment variable (see above).

When `mev_protection=True`:

- The transaction is encrypted using ML-KEM-768 + XChaCha20Poly1305
- The transaction remains encrypted in the mempool until validators decrypt and execute it
- The `ExtrinsicResponse` will contain `mev_extrinsic_receipt` with the revealed execution details (if `wait_for_revealed_execution=True`, which is the default for extrinsics using MEV protection)

#### Example: Staking with MEV Protection

<SdkVersion />

```python
from bittensor import Subtensor, Wallet
from bittensor.utils.balance import Balance

# Initialize subtensor and wallet
subtensor = Subtensor()
wallet = Wallet()

# Add stake with MEV protection enabled
response = subtensor.add_stake(
    wallet=wallet,
    netuid=1,
    hotkey_ss58='5C86aJ2uQawR6P6veaJQXNK9HaWh6NMbUhTiLs65kq4ZW3NH',
    amount=Balance.from_tao(1),
    mev_protection=True,  # Enable MEV Shield protection
    wait_for_inclusion=True,
    wait_for_finalization=True
)

print(response)
```

```console
ExtrinsicResponse:
    success: True
    message: Success
    extrinsic_function: submit_encrypted_extrinsic
    extrinsic: {'account_id': '0x105bfdbbaa8c1a08251f2672b753eda64debeb3d2ff2bc6cd685a7df8e405164', 'signature': {'Sr25519': '0x627ca300a0b93e963d86fac453eea81e503856deb119f010786ff1ab6383c21f3fe2bddcfd976e193d6ce88562250dba6535a132a44813baac114de2e9deb188'}, 'call_function': 'submit_encrypted', 'call_module': 'MevShield', 'call_args': {'commitment': '0xd706f59b3341689ffb110aee61d7ecdecb33bb5aa42ed481f99c4279297eb8ba', 'ciphertext': b'@\x04\xef\xe8\xfa\xf3\n\x1b\x13\xcd%*\x9co\xc5\x0c\x906L\x1f\xff\xa8\xcf4\xc4$\xa2kJ|x\x84\xe1\xab^W\x81)\x8d\x97/\xe57AQW\xad\x17l\x18]\x0e[\xe6H\'<7\xe1TzG\x1d\xef\xb2\xcc5\x07\xb9\xc4\xb2!\x87\xd4 \xee\xb1\xfc\x9d\xbfbb\xc22\xaeE;\xb2\x1a\x13\xc8\x80.nw\x05\xcb\x9c\x8a\x18\xa1\x86\xfbi\xa4\xd9\xff\xbc\x13y\x9f\xa6\xa32\x97\x8a`x\x1f\xab\x1f\x9b\xaf\xb6r\xc7v\xc1\n\\\x1ch\xd4u\x1aG&\xa1CR\x1a\xe4\xd9\xfe\x0c$\x81d` g\xa5qM\xee7\t\xb2\x9cK\xa0\xa7\x08\x9d\x9a\xe5z\xb4\xae\xd1\xa3U\x8e.\x94[\xe2 \xa4e0=`\xf2\xa3\xcb1\x01\x87\x8f\xc3\xecI\xa6h)\xcdowIp\x06\x88\x9a\x82\xe5\xf4 Z\xde\xfc\xd1oi\x95\xc7\xf7!lB{\x18\x84\xcf\xa0\xc9\x052J\xef\xbd\xc9\xb8\xe1\xa0\xfb\x1f\x17qX\xc4e\xe5\xef\xf1]\x05dp\xac[\xee\x99\xbc9\x19\x93#4\xb9J\xaeEP\xd0\x0e%\xfb\xa6\xe3\xd9<L\x030\xb4>\xa6\xd0\x00\x91\xd8\xda\x0cPC\x8cb0r\xfd:(I\xbd\xab\x85\x083_\xb2\x9b\x83\x0e\xbe\x90\xa1}*!\x8c\xa6\x15\xdb\x95\x97b&\x9c\x951<\x81|W\x97U\x9e\x84h\x9b\x0e\x9e\x8c\x13\r\xe5$\xa0\xd2]\xf7\xe9\x0cZ\xe5\x91\xb1\x06\xeez\x05r<\x1a\n\x90\xd4Ol\\\xaa\xff\x90P#-\xc8^\xf4\x1d\xa59Q/\x96\'\x0e.\x8e\xdb\x94\xa8\nM\xdf\x8d\xd6\xf7\xb8\xf44\x8aT\x8dqD_\x86\xb524\xa1h\xbf\x94\x80\x8c\x97\xc4\x81\x7fq\xf6\xfd\x7f\xc3\xe4X/S\xdb\x1ak\xd3\xf3\xfeJ\xc1:?\xa1UFp\x83\x8co\xa9"\xb2k\x14b\xe0\xc2m\xd3\x16\x02c*\xdd\x0c\xae\xbc\xcb\xa9)\xc5\xce6u\xa3\xe7\xcc\xc6\x13\x1d\x94\x9a\'\xaa\x04\xf8\x06w\x9c&\xcb\xc4\xad&\xfekt\xed\xf9v lm)\r\x19\x049\xfb\xc4\xfa\xc6\xbd\xd8\xf0\xe6\x9bylU\xd6\x00\x98\xe4\x89\x15\x18\xc4\xf1\n\x8e\x0e\xf1~/\x8d&\xdbT\xe7@\xdd\x8a>\xd4U\x9b\xafL\x9fh\x19;\xfe\x8f\x13\x9e\xa5\xb0\xd5\x1a\r\\TBa\xfcO\x8a2\t\x0072\xff\xbc\x1a\x9e\x0e\x08p\xb7\x99>\xcbv\xd7/d\xb4\x037\x95\x0e\xfb0=F5\x9a\'hw\xc6\xc5\xc63\x85\x19\xc7\xe0\xd7\x00+\xf5j\xf1t\xe4\xb0f\xebM\xab3\x88?\xd2\xa4\x15\xf4^\xdc\xba\xbez\x86%\x8b\x9eO5\x04\xc4\xa2)\xea\xfe!\xb4\x8e\x83\xf7\x82\xed\x8c\xc0\xbbq\x89\xa2\xa7s\xfb\xf9\xc9\x02-\xe7\xe3\xdfp1\x1f\xdf\xb7Go\xa9t\xda\xf8n\xce\x84\x04X(\xdb\x84\x9a8\xa6\xe6B\xa2\xe1\x00l7|_3i\xc8\x01u\x04+\x1b\xd8\x9e\xd5\x94J\x04\xc5B\xa1%\xaf\x7f\xd7\x07\xc6\x98\x03_ \xdf7\x8a\xfc9b;\xf58\xc8w\xefz%\xf5h\x07\xdbB\xab\xb5/\x8d\x03Z\x1btBm3\x90\xc7\x9c\x8d:\xc6*\x8e\xe1\x0f\xc29W\x16\xfe\x7fW\xaa?\x13\x08\xad^R\x9d\xf0\xb75\xb2z^~\x12\x1d\x0fs\x8d\xa20\xfdK\xa1\xdb\xe7\xcc\xecPhH\xf4\x03\xceo\xa7\xd9L*\x1f.\xcc`\xbc\x08\xdc@<+/s\x92JH\xe1\xeer\xc7\xe9\xaf+\x8dyQVn0\x92\x93\xccI\xa1\xd4r6d\xd6\xca\x1f\r\x16\xbd\xf1m\x1d\x82\xb2h\xc3\x14\xed\x03\xfb=-q\xed\xc0\x90\xf4\xa9D\t\x94\xac\xd3\xe6\xa4\x14\x8a\xbe\x1dyy\xda\x1cmV\x85\xd3\xd1tpB\xe8\xe1\xa4\x0b\xa6A\x02C$M\xc6=\xe1\xf7\xf2\xf8.\x13\xc3\x87\xb4\xbfo\xac\xb54[8\xc2\x8d#\xa9-L!8\xecq\xc7\xdb\x9bA6\xa3,\x97\xaa\xf0P\x99\xb7\x89a;\x07\xac\xc2\'\xae~\x06(\xad\xc0\x0f\'\xb2:\x0fG\xf2\xf2\x8dl,\xd5\xc4\xf2\x9a\xcc\x08k12u\x19\xfb\x18\xbf\x1f\x0e\x92B\xfc\xcd\t\xf8\xaa\x8b\xf4K\x9dN\x95\x9a\xe8\xf2\x8b@\xb4}!\xf3\xdf\xaf&o\xb5O\x08\x1b\x08\x08\xeb\xe7\xf6\xd3\x9e#\x15\xb8\xf6\n\xba\xcfz\x84\xd2\xf9~T\xfaT\xed\xbe\x10E*\x86\xdav\xd0k\xb9$\x01)}8\xd1\xf1bQ\xeb\x18\x86\x7f\xe5\xe2\xa1\xdc\x16\x8db\xc5\xa4\xc4\\1\x00Wi\xc5\xf5\xc6\xe0!\xa8\x88\xaf\xa8\x87os\x88=\xfd\xc9\xd7\xde\x16\xc76b\x01un\xaa[\xf7o\x8a\xf3=\xf9\xe6\xf9Uj\xfa\xd7\xa5C\xdaJ\xfc\t\xc8\xf28p\xe2\xe25\xe0\xde\xddf\x92l-\x05g\x0c\xd3\xa8oW\'O\xb4\xcc\xecc8\x02q\x0e\xe0\x07\xe0\x9b1\xa3L\xf5\xfa\x8dB\xff>\xa2\xbb\xa5\xa2l\xc1\xd3n\x12E\n\x1b\xabo#v\x9b\x92c\x0b\x1f\xf6\xf5\xba\xaf\xef\xfeh\\\xa7\x08\xb6h\xc4\x040\x91\xf4c\xbb|\x11Y\xc7\xd6\x15\xea\xa9\xa9I\xc0\x06\xa9\xf8\x8c}?A\xb1\xbb\xebx7\x02\x80TNB\xb5\xe9\x0e\xf0k\xdc2.\x0f\x88\x0f\xb9\n>Dg\xf2Y\xfd\xa4\x91\r\xa0\x92\xe1\x17z\xc3^\xf9Q\xc7\\\xef\x18;\xb2^R+TF7\xfe\xa0L\xd5E\xa2S\xfd'}, 'nonce': 15, 'era': {'period': 128, 'current': 5973050}, 'tip': 0, 'asset_id': {'tip': 0, 'asset_id': None}, 'mode': 'Disabled', 'signature_version': 1, 'address': '0x105bfdbbaa8c1a08251f2672b753eda64debeb3d2ff2bc6cd685a7df8e405164', 'call': {'call_function': 'submit_encrypted', 'call_module': 'MevShield', 'call_args': {'commitment': '0xd706f59b3341689ffb110aee61d7ecdecb33bb5aa42ed481f99c4279297eb8ba', 'ciphertext': b'@\x04\xef\xe8\xfa\xf3\n\x1b\x13\xcd%*\x9co\xc5\x0c\x906L\x1f\xff\xa8\xcf4\xc4$\xa2kJ|x\x84\xe1\xab^W\x81)\x8d\x97/\xe57AQW\xad\x17l\x18]\x0e[\xe6H\'<7\xe1TzG\x1d\xef\xb2\xcc5\x07\xb9\xc4\xb2!\x87\xd4 \xee\xb1\xfc\x9d\xbfbb\xc22\xaeE;\xb2\x1a\x13\xc8\x80.nw\x05\xcb\x9c\x8a\x18\xa1\x86\xfbi\xa4\xd9\xff\xbc\x13y\x9f\xa6\xa32\x97\x8a`x\x1f\xab\x1f\x9b\xaf\xb6r\xc7v\xc1\n\\\x1ch\xd4u\x1aG&\xa1CR\x1a\xe4\xd9\xfe\x0c$\x81d` g\xa5qM\xee7\t\xb2\x9cK\xa0\xa7\x08\x9d\x9a\xe5z\xb4\xae\xd1\xa3U\x8e.\x94[\xe2 \xa4e0=`\xf2\xa3\xcb1\x01\x87\x8f\xc3\xecI\xa6h)\xcdowIp\x06\x88\x9a\x82\xe5\xf4 Z\xde\xfc\xd1oi\x95\xc7\xf7!lB{\x18\x84\xcf\xa0\xc9\x052J\xef\xbd\xc9\xb8\xe1\xa0\xfb\x1f\x17qX\xc4e\xe5\xef\xf1]\x05dp\xac[\xee\x99\xbc9\x19\x93#4\xb9J\xaeEP\xd0\x0e%\xfb\xa6\xe3\xd9<L\x030\xb4>\xa6\xd0\x00\x91\xd8\xda\x0cPC\x8cb0r\xfd:(I\xbd\xab\x85\x083_\xb2\x9b\x83\x0e\xbe\x90\xa1}*!\x8c\xa6\x15\xdb\x95\x97b&\x9c\x951<\x81|W\x97U\x9e\x84h\x9b\x0e\x9e\x8c\x13\r\xe5$\xa0\xd2]\xf7\xe9\x0cZ\xe5\x91\xb1\x06\xeez\x05r<\x1a\n\x90\xd4Ol\\\xaa\xff\x90P#-\xc8^\xf4\x1d\xa59Q/\x96\'\x0e.\x8e\xdb\x94\xa8\nM\xdf\x8d\xd6\xf7\xb8\xf44\x8aT\x8dqD_\x86\xb524\xa1h\xbf\x94\x80\x8c\x97\xc4\x81\x7fq\xf6\xfd\x7f\xc3\xe4X/S\xdb\x1ak\xd3\xf3\xfeJ\xc1:?\xa1UFp\x83\x8co\xa9"\xb2k\x14b\xe0\xc2m\xd3\x16\x02c*\xdd\x0c\xae\xbc\xcb\xa9)\xc5\xce6u\xa3\xe7\xcc\xc6\x13\x1d\x94\x9a\'\xaa\x04\xf8\x06w\x9c&\xcb\xc4\xad&\xfekt\xed\xf9v lm)\r\x19\x049\xfb\xc4\xfa\xc6\xbd\xd8\xf0\xe6\x9bylU\xd6\x00\x98\xe4\x89\x15\x18\xc4\xf1\n\x8e\x0e\xf1~/\x8d&\xdbT\xe7@\xdd\x8a>\xd4U\x9b\xafL\x9fh\x19;\xfe\x8f\x13\x9e\xa5\xb0\xd5\x1a\r\\TBa\xfcO\x8a2\t\x0072\xff\xbc\x1a\x9e\x0e\x08p\xb7\x99>\xcbv\xd7/d\xb4\x037\x95\x0e\xfb0=F5\x9a\'hw\xc6\xc5\xc63\x85\x19\xc7\xe0\xd7\x00+\xf5j\xf1t\xe4\xb0f\xebM\xab3\x88?\xd2\xa4\x15\xf4^\xdc\xba\xbez\x86%\x8b\x9eO5\x04\xc4\xa2)\xea\xfe!\xb4\x8e\x83\xf7\x82\xed\x8c\xc0\xbbq\x89\xa2\xa7s\xfb\xf9\xc9\x02-\xe7\xe3\xdfp1\x1f\xdf\xb7Go\xa9t\xda\xf8n\xce\x84\x04X(\xdb\x84\x9a8\xa6\xe6B\xa2\xe1\x00l7|_3i\xc8\x01u\x04+\x1b\xd8\x9e\xd5\x94J\x04\xc5B\xa1%\xaf\x7f\xd7\x07\xc6\x98\x03_ \xdf7\x8a\xfc9b;\xf58\xc8w\xefz%\xf5h\x07\xdbB\xab\xb5/\x8d\x03Z\x1btBm3\x90\xc7\x9c\x8d:\xc6*\x8e\xe1\x0f\xc29W\x16\xfe\x7fW\xaa?\x13\x08\xad^R\x9d\xf0\xb75\xb2z^~\x12\x1d\x0fs\x8d\xa20\xfdK\xa1\xdb\xe7\xcc\xecPhH\xf4\x03\xceo\xa7\xd9L*\x1f.\xcc`\xbc\x08\xdc@<+/s\x92JH\xe1\xeer\xc7\xe9\xaf+\x8dyQVn0\x92\x93\xccI\xa1\xd4r6d\xd6\xca\x1f\r\x16\xbd\xf1m\x1d\x82\xb2h\xc3\x14\xed\x03\xfb=-q\xed\xc0\x90\xf4\xa9D\t\x94\xac\xd3\xe6\xa4\x14\x8a\xbe\x1dyy\xda\x1cmV\x85\xd3\xd1tpB\xe8\xe1\xa4\x0b\xa6A\x02C$M\xc6=\xe1\xf7\xf2\xf8.\x13\xc3\x87\xb4\xbfo\xac\xb54[8\xc2\x8d#\xa9-L!8\xecq\xc7\xdb\x9bA6\xa3,\x97\xaa\xf0P\x99\xb7\x89a;\x07\xac\xc2\'\xae~\x06(\xad\xc0\x0f\'\xb2:\x0fG\xf2\xf2\x8dl,\xd5\xc4\xf2\x9a\xcc\x08k12u\x19\xfb\x18\xbf\x1f\x0e\x92B\xfc\xcd\t\xf8\xaa\x8b\xf4K\x9dN\x95\x9a\xe8\xf2\x8b@\xb4}!\xf3\xdf\xaf&o\xb5O\x08\x1b\x08\x08\xeb\xe7\xf6\xd3\x9e#\x15\xb8\xf6\n\xba\xcfz\x84\xd2\xf9~T\xfaT\xed\xbe\x10E*\x86\xdav\xd0k\xb9$\x01)}8\xd1\xf1bQ\xeb\x18\x86\x7f\xe5\xe2\xa1\xdc\x16\x8db\xc5\xa4\xc4\\1\x00Wi\xc5\xf5\xc6\xe0!\xa8\x88\xaf\xa8\x87os\x88=\xfd\xc9\xd7\xde\x16\xc76b\x01un\xaa[\xf7o\x8a\xf3=\xf9\xe6\xf9Uj\xfa\xd7\xa5C\xdaJ\xfc\t\xc8\xf28p\xe2\xe25\xe0\xde\xddf\x92l-\x05g\x0c\xd3\xa8oW\'O\xb4\xcc\xecc8\x02q\x0e\xe0\x07\xe0\x9b1\xa3L\xf5\xfa\x8dB\xff>\xa2\xbb\xa5\xa2l\xc1\xd3n\x12E\n\x1b\xabo#v\x9b\x92c\x0b\x1f\xf6\xf5\xba\xaf\xef\xfeh\\\xa7\x08\xb6h\xc4\x040\x91\xf4c\xbb|\x11Y\xc7\xd6\x15\xea\xa9\xa9I\xc0\x06\xa9\xf8\x8c}?A\xb1\xbb\xebx7\x02\x80TNB\xb5\xe9\x0e\xf0k\xdc2.\x0f\x88\x0f\xb9\n>Dg\xf2Y\xfd\xa4\x91\r\xa0\x92\xe1\x17z\xc3^\xf9Q\xc7\\\xef\x18;\xb2^R+TF7\xfe\xa0L\xd5E\xa2S\xfd'}}}
    extrinsic_fee: τ0.000013779
    extrinsic_receipt: ExtrinsicReceipt<hash:0x12e1075a8c52b610756e48652758552387ca3b82f4f5688f547c80bf7fd38047>

    mev_extrinsic: <async_substrate_interface.sync_substrate.ExtrinsicReceipt object at 0x118e34e10>
    transaction_tao_fee: τ0.000503547
    transaction_alpha_fee: 0.000000000α
    error: None
    data: {'balance_before': τ90.314788205, 'balance_after': τ89.314638078, 'stake_before': 0.000000000α, 'stake_after': 2,408.440776606α}
```

### Option 2: Compose Call and Submit Encrypted

For full control over the encryption and submission process, you can use the `mev_submit_encrypted` method on the `Subtensor` instance or call the `submit_encrypted_extrinsic` function directly.

See [Working with Blockchain Calls](./call).

### Nonce management

:::tip
The SDK handles nonce management automatically!
:::

When using MEV Shield, nonce management is important if you're using the **same account** to sign both the inner call and the submit call:

- If your next available nonce is `X`:
  - Sign the **inner call** (the one being encrypted) with nonce `X+1`
  - Sign the **submit call** with nonce `X`

This is because the submit call will be executed first (consuming nonce `X`), and then the inner call will be decrypted and executed (consuming nonce `X+1`).

**Alternative approach**: Use a different account as the submitter. This eliminates nonce coordination entirely—the inner call signer and the submit call signer have independent nonce sequences.

#### Key Parameters

- `signer_keypair` (optional): The keypair used to sign the inner call. This parameter is only available when calling `submit_encrypted_extrinsic` directly. If not provided, the wallet's coldkey is used as the default signer.

- `wait_for_revealed_execution` (default: `True`): Whether to wait for the `DecryptedExecuted` event, indicating that validators have successfully decrypted and executed the inner call. If `True`, the function polls subsequent blocks for the event matching this submission's commitment.

- `blocks_for_revealed_execution` (default: `5`): Maximum number of blocks to poll for the `DecryptedExecuted` event after inclusion. The function checks blocks from `start_block + 1` to `start_block + blocks_for_revealed_execution`. It returns immediately if the event is found before the block limit is reached.

#### MEV Receipt

- `mev_extrinsic_receipt`: When `wait_for_revealed_execution=True`, the `ExtrinsicResponse` object will contain a `mev_extrinsic_receipt` attribute. This contains the execution details of the revealed (decrypted and executed) extrinsic, including triggered events such as `DecryptedExecuted` or `DecryptedRejected`, block information, and other execution metadata.

:::note
If `wait_for_inclusion=False`, you cannot set `wait_for_revealed_execution=True`. This will raise a `ValueError` because we need to know the block where the encrypted transaction was included to search for the revealed execution event.
:::

#### Example: Direct MEV Shield Submission with SDK

```python
from bittensor import Subtensor, Wallet
from bittensor.core.extrinsics.pallets import SubtensorModule
from bittensor.utils.balance import Balance

# Initialize subtensor and wallet
subtensor = Subtensor()
wallet = Wallet()

staking_call = subtensor.compose_call(
    call_module="SubtensorModule",
    call_function="add_stake",
    call_params={
        "netuid": 1,
        "hotkey": "5C86aJ2uQawR6P6veaJQXNK9HaWh6NMbUhTiLs65kq4ZW3NH",
        "amount_staked": 1000000000  # in RAO
    }
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

print(response)
```
