# This file ....
# 

# set environment variables
import os

os.environ['WALLET'] = 'STAKE_WALLET'
os.environ['TOTAL_TAO_TO_STAKE'] = '1'
os.environ['NUM_SUBNETS_TO_STAKE_IN'] = '3'
os.environ['NUM_VALIDATORS_PER_SUBNET'] = '3'

# Initialize Axon
import bittensor as bt
axon = bt.Axon(wallet=self.wallet, config=self.config)

# create wallet
import bittensor as bt
wallet = bt.Wallet(name = 'my_coldkey', hotkey = 'my_hotkey' )
wallet.create_if_non_existent()


# check TAO balance

import bittensor as bt
sub = bt.Subtensor(network="test")
wallet = bt.wallet(
    name="PracticeKey!",
    hotkey="stakinkey1",
)
wallet.unlock_coldkey()
balance = sub.get_balance(wallet.coldkey.ss58_address)
print(balance)


# stake exchange rate
import bittensor as bt

sub = bt.Subtensor(network="test")
subnet = sub.subnet(netuid=1)

alpha_amount = bt.Balance.from_tao(100).set_unit(1)

print("alpha_to_tao_with_slippage", subnet.alpha_to_tao_with_slippage(alpha_amount))
print("alpha_to_tao_with_slippage percentage", subnet.alpha_to_tao_with_slippage(alpha_amount, percentage=True))

print("tao_to_alpha_with_slippage", subnet.tao_to_alpha_with_slippage(100))
print("tao_to_alpha_with_slippage percentage", subnet.tao_to_alpha_with_slippage(100, percentage=True))

print("tao_to_alpha", subnet.tao_to_alpha(100))
print("alpha_to_tao", subnet.alpha_to_tao(alpha_amount))

# view registered subnets

import bittensor as bt
sub = bt.Subtensor(network="test")
wallet = bt.Wallet(
    name="ExampleWalletName",
    hotkey="ExampleHotkey",
)
wallet.unlock_coldkey()
netuids = sub.get_netuids_for_hotkey(wallet.hotkey.ss58_address)
print(netuids)

# register on a subnet

import bittensor as bt
logging = bt.logging
logging.set_info()
sub = bt.Subtensor(network="test")
wallet = bt.Wallet(
    name="ExampleWalletName",
    hotkey="ExampleHotkey",
)
wallet.unlock_coldkey()
reg = sub.burned_register(wallet=wallet, netuid=3)

# asynchronous stake

import os, sys, asyncio
import bittensor as bt
import time
from bittensor import tao

# Load environmental variables
wallet_name=os.environ.get('WALLET')
total_to_stake=os.environ.get('TOTAL_TAO_TO_STAKE')
num_subnets= os.environ.get('NUM_SUBNETS_TO_STAKE_IN')
validators_per_subnet = os.environ.get('NUM_VALIDATORS_PER_SUBNET')

# Validate inputs
if wallet_name is None:
    sys.exit("❌ WALLET not specified. Usage: `WALLET=my-wallet TOTAL_TAO_TO_STAKE=1 NUM_SUBNETS_TO_STAKE_IN=3 NUM_VALIDATORS_PER_SUBNET=3 python script.py`")

if total_to_stake is None:
    print("⚠️ TOTAL_TAO_TO_STAKE not specified. Defaulting to 1 TAO.")
    total_to_stake = 1.0
else:
    try:
        total_to_stake = float(total_to_stake)
    except:
        sys.exit("❌ Invalid TOTAL_TAO_TO_STAKE amount.")

if num_subnets is None:
    num_subnets = 3
else:
    try:
        num_subnets = int(num_subnets)
    except:
        sys.exit("❌ Invalid NUM_SUBNETS_TO_STAKE_IN.")

if validators_per_subnet is None:
    validators_per_subnet = 3
else:
    try:
        validators_per_subnet = int(validators_per_subnet)
    except:
        sys.exit("❌ Invalid NUM_VALIDATORS_PER_SUBNET.")

print(f"\n🔓 Using wallet: {wallet_name}")
print(f"📊 Dividing {total_to_stake} TAO across top {validators_per_subnet} validators in each of top {num_subnets} subnets.")

wallet = bt.Wallet(wallet_name)

# Initialize the subtensor connection within a block scope to ensure it is garbage collected
async def stake_batch(subtensor, netuid, top_validators, amount_to_stake):
    for hk in top_validators:
        print(f"💰 Staking {amount_to_stake} to {hk} on subnet {netuid}...")
    try:
        results = await asyncio.gather(*[ subtensor.add_stake(wallet=wallet, netuid=netuid, hotkey_ss58=hk, amount=amount_to_stake) for hk in top_validators ] )
        print(results)
    except Exception as e:
        print(f"❌ Failed to stake to {hk} on subnet {netuid}: {e}")

async def find_top_three_valis(subtensor,subnet):
    netuid = subnet.netuid
    print(f"\n🔍 Subnet {netuid} had {subnet.tao_in_emission} emissions!")
    print(f"\n🔍 Fetching metagraph for subnet {netuid}...")

    start_time = time.time()
    metagraph = await subtensor.metagraph(netuid)

    print(f"✅ Retrieved metagraph for subnet {netuid} in {time.time() - start_time:.2f} seconds.")
    # Extract validators and their stake amounts
    hk_stake_pairs = [(metagraph.hotkeys[index], metagraph.stake[index]) for index in range(len(metagraph.stake))]

    # Sort validators by stake in descending order
    top_validators = sorted(hk_stake_pairs, key=lambda x: x[1], reverse=True)[0:3]

    # Print the top 3 validators for this subnet
    print(f"\n🏆 Top 3 Validators for Subnet {netuid}:")
    for rank, (index, stake) in enumerate(top_validators, start=1):
        print(f"  {rank}. Validator index {index} - Stake: {stake}")

    return {
        "netuid": netuid,
        "metagraph": metagraph,
        "validators": top_validators
    }

async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:

        print("Fetching information on top subnets by TAO emissions")

        # get subnets and sort by tao emissions
        sorted_subnets = sorted(list(await subtensor.all_subnets()), key=lambda subnet: subnet.tao_in_emission, reverse=True)
        top_subnets = sorted_subnets[0:3]
        amount_to_stake = bt.Balance.from_tao(total_to_stake/9)

        # find the top 3 validators in each subnet
        top_vali_dicts = await asyncio.gather(*[find_top_three_valis(subtensor, subnet) for subnet in top_subnets])
        top_validators_per_subnet = {}
        for d in top_vali_dicts:
            netuid = d['netuid']
            for v in d['validators']:
                hk = v[0]
                if netuid in top_validators_per_subnet:
                    top_validators_per_subnet[netuid].append(hk)
                else:
                    top_validators_per_subnet[netuid] = [hk]

        # Stake to each top 3 validators in each top 3 subnets
        start_time = time.time()
        await asyncio.gather(*[stake_batch(subtensor, netuid,top_validators, amount_to_stake) for netuid, top_validators in top_validators_per_subnet.items()])
        print(f"Staking completed in {time.time() - start_time:.2f}s")

asyncio.run(main())


## Asynchronous unstake

import os, sys, asyncio, time
import bittensor as bt
import bittensor_wallet
from bittensor import tao

async def perform_unstake(subtensor, stake, amount):
    try:
        print(f"⏳ Attempting to unstake {amount} from {stake.hotkey_ss58} on subnet {stake.netuid}")
        start = time.time()
        result = await subtensor.unstake(
            wallet, hotkey_ss58=stake.hotkey_ss58, netuid=stake.netuid, amount=amount
        )
        elapsed = time.time() - start
        if result:
            print(f"✅ Successfully unstaked {amount} from {stake.hotkey_ss58} on subnet {stake.netuid} in {elapsed:.2f}s")
            return True
        else:
            print(f"❌ Failed to unstake from {stake.hotkey_ss58} on subnet {stake.netuid}")
            return False
    except Exception as e:
        print(f"❌ Error during unstake from {stake.hotkey_ss58} on subnet {stake.netuid}: {e}")
        return False


async def main():
    async with bt.AsyncSubtensor(network='test') as subtensor:
        try:
            # Retrieve all active active stakes asscociated with the coldkey
            stakes = await subtensor.get_stake_info_for_coldkey(wallet_ck)
        except Exception as e:
            sys.exit(f"❌ Failed to get stake info: {e}")

        # Filter and sort
        # Remove small stakes that are under the minimum threshold
        stakes = list(filter(lambda s: float(s.stake.tao) > unstake_minimum, stakes))
        # Sort by emission rate (lowest emission first)
        stakes = sorted(stakes, key=lambda s: s.emission.tao)
        # Limit to the N lowest emission validators
        stakes = stakes[:max_stakes_to_unstake]

        if not stakes:
            sys.exit("❌ No eligible stakes found to unstake.")

        print(f"\n📊 Preparing to unstake from {len(stakes)} validators:\n")
        for s in stakes:
            print(f"Validator: {s.hotkey_ss58}\n  NetUID: {s.netuid}\n  Stake: {s.stake.tao}\n  Emission: {s.emission}\n-----------")

        # Determine how much TAO to unstake per validator
        amount_per_stake = total_to_unstake.tao / len(stakes)

        # Prepare concurrent unstake tasks, then execute as a batch
        tasks = [
            perform_unstake(subtensor, stake, bt.Balance.from_tao(min(amount_per_stake, stake.stake.tao)).set_unit(stake.netuid))
            for stake in stakes
        ]
        results = await asyncio.gather(*tasks)

        # Count successes and print final report
        success_count = sum(results)
        print(f"\n🎯 Unstake complete. Success: {success_count}/{len(stakes)}")

wallet_name = os.environ.get('WALLET')
total_to_unstake = os.environ.get('TOTAL_TAO_TO_UNSTAKE')
max_stakes_to_unstake = os.environ.get('MAX_STAKES_TO_UNSTAKE')

if wallet_name is None:
    sys.exit("wallet name not specified. Usage: `TOTAL_TAO_TO_UNSTAKE=1 MAX_STAKES_TO_UNSTAKE=10 WALLET=my-wallet-name ./unstakerscript.py`")

if total_to_unstake is None:
    print("Unstaking total not specified, defaulting to 1 TAO.")
    total_to_unstake = 1
else:
    try:
        total_to_unstake = float(total_to_unstake)
    except:
        sys.exit("invalid TAO amount!")

if max_stakes_to_unstake is None:
    max_stakes_to_unstake = 10
else:
    try:
        max_stakes_to_unstake = int(max_stakes_to_unstake)
    except:
        sys.exit("invalid number for MAX_STAKES_TO_UNSTAKE")

print(f"🔍 Using wallet: {wallet_name}")
print(f"🧮 Unstaking a total of {total_to_unstake} TAO across up to {max_stakes_to_unstake} lowest-emission validators")

total_to_unstake = bt.Balance.from_tao(total_to_unstake)
wallet = bt.Wallet(wallet_name)
wallet_ck = wallet.coldkeypub.ss58_address

unstake_minimum = 0.0005  # TAO
asyncio.run(main())

# Move stake

import asyncio
from concurrent.futures import ThreadPoolExecutor
import bittensor as bt
from bittensor.core.subtensor import Subtensor
from bittensor.core.async_subtensor import AsyncSubtensor

async def main():
    async with AsyncSubtensor("test") as subtensor:
        wallet = bt.Wallet(
            name="WALLET_HOTKEY"
        )
        wallet.unlock_coldkey()
        amount = bt.Balance.from_tao(1.0).set_unit(5) # set amount in origin subnet
        result = await subtensor.move_stake(wallet = wallet,
            origin_hotkey_ss58 = "5DyHnV9Wz6cnefGfczeBkQCzHZ5fJcVgy7x1eKVh8otMEd31",
            origin_netuid = 5,
            destination_hotkey_ss58 = "5HidY9Danh9NhNPHL2pfrf97Zboew3v7yz4abuibZszcKEMv",
            destination_netuid = 18,
            amount = amount,
            wait_for_inclusion = True,
            wait_for_finalization = False,
        )
        if result:
            print("Stake was successfully moved!")
        else:
            print("Failed to move stake.")
# Because move_stake is asynchronous, we run it in an event loop:
asyncio.run(main())

