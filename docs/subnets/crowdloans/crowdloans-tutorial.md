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

## Connect Polkadot‑JS to your local chain

1. Open the Polkadot‑JS app.
2. In the network selector, choose Development → custom endpoint `ws://127.0.0.1:9944`.
3. Confirm your local chain metadata loads and your test accounts appear in the Accounts tab. To do this, see [create and import accounts to the Polkadot-JS extension](../../keys/multisig.md#create-and-import-3-coldkey-pairs-accounts-in-the-polkadot-js-browser-extension).

:::tip
If the web app does not connect to your local chain, your browser’s privacy or security settings may be blocking it. Try adjusting those settings and reconnecting.
:::

## Create a crowdloan

We will create a campaign whose purpose is to register a leased subnet on finalize.

1. Go to **Developer** → **Extrinsics**.
2. Under “**using the selected account**”, pick the crowdloan "`creator`" account.
3. Under “**submit the following extrinsic**”, choose module `crowdloan`, call `create`.
4. Fill the parameters:

   - deposit: choose an amount (e.g., `10,000,000,000` = 10 TAO on default dev config)
   - min_contribution: e.g., `100,000,000` (0.1 TAO)
   - cap: e.g., `2,000,000,000,000` (2000 TAO)
   - end: pick a block height in the near future (e.g., current + 50,400)
   - call: leave as **None**.
   - target_address: leave as **None**.

   :::info

   - Set the `cap` value higher than the projected subnet lock cost plus proxy deposit (and a small fee buffer). On most dev setups the baseline lock cost is 1,000 TAO (1,000,000,000,000 RAO). If `cap` equals the lock cost exactly, the lease coldkey may lack enough to pay proxy deposits and finalize can fail with insufficient balance.
   - The minimum duration for a crowdloan is one week (≈ 50,400 blocks). Therefore, the `end` value must be set at least 50,400 blocks after the current block.
     :::

5. Click **Submit Transaction** and sign with the `creator` account.

## Get the crowdloan ID

Crowdloan IDs are allocated sequentially, starting from `0`, with each new crowdloan assigned the next incremental ID. There is no extrinsic to list created crowdloans. Therefore, to check the identity of crowdloans created, you must use one of these methods.

- **From Events**:
  1. Navigate to the **block explorer** after submitting the crowdload transaction.
  2. In the **Explorer** tab, the block in which the transaction occured.
  3. In the **Events** panel, find the `crowdloan.create` extrinsic. The `crowdloan.Created` event payload includes `crowdloanId` that represents the ID of the crowdloan.
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

## Contribute to the crowdloan

All contributions must occur before the defined `end` block and will be clipped to the `cap` value provided.

To contribute to the crowdloan, repeat the following steps for each contributor account:

1. From the **Developer** dropdown, navigate to **Extrinsics**
2. Under “**using the selected account**”, select the crowdloan "contributor(s)" account.
3. Under “**submit the following extrinsic**”, choose module `crowdloan`, call `contribute (crowdloan_id, amount)`.
4. Provide the `crowdloan_id` (typically 0 on a fresh chain) and an amount.
5. Submit and sign.

Notes:

- Cap is the maximum total raise, not a minimum. Contributions that would exceed the remaining amount are clipped; after cap is reached, further contributions are rejected with `CapRaised`.
- There is no per‑contributor max beyond the remaining amount and runtime checks, but there is a global `MaxContributors` limit.

Verify:

- Check Events for `crowdloan.Contributed`.
- In Developer → Chain state → Storage, query `crowdloan.Crowdloans(crowdloan_id)` and `crowdloan.Contributions(crowdloan_id, contributor)`.

## Finalize the crowdloan

Once the end block has passed and the cap has been fully raised (`raised == cap`), the creator finalizes.

1. Wait for the chain to reach the `end` block (watch the status bar or use the Blocks tab).
2. Developer → Extrinsics → using account `creator`.
3. Select `crowdloan.finalize(crowdloan_id)`.
4. Submit and sign.

On success:

- If `target_address` was provided, the raised amount is transferred there.
- The stored `subtensor.register_leased_network` call executes with creator origin, and the lease is created.

actual success!!!

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

Notes:

- Finalizing before the contribution period ends fails with `ContributionPeriodNotEnded`. This keeps the window open so others can contribute until `end`.

## Verify the leased subnet

Open Developer → Chain state → Storage, module `subtensor` and check:

- `SubnetLeases(lease_id)` → shows beneficiary, emissions_share, end_block, netuid, cost
- `SubnetUidToLeaseId(netuid)` → maps subnet to lease id
- `SubnetLeaseShares(lease_id, contributor)` → pro‑rata shares per contributor

Also verify a proxy was added for the beneficiary:

- Module `proxy` → query `Proxies(lease_coldkey)` (if available in your UI) to see the `SubnetLeaseBeneficiary` delegate.

## Start the leased subnet (via proxy)

1. Build the inner call (to get its encoding) [optional]

- Developer → Extrinsics → pick the inner call you want (e.g., `subtensorModule.start_call`) and fill its arguments.
- Copy the “encoded call data” (hex starting with `0x…`).

2. Submit the proxy

- Using account: your beneficiary
- Module/method: `proxy → proxy`
- Fields:
  - real: `lease.coldkey` from `subtensorModule.subnetLeases(lease_id)`
  - forceProxyType: `SubnetLeaseBeneficiary`
  - call: either expand and select the inner call again with arguments, or paste the encoded call hex from step 1
- Leave delay at 0 → Submit and sign.

Tips:

- Add the `lease.coldkey` to your Address book so it’s selectable in the UI.
- Verify the proxy exists on‑chain before submitting: `proxy.Proxies(lease_coldkey)` should show your beneficiary with type `SubnetLeaseBeneficiary`.

## Observe dividends distribution

Emissions accrue in Alpha (subnet share units). On distribution, the contributors’ alpha is unstaked/swapped to TAO using the subnet pool; if swap/unstake cannot proceed (liquidity/price), the alpha is accumulated for later.

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

- Finalize fails with CapNotRaised
  - Ensure total `raised` equals `cap`. Add contributions or adjust `cap` via `update_cap` (creator‑only) before `finalize`.
- Finalize fails with ContributionPeriodNotEnded
  - Wait until the `end` block is reached.
- Finalize fails with CallUnavailable
  - Ensure the nested call was supplied during `create`. The pallet stores it as a preimage; if unavailable, it errors and drops the reference.
- Refund does nothing
  - Refunds only after `end` and only for non‑finalized campaigns. It processes up to `RefundContributorsLimit` contributors per call.
