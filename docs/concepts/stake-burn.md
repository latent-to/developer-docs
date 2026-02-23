---
title: "Subnet stake burn"
---

import StakeBurn from '/img/docs/stake-burn.png';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Subnet Stake Burn

The stake burn mechanism allows subnet owners to reduce the amount of alpha in circulation. This page describes Bittensor's subnet stake burn mechanism. It covers the mechanism’s behavior, how to execute a stake burn, and its effect on a subnet.

The stake burn mechanism allows subnet owners to permanently remove alpha from circulation. It works as a combination of the [`add_stake`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/add_stake.rs#:~:text=pub%20fn%20do_add_stake)/[`add_stake_limit`](https://github.com/opentensor/subtensor/blob/main/pallets/subtensor/src/staking/add_stake.rs#:~:text=pub%20fn%20do_add_stake_limit) extrinsics and the `burn_alpha` extrinsic.

The mechanism acts as a voluntary _subnet buyback_ whereby TAO is sent into the subnet's TAO reserve and Alpha is taken out of circulation.

## How stake burn works

The stake burn sequence begins when a subnet owner calls the `add_stake_burn` extrinsic. The extrinsic initially withdraws the specified amount TAO from the subnet owner coldkey and stakes the TAO to a hotkey on the subnet. The TAO stake is then added to the subnet's TAO reserve in its AMM pool. At the same time, the subnet's AMM pool algorithm uses the latest exchange rate to calculate the equivalent amount of alpha for the TAO that was staked.

The acquired alpha is removed from the pool's alpha reserve, sent to the hotkey, and then immediately burned within the same transaction. As a result, the circulating alpha decreases, the AMM pool reserves adjust, and the alpha price updates according to the new reserve ratio—i.e., more TAO and less alpha in the reserve.

The `add_stake_burn` extrinsic is rate-limited per subnet. The subnet owner can only call it once per _tempo_ (once every 360 blocks). Attempting a second call within the same tempo for that subnet will return an `AddStakeBurnRateLimitExceeded` error.

<!--
@startuml
title Stake Burn

actor "Subnet Owner\n(Coldkey)" as Coldkey
database "Chain\n(Subtensor)" as Pallet
actor "Hotkey" as Hotkey
participant "Subnet AMM Pool" as AMM

Coldkey -> Pallet: add_stake_burn(hotkey, netuid, amount, limit)

note right of Pallet
Rate limit check:
- Per tempo (360 blocks)
end note

alt Rate limit exceeded
    Pallet -> Coldkey: AddStakeBurnRateLimitExceeded
else Rate limit ok
    Pallet -> Coldkey: Withdraw TAO
    Pallet -> Hotkey: Stake TAO to hotkey

    Pallet -> AMM: Add TAO to TAO reserve
    AMM -> AMM: Calculate alpha output\n(using current exchange rate)

    AMM -> Pallet: Alpha amount
    Pallet -> AMM: Remove alpha from alpha reserve
    Pallet -> Hotkey: Transfer acquired alpha

    Pallet -> Pallet: Burn alpha immediately

    note right of AMM
    Pool state after burn:
    - Higher TAO reserve
    - Lower alpha reserve
    - Updated alpha price
    end note
end

@enduml
-->

<img src={StakeBurn} alt="Stake burn sequence"/>

:::warning Slippage and Price Impact
The initial staking on stake-burn operations execute against the subnet’s AMM pool and are subject to price slippage. Large staking amounts or low liquidity can significantly move the alpha price, resulting in fewer alpha acquired than expected. Therefore, always use limit price or slippage tolerance to control execution risk.

To learn more about slippage during staking operations, see [Understanding slippage](../learn/slippage.md).
:::

## Execute a stake burn

Execute a stake burn by calling the `add_stake_burn` extrinsic with the target subnet, hotkey, and TAO amount. The following snippets show how to execute a stake burn using BTCLI and the Bittensor SDK:

<Tabs groupId="stake-burn">

<TabItem value="btcli" label="BTCLI">
```sh
  btcli sudo stake-burn --netuid NETUID --amount 10 --network local
```

<details>
    <summary><strong>Show sample output</strong></summary>

<!-- prettier-ignore-start -->

```
Safe staking: enabled (from config).
Rate tolerance: 0.005 (0.5%) by default. Set this using `btcli config set` or `--tolerance` flag
Enter the hotkey name or hotkey ss58 address (to use for the stake burn) (default): sn-creator
Enter the wallet name (Hint: You can set this with `btcli config set --wallet-name`) (default): sn-creator
Using the specified network local from config
[21:23:36] Warning: Verify your local subtensor is running on port 9944.                                                                                                                    subtensor_interface.py:91
                                                                                                                                                                             
                                                                               Subnet Buyback:                                                                               
                                                Wallet: sn-creator, Coldkey ss58: 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY                                                
                                                                               Network: local                                                                                
                                                                                                                                                                             
 Netuid ┃                      Hotkey                      ┃ Amount (τ) ┃      Rate (per τ)       ┃ Est. Burned ┃ Fee (τ)  ┃ Extrinsic Fee (τ) ┃ Rate with tolerance: (0.5%) 
━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   14   │ 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY │ ‎10.0000 τ‎  │ 0.9861482403319707 δ/Τ  │  ‎9.7681 δ‎   │ Τ 0.0050 │     ‎0.0001 τ‎      │         0.9812 δ/Τ          
────────┼──────────────────────────────────────────────────┼────────────┼─────────────────────────┼─────────────┼──────────┼───────────────────┼─────────────────────────────
        │                                                  │            │                         │             │          │                   │                             
Would you like to continue? [y/n] (n): y
Enter your password: 
Decrypting...
✅ Your extrinsic has been included as 6324-6
✅ Subnet stake burn succeeded on SN14.
```

<!-- prettier-ignore-end -->

</details>

</TabItem>

<TabItem value="sdk" label="Bittensor SDK">

```py
import bittensor as bt

subtensor = bt.Subtensor(network="local")
wallet = bt.Wallet(name="WALLET_NAME")

netuid = 14
amount = bt.Balance.from_tao(10.0)
hotkey_ss58 = "HOTKEY_SS58"     # Hotkey to stake to (and burn the resulting Alpha)

response = subtensor.add_stake_burn(
    wallet=wallet,
    netuid=netuid,
    hotkey_ss58=hotkey_ss58,
    amount=amount,
    wait_for_inclusion=True,
    wait_for_finalization=True,
)

if response.success:
    print(f"Stake burn completed successfully!")
else:
    print(f"Failed to execute stake burn: {response.message}")
```

</TabItem>

</Tabs>

## Troubleshooting

- `SlippageTooHigh`: The final Alpha price resulting from the swap exceeded the `limit_price` specified in the extrinsic. Increase the transaction's slippage tolerance value or execute with a lower amount of TAO.
- `AddStakeBurnRateLimitExceeded`: The subnet has already processed a stake burn during the current tempo.
- `HotKeyAccountNotExists`: The specified hotkey does not exist on the target subnet. Verify the hotkey is registered on the subnet.
