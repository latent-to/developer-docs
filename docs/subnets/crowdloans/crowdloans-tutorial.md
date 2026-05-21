---
title: "Create a Subnet with a Crowdloan"
---

# Create a Subnet with a Crowdloan

This page describes creating a subnet via **crowdloan** on a locally deployed Bittensor chain. We will use the Polkadot‑JS web app to submit extrinsics.

See also [Crowdloans Overview](./index.md)

The following steps will take us through the lifecycle of a subnet creation crowdloan:

- First, we will **create** a crowdloan for a subnet. This is a special contract that will conditionally create the subnet if enough funds are raised (this threshold is called a crowdloan's **cap**).
- Next, we will **contribute** enough funds for the crowdloan to reach its cap.
- Next we must **finalize** the crowdloan, which executes the action wrapped inside the crowdloan&mdash;the creation of the subnet.
- Finally, we will verify the successful creation of the subnet by starting its emissions and observing the flow of liquidity to validator and creator hotkeys.

## Prerequisites

- A locally running subtensor development chain. For more information, see [run a local Bittensor blockchain instance](../../local-build/deploy.md).
- [Polkadot‑JS browser app](https://polkadot.js.org/apps/?#/explorer) and [Polkadot‑JS browser extension](https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd) installed.
- An accessible 'Alice' wallet (see: [Provision Wallets for Local Deploy](../../local-build/provision-wallets))

## Step 1: Connect Polkadot‑JS to your local chain

1. Open the Polkadot‑JS app.
2. In the network selector, choose Development → custom endpoint `ws://127.0.0.1:9944`.
3. Confirm your local chain metadata loads and your test accounts appear in the Accounts tab. To do this, see [create and import accounts to the Polkadot-JS extension](../../keys/multisig.md#create-and-import-3-coldkey-pairs-accounts-in-the-polkadot-js-browser-extension).

:::tip
If the web app does not connect to your local chain, your browser’s privacy or security settings may be blocking it. Try adjusting those settings and reconnecting.
:::

## Step 2: Generate call hash

Before creating the crowdloan, you must first generate the hash that registers the subnet and creates a dedicated proxy for the designated beneficiary.
To begin:

1. Go to **Developer** → **Extrinsics**.
2. Under “**using the selected account**”, pick the crowdloan "`creator`" account.
3. Under “**submit the following extrinsic**”, choose module `subtensorModule`, call `registerLeasedNetwork(emissionsShare, endBlock)`.
4. Fill the parameters:

   - `emissionsShare`: choose a percentage, e.g, 30.
   - `endBlock`: leave as none.

5. Copy the hex code shown in the **encoded call data** field. You will use this to create the crowdloan in the next step.

:::info
Do not submit the transaction after entering the parameters. Only copy the encoded call data once all parameters are provided.
:::

## Step 3: Create a crowdloan

We will create a campaign whose purpose is to register a leased subnet on finalize.

1. Go to **Developer** → **Extrinsics**.
2. Under “**using the selected account**”, pick the crowdloan "`creator`" account.
3. Under “**submit the following extrinsic**”, choose module `crowdloan`, call `create`.
4. Fill the parameters:

   - `deposit`: choose an amount (e.g., `10,000,000,000` = 10 TAO on default dev config)
   - `min_contribution`: e.g., `100,000,000` (0.1 TAO)
   - `cap`: e.g., `2,000,000,000,000` (2000 TAO)
   - `end`: pick a block height in the near future (e.g., current + 5000)
   - `call`: put the hex code of the encoded call data saved from the previous step.
   - `target_address`: leave as **None**.

   :::info

   - Set the `cap` value higher than the projected subnet lock cost plus proxy deposit (and a small fee buffer). On most dev setups the baseline lock cost is 1,000 TAO (1,000,000,000,000 RAO). If `cap` equals the lock cost exactly, the lease coldkey may lack enough to pay proxy deposits and finalize can fail with insufficient balance.
   - Crowdloans must have a duration between **7 days** (50,400 blocks minimum) and **60 days** (432,000 blocks maximum) on production chains. Therefore, the `end` value must be set at least 50,400 blocks and at most 432,000 blocks after the current block. This limitation also applies on testnet and mainnet.
     :::

5. Click **Submit Transaction** and sign with the `creator` account.

### Get the crowdloan ID

Crowdloan IDs are allocated sequentially, starting from `0`, with each new crowdloan assigned the next incremental ID. There is no extrinsic to list created crowdloans. Therefore, to check the identity of crowdloans created, you must use one of these methods.

- **From Events**:

  1. Navigate to the **block explorer** after submitting the crowdload transaction.
  2. In the **Explorer** tab, find the block in which the transaction occured.
  3. In the **Events** panel, locate the `crowdloan.create` extrinsic. The `crowdloan.Created` event payload includes `crowdloanId` that represents the ID of the crowdloan.

- **From storage**:

  1. From the **Developer** dropdown, navigate to **Chain state** → **Storage**.
  2. Click the **selected state query** menu and select `crowdloan.nextCrowdloanId`.
  3. Click the **+** icon to run the query.

  :::tip
  This query returns the ID assigned to the next crowdloan that will be created. Subtract 1 from the returned value to determine the total number of crowdloans that currently exist.
  :::

- **From the JS console**:
  1. From the **Developer** dropdown, navigate to **Javascript**.
  2. Next, paste the following code block in the editor and run:

```javascript
// List all existing crowdloan ids
const keys = await api.query.crowdloan.crowdloans.keys();
console.log(keys.map((k) => k.args[0].toNumber()));
```

## Step 4: Contribute to the crowdloan

All contributions must occur before the defined `end` block and will be clipped to the `cap` value provided.

To contribute to the crowdloan, repeat the following steps for each contributor account:

1. From the **Developer** dropdown, navigate to **Extrinsics**
2. Under “**using the selected account**”, select the crowdloan "contributor(s)" account.
3. Under “**submit the following extrinsic**”, choose module `crowdloan`, call `contribute (crowdloan_id, amount)`.
4. Provide the `crowdloan_id` (typically 0 on a fresh chain) and an amount.
5. Submit and sign.

:::info

The crowdloan cap is the maximum total raise. If a contribution would push the total above this cap, the contribution is clipped to fit the remaining available amount. Once the cap is reached, any further contributions are rejected and a `crowdloan.CapRaised` event is triggered.
:::

### Verify crowdloan contributions

To verify crowdload contributions:

- **From Events**:

  1. Navigate to the **block explorer** after contributing to the crowdload.
  2. In the **Explorer** tab, find the block in which the transaction occured.
  3. In the **Events** panel, locate the `crowdloan.contribute` extrinsic. The `crowdloan.Contributed` event payload contains the `crowdloanId`, the contributing account, and amount contributed.

- **From storage**:

  1. From the **Developer** dropdown, navigate to **Chain state** → **Storage**.
  2. Click the **selected state query** menu and select one of the following:

     - `crowdloan.Crowdloans(crowdloan_id)` to check details of the crowdloan
     - `crowdloan.Contributions(crowdloan_id, contributor)` to check contributions by an account.

  3. Click the **+** icon to run the query.

## Step 5: Finalize the crowdloan

The crowdload can be finalized by the creator when the end block has passed and the cap has been fully raised (`raised == cap`).

1. Wait for the chain to reach the `end` block.
2. From the **Developer** dropdown, go to **Extrinsics**.
3. Under **using the selected account**, select the crowdloan creator account.
4. Select `crowdloan.finalize(crowdloan_id)` and put the ID of the crowdload.
5. Submit and sign.

<details>
<summary><strong>Show Event Output</strong></summary>
```
system.ExtrinsicSuccess
balances.Withdraw (x2)
system.NewAccount (x2)
balances.Endowed
balances.Transfer (x2)
subtensorModule.RegistrationAllowed
subtensorModule.MaxAllowedUidsSet
subtensorModule.MaxAllowedValidatorsSet
subtensorModule.MinAllowedWeightSet
subtensorModule.MaxWeightLimitSet
subtensorModule.AdjustmentIntervalSet
subtensorModule.RegistrationPerIntervalSet
subtensorModule.AdjustmentAlphaSet
subtensorModule.ImmunityPeriodSet
subtensorModule.MinDifficultySet
subtensorModule.MaxDifficultySet
subtensorModule.NetworkAdded
balances.Reserved
proxy.ProxyAdded
subtensorModule.SubnetLeaseCreated
crowdloan.Finalized
balances.Deposit
transactionPayment.TransactionFeePaid
extrinsic event
```
</details>

:::info

- Even if the `cap` has been raised, the crowdloan cannot be finalized before the `end` block. Finalizing before the contribution period ends fails with a `ContributionPeriodNotEnded` event.
- If `target_address` was provided, the raised amount is transferred there.
- The stored `subtensor.register_leased_network` call executes with creator origin, and the subnet lease is created.
- The created subnet lease includes the coldkey and hotkey of the proxy wallet that manages the subnet. See [Get the lease coldkey](#get-the-lease-coldkey).
  :::

### Verify the leased subnet

Finalizing the crowdloan registers a new subnet and creates a dedicated proxy for the designated beneficiary. Use one of the following methods to verify the creation of the leased subnet:

- **Using BTCLI**:

  You can verify the creation of the new subnet by running the following command in your terminal:

  ```sh
  btcli subnets list --network local
  ```

  This command lists all created subnets on the chain. Notice the addition of a new subnet among the listed subnets—netuid `2` in the following output.

<details>
<summary><strong>Show Sample Output</strong></summary>

```console
Using the specified network local from config
[15:49:40] Warning: Verify your local subtensor is running on port 9944.                                                                                                                     subtensor_interface.py:89

                                                              Subnets
                                                          Network: local


        ┃           ┃ Price       ┃ Market Cap  ┃              ┃                        ┃               ┃              ┃
Netuid  ┃ Name      ┃ (Τ_in/α_in) ┃ (α * Price) ┃ Emission (Τ) ┃ P (Τ_in, α_in)         ┃ Stake (α_out) ┃ Supply (α)   ┃ Tempo (k/n)
━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━
  0     │ τ root    │ 1.0000 τ/Τ  │ τ 0.00      │ τ 0.0000     │ -, -                   │ Τ 0.00        │ 0.00 Τ /21M  │ -/-
  2     │ β omron   │ 0.0000 τ/β  │ τ 0.00      │ τ 0.0000     │ τ 1.00k, 1.00k β       │ 0.00 β        │ 1.00k β /21M │ 3/10
  1     │ α apex    │ 0.0000 τ/α  │ τ 0.00      │ τ 0.0000     │ τ 10.00, 10.00 α       │ 1.00 α        │ 11.00 α /21M │ 28/100
────────┼───────────┼─────────────┼─────────────┼──────────────┼────────────────────────┼───────────────┼──────────────┼─────────────
  4     │           │ τ 0.0       │             │ τ 0.0        │ τ 2.01k/20.93k (9.60%) │               │              │

```

</details>

## Step 6: Start the leased subnet (via proxy)

Before starting the subnet, you must first get the address of the proxy wallet specified in the subnet lease, as this wallet controls the subnet.

#### **Get the lease coldkey**

1. From the **Developer** dropdown, navigate to **Chain state** → **Storage**.
2. Click the **selected state query** menu and select `subtensorModule.SubnetLeases(lease_id)` to display details of the subnet lease, including the beneficiary, emission share, end block, lease coldkey and hotkey, netuid, and creation cost.
3. Click the **+** icon to run the query.
4. Copy the value of the `lease.coldkey` in the response. You can add the lease coldkey to the address book on the Polkadot.js web app so that it's selectable in the UI.

:::tip

- In your local environment, the `lease_id` would be the same as the ID of the crowdloan created. You can confirm the `lease_id` by examining the block where the subnet lease was created for a `subtensorModule.SubnetLeaseCreated` event.

  :::

Next, follow the following steps to start the subnet:

1. Go to **Developer** → **Extrinsics**.
2. Under “**using the selected account**”, pick the crowdloan "`creator`" account.
3. Under “**submit the following extrinsic**”, choose module `proxy`, call `proxy(real, forceProxyType, call)`.
4. Fill the parameters:

   - `real`: enter the `lease.coldkey` gotten from the previous query.
   - `forceProxyType`: click the toggle and then choose the `SubnetLeaseBeneficiary`option in the dropdown.
   - `call`: choose `subtensorModule.start_call` and then enter the netuid of the subnet you want to start.
   - Submit and sign.

## Observe dividends distribution

Emissions accrue in Alpha (subnet share units), but are distributed in TAO. On distribution, the contributors' alpha is unstaked/swapped to TAO using the subnet pool; if swap/unstake cannot proceed (liquidity/price), the alpha is accumulated for later.

Owner emissions are periodically split among contributors and the beneficiary, but only when all of these are true:

- The subnet is leased and active (lease has not ended).
- A coinbase cycle paid an owner cut to the subnet owner for the given `netuid`.
- Current block is an exact multiple of `LeaseDividendsDistributionInterval` (check in Constants).
- There is sufficient liquidity to unstake the contributors’ cut from the subnet at or above the minimum swap price.

Balances credited go to each contributor’s coldkey and the beneficiary’s coldkey. You can observe changes by querying balances over time.

## Alternative path: Refund and dissolve

If the cap is not reached by `end`:

1. Anyone can call `crowdloan.refund(crowdloan_id)` repeatedly until all contributors (except the creator) are refunded (batched per call).
2. After refunds complete (only the creator’s deposit remains), the `creator` can call `crowdloan.dissolve(crowdloan_id)` to clean up and recover the deposit.

### Optional: Withdraw

Before finalization:

- Any contributor can `crowdloan.withdraw(crowdloan_id)` to recover their contribution.
- The creator can only withdraw amounts above the kept deposit; the deposit itself remains until refund/dissolve.

## Troubleshooting

- Call fails with `InvalidCrowdloadId`
  - Ensure that the crowdloan ID exists.
- Call fails with `InvalidOrigin`
  - Ensure that the selected account that is responsible for signing the transaction.
- Call fails with `BlockDurationTooShort`
  - Ensure that the crowdloan `end` is set at least 7 days (50,400 blocks) from the current block.
- Call fails with `BlockDurationTooLong`
  - Ensure that the crowdloan `end` is set at most 60 days (432,000 blocks) from the current block.
- Contribution call fails with `ContributionPeriodEnded`
  - Extend the `end` value on the crowdloan using the `crowdloan.updateEnd` extrinsic.
- Finalize fails with `CapNotRaised`
  - Ensure total `raised` equals `cap`. Add contributions or adjust `cap` via `update_cap` (creator‑only) before `finalize`.
- Finalize fails with `ContributionPeriodNotEnded`
  - Wait until the `end` block is reached.
- Finalize fails with `CallUnavailable`
  - Ensure the nested call was supplied during `create`. The pallet stores it as a preimage; if unavailable, it errors and drops the reference.
- Refund does nothing
  - Refunds only after `end` and only for non‑finalized campaigns. It processes up to `RefundContributorsLimit` contributors per call.
