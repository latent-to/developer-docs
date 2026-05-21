#!/usr/bin/env python3
"""
Bittensor SDK Documentation Examples - Runnable Test Suite
"""

# Set environment variables FIRST (before importing bittensor)
import os
import sys

os.environ.setdefault('BT_WALLET_NAME', 'alice')
os.environ.setdefault('BT_WALLET_HOTKEY', 'alice')
os.environ.setdefault('BT_SUBTENSOR_NETWORK', 'test')
os.environ.setdefault('TOTAL_TAO_TO_STAKE', '1')
os.environ.setdefault('NUM_SUBNETS_TO_STAKE_IN', '3')
os.environ.setdefault('NUM_VALIDATORS_PER_SUBNET', '3')
os.environ.setdefault('BT_LOGGING_DEBUG', '1')

import asyncio
import time
import bittensor as bt
from bittensor.core.async_subtensor import AsyncSubtensor
from bittensor.core.metagraph import Metagraph
from bittensor.core.extrinsics.utils import sudo_call_extrinsic

# Utility function to run examples
def run_example(name, func):
    """Run an example and handle errors"""
    print(f"\n{'='*70}")
    print(f"  {name}")
    print(f"{'='*70}\n")
    try:
        result = func()
        print(f"✓ {name} completed successfully\n")
        return True
    except Exception as e:
        print(f"✗ {name} failed: {e}\n")
        return False

async def run_async_example(name, func):
    """Run an async example and handle errors"""
    print(f"\n{'='*70}")
    print(f"  {name}")
    print(f"{'='*70}\n")
    try:
        result = await func()
        print(f"✓ {name} completed successfully\n")
        return True
    except Exception as e:
        print(f"✗ {name} failed: {e}\n")
        return False

##############################################################################

# Example 1: Creates an Axon instance for serving requests on the Bittensor network
def example_1_create_axon():
    """Initialize Axon"""
    # Note: This example requires wallet and config - using env wallet
    import bittensor as bt
    wallet = bt.Wallet()  # Uses BT_WALLET_NAME from env
    axon = bt.Axon(wallet=wallet, port=8091)
    print(f"Axon created: {axon.uuid}")

# Example 2: Creates a wallet instance using environment variables
def example_2_create_wallet():
    """Create wallet"""
    import bittensor as bt
    wallet = bt.Wallet()  # Uses BT_WALLET_NAME from env
    # wallet.create_if_non_existent()  # Commented out to avoid prompts
    print(f"Wallet: {wallet.name}, Hotkey: {wallet.hotkey_str}")

##############################################################################

# Example 3: Retrieves the TAO balance for a wallet's coldkey address
def example_3_check_balance():
    """Check TAO balance"""
    import bittensor as bt
    from bittensor_wallet import Keypair
    sub = bt.Subtensor(network="test")
    
    # Use a test keypair instead of requiring real wallet files
    coldkey = Keypair.create_from_uri('//Alice')
    balance = sub.get_balance(coldkey.ss58_address)
    print(f"Balance for test address {coldkey.ss58_address[:10]}...: {balance}")

#############################################################################################

# Example 4: Demonstrates calculating exchange rates between TAO and Alpha tokens with and without slippage
def example_4_exchange_rate():
    """Stake exchange rate (with and without slippage)"""
    import bittensor as bt
    
    sub = bt.Subtensor(network="test")
    subnet = sub.subnet(netuid=1)
    
    alpha_amount = bt.Balance.from_tao(100).set_unit(1)
    
    print("alpha_to_tao_with_slippage", subnet.alpha_to_tao_with_slippage(alpha_amount))
    print("alpha_to_tao_with_slippage percentage", subnet.alpha_to_tao_with_slippage(alpha_amount, percentage=True))
    
    tao_amount = bt.Balance.from_tao(100)
    print("tao_to_alpha_with_slippage", subnet.tao_to_alpha_with_slippage(tao_amount))
    print("tao_to_alpha_with_slippage percentage", subnet.tao_to_alpha_with_slippage(tao_amount, percentage=True))
    
    print("tao_to_alpha", subnet.tao_to_alpha(tao_amount))
    print("alpha_to_tao", subnet.alpha_to_tao(alpha_amount))

##################################################################################

# Example 5: Retrieves the list of subnets where a hotkey is registered
def example_5_registered_subnets():
    """View registered subnets"""
    import bittensor as bt
    from bittensor_wallet import Keypair
    sub = bt.Subtensor(network="test")
    
    # Use a test keypair instead of requiring real wallet files
    hotkey = Keypair.create_from_uri('//Alice')
    netuids = sub.get_netuids_for_hotkey(hotkey.ss58_address)
    print(f"Registered subnets for test address {hotkey.ss58_address[:10]}...: {netuids}")

############################################################################################

# Example 6: Demonstrates how to register a wallet on a subnet using burned registration
def example_6_register_subnet():
    """Register on a subnet"""
    import bittensor as bt
    logging = bt.logging
    logging.set_info()
    sub = bt.Subtensor(network="test")
    wallet = bt.Wallet()  # Uses env variables
    # reg = sub.burned_register(wallet=wallet, netuid=3)  # Commented to avoid actual registration
    print(f"Note: Registration example skipped (would register wallet on subnet 3)")

###########################################################################################

# Example 7: Demonstrates asynchronous staking across multiple subnets by finding top validators
async def example_7_async_stake():
    """Asynchronous stake"""
    import bittensor as bt
    import time
    
    # Load environmental variables
    wallet_name = os.environ.get('BT_WALLET_NAME')
    total_to_stake = float(os.environ.get('TOTAL_TAO_TO_STAKE', 1))
    num_subnets = int(os.environ.get('NUM_SUBNETS_TO_STAKE_IN', 3))
    validators_per_subnet = int(os.environ.get('NUM_VALIDATORS_PER_SUBNET', 3))
    
    print(f"🔓 Using wallet: {wallet_name}")
    print(f"📊 Dividing {total_to_stake} TAO across top {validators_per_subnet} validators in each of top {num_subnets} subnets.")
    
    wallet = bt.Wallet(name=wallet_name)
    
    # Initialize the subtensor connection within a block scope
    async def stake_batch(subtensor, netuid, top_validators, amount_to_stake):
        for hk in top_validators:
            print(f"💰 Would stake {amount_to_stake} to {hk} on subnet {netuid}...")
        # Commented out actual staking to avoid real transactions
        # results = await asyncio.gather(*[add_stake_extrinsic(subtensor=subtensor, wallet=wallet, netuid=netuid, hotkey_ss58=hk, amount=amount_to_stake) for hk in top_validators])
        print(f"Note: Staking skipped (read-only mode)")
    
    async def find_top_three_valis(subtensor, subnet):
        netuid = subnet.netuid
        print(f"\n🔍 Subnet {netuid} had {subnet.tao_in_emission} emissions!")
        
        metagraph = await subtensor.metagraph(netuid)
        hk_stake_pairs = [(metagraph.hotkeys[index], metagraph.stake[index]) for index in range(len(metagraph.stake))]
        top_validators = sorted(hk_stake_pairs, key=lambda x: x[1], reverse=True)[0:validators_per_subnet]
        
        print(f"🏆 Top {validators_per_subnet} Validators for Subnet {netuid}:")
        for rank, (hotkey, stake) in enumerate(top_validators, start=1):
            print(f"  {rank}. {hotkey[:10]}... - Stake: {stake}")
        
        return {"netuid": netuid, "metagraph": metagraph, "validators": top_validators}
    
    async with bt.AsyncSubtensor(network='test') as subtensor:
        sorted_subnets = sorted(list(await subtensor.all_subnets()), key=lambda subnet: subnet.tao_in_emission, reverse=True)
        top_subnets = sorted_subnets[0:num_subnets]
        
        # Find top validators
        top_vali_dicts = await asyncio.gather(*[find_top_three_valis(subtensor, subnet) for subnet in top_subnets])
        print(f"✅ Found top validators in {len(top_vali_dicts)} subnets")

###########################################################################################################

# Example 8: Demonstrates asynchronous unstaking from multiple validators based on emission criteria
async def example_8_async_unstake():
    """Asynchronous unstake"""
    import bittensor as bt
    from bittensor_wallet import Keypair
    import time
    
    wallet_name = os.environ.get('BT_WALLET_NAME')
    total_to_unstake = 1.0  # Default
    max_stakes_to_unstake = 10
    unstake_minimum = 0.0005
    
    print(f"🔍 Using wallet: {wallet_name}")
    
    # Use a test keypair instead of requiring real wallet files
    coldkey = Keypair.create_from_uri('//Alice')
    wallet_ck = coldkey.ss58_address
    
    async def perform_unstake(subtensor, wallet, stake, amount):
        print(f"⏳ Would unstake {amount} from {stake.hotkey_ss58} on subnet {stake.netuid}")
        # Commented out to avoid real transactions
        # result = await unstake_extrinsic(subtensor=subtensor, wallet=wallet, hotkey_ss58=stake.hotkey_ss58, netuid=stake.netuid, amount=amount)
        return True  # Simulated success
    
    async with bt.AsyncSubtensor(network='test') as subtensor:
        stakes = await subtensor.get_stake_info_for_coldkey(wallet_ck)
        
        if not stakes:
            print("No stakes found")
            return
        
        stakes = list(filter(lambda s: float(s.stake.tao) > unstake_minimum, stakes))
        stakes = sorted(stakes, key=lambda s: s.emission.tao)
        stakes = stakes[:max_stakes_to_unstake]
        
        print(f"📊 Found {len(stakes)} eligible stakes")
        for s in stakes[:3]:  # Show first 3
            print(f"  {s.hotkey_ss58[:10]}... NetUID: {s.netuid} Stake: {s.stake}")

##########################################################################################################

# Example 9: Demonstrates moving stake from one validator/subnet to another asynchronously
async def example_9_move_stake():
    """Move stake"""
    import bittensor as bt
    from bittensor.core.async_subtensor import AsyncSubtensor
    
    async with AsyncSubtensor(network="test") as subtensor:
        wallet = bt.Wallet()  # Uses env
        amount = bt.Balance.from_tao(1.0).set_unit(5)
        
        print(f"Would move {amount} from netuid 5 to netuid 18")
        # Commented to avoid real transaction
        # result = await move_stake_extrinsic(
        #     subtensor=subtensor,
        #     wallet=wallet,
        #     origin_hotkey="5DyHnV9Wz6cnefGfczeBkQCzHZ5fJcVgy7x1eKVh8otMEd31",
        #     origin_netuid=5,
        #     destination_hotkey="5HidY9Danh9NhNPHL2pfrf97Zboew3v7yz4abuibZszcKEMv",
        #     destination_netuid=18,
        #     amount=amount,
        #     wait_for_inclusion=True,
        #     wait_for_finalization=False,
        # )
        print("Note: Move stake skipped (read-only mode)")

#############################################################################################################

# Example 10: Checks if a hotkey is registered on a specific subnet
def example_10_check_registration():
    """Check registration status"""
    import bittensor as bt
    from bittensor_wallet import Keypair
    
    # Use a test keypair instead of requiring real wallet files
    hotkey = Keypair.create_from_uri('//Alice')
    hotkey_ss58 = hotkey.ss58_address
    network = "test"
    netuid = 1
    sub = bt.Subtensor(network=network)
    mg = sub.metagraph(netuid)
    
    # Find if hotkey is registered
    if hotkey_ss58 in mg.hotkeys:
        uid = mg.hotkeys.index(hotkey_ss58)
        print(f"Miner at uid {uid} registered")
    else:
        print(f"Miner with address {hotkey_ss58[:10]}... not registered on subnet {netuid}")

#######################################################################################################

# Example 11: Retrieves and displays comprehensive metagraph information for a subnet
def example_11_metagraph_info():
    """Metagraph info"""
    from bittensor.core.metagraph import Metagraph
    
    print("Initializing metagraph for subnet 1...")
    metagraph = Metagraph(netuid=1, network="test", sync=True)
    
    # Get basic metagraph metadata
    print("\n=== Basic Metagraph Metadata ===")
    print(f"Network: {metagraph.network}")
    print(f"Subnet UID: {metagraph.netuid}")
    print(f"Total neurons: {metagraph.n.item()}")
    print(f"Current block: {metagraph.block.item()}")
    
    # Get subnet information
    print("\n=== Subnet Information ===")
    print(f"Subnet name: {metagraph.name}")
    print(f"Subnet symbol: {metagraph.symbol}")
    print(f"Max UIDs: {metagraph.max_uids}")
    print(f"Owner: {metagraph.owner_coldkey}")

##################################################################################################

# Example 12: Demonstrates setting subnet hyperparameters as a subnet owner using sudo calls
def example_12_set_hyperparams():
    """Setting hyperparams (as subnet owner)"""
    import bittensor as bt
    from bittensor.core.extrinsics.utils import sudo_call_extrinsic
    
    wallet = bt.Wallet()  # Uses env
    subtensor = bt.Subtensor(network="test")
    
    print(f"Would set liquid_alpha_enabled for subnet 2")
    # Commented to avoid real transaction
    # result = sudo_call_extrinsic(
    #     subtensor=subtensor,
    #     wallet=wallet,
    #     call_function="sudo_set_liquid_alpha_enabled",
    #     call_params={"netuid": 2, "enabled": True},
    #     call_module="AdminUtils",
    #     root_call=True
    # )
    print("Note: Hyperparameter setting skipped (requires subnet ownership)")

####################################################################################################

# Example 13: Shows how to use the SubtensorAPI to query subnet mechanism information
def example_13_subtensor_api():
    """SubtensorAPI usage"""
    import bittensor as bt
    
    sub = bt.SubtensorApi()
    netuid = 2
    
    count = sub.subnets.get_mechanism_count(netuid=netuid)
    split = sub.subnets.get_mechanism_emission_split(netuid=netuid)
    
    print(f"Mechanism count: {count}")
    print(f"Emission split: {split}")
    
    print("Note: set_weights example skipped (requires registration)")

######################################################################################################

# Example 14: Demonstrates parallel fetching of neurons from multiple subnets using asyncio
async def example_14_async_neurons():
    """Asyncio - Fetch neurons from all subnets"""
    import time
    from bittensor.core.async_subtensor import AsyncSubtensor
    
    async with AsyncSubtensor(network="test") as subtensor:
        start = time.time()
        total_subnets = await subtensor.get_total_subnets()
        
        # Limit to first 3 subnets for testing
        test_range = min(total_subnets + 1, 4)
        neurons = await asyncio.gather(*[
            subtensor.neurons(netuid=x)
            for x in range(1, test_range)
        ])
        elapsed = time.time() - start
        
        print(f"Fetched neurons from {len(neurons)} subnets in {elapsed:.2f}s:")
        for netuid, neuron_list in enumerate(neurons, start=1):
            print(f"  Subnet {netuid}: {len(neuron_list) if neuron_list else 0} neurons")

###############################################################################################

# Example 15: Demonstrates direct substrate interface queries to fetch subnet identities
def example_15_substrate_query():
    """Subtensor query examples"""
    from async_substrate_interface import SubstrateInterface
    
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")
    
    netuid = 1
    result = substrate.query('SubtensorModule', 'SubnetIdentitiesV2', [netuid])
    print(f"SubnetIdentitiesV2 query result: {result}")
    
    substrate.close()

###################################################################################################

# Example 16: Demonstrates substrate interface queries using keypairs to fetch Alpha token data
def example_16_substrate_query_keypair():
    """Subtensor query examples (Keypair)"""
    from async_substrate_interface import SubstrateInterface
    from bittensor_wallet import Keypair
    
    substrate = SubstrateInterface(url="wss://test.finney.opentensor.ai:443")
    
    hotkey = Keypair.create_from_uri('//Alice').ss58_address
    coldkey = Keypair.create_from_uri('//Bob').ss58_address
    netuid = 1
    result = substrate.query('SubtensorModule', 'Alpha', [hotkey, coldkey, netuid])
    print(f"Alpha query result: {result}")
    
    substrate.close()

###################################################################################################

def main():
    """Main test runner"""
    print("="*70)
    print("  Bittensor SDK Documentation Examples Test Suite")
    print("="*70)
    print(f"\nConfiguration:")
    print(f"  Wallet: {os.environ.get('BT_WALLET_NAME')}")
    print(f"  Hotkey: {os.environ.get('BT_WALLET_HOTKEY')}")
    print(f"  Network: {os.environ.get('BT_SUBTENSOR_NETWORK')}")
    
    results = []
    
    # Run synchronous examples
    print("\n" + "="*70)
    print("  SYNCHRONOUS EXAMPLES")
    print("="*70)
    
    results.append(run_example("Example 1: Create Axon", example_1_create_axon))
    results.append(run_example("Example 2: Create Wallet", example_2_create_wallet))
    results.append(run_example("Example 3: Check Balance", example_3_check_balance))
    results.append(run_example("Example 4: Exchange Rate", example_4_exchange_rate))
    results.append(run_example("Example 5: Registered Subnets", example_5_registered_subnets))
    results.append(run_example("Example 6: Register Subnet", example_6_register_subnet))
    results.append(run_example("Example 10: Check Registration", example_10_check_registration))
    results.append(run_example("Example 11: Metagraph Info", example_11_metagraph_info))
    results.append(run_example("Example 12: Set Hyperparams", example_12_set_hyperparams))
    results.append(run_example("Example 13: SubtensorAPI", example_13_subtensor_api))
    results.append(run_example("Example 15: Substrate Query", example_15_substrate_query))
    results.append(run_example("Example 16: Substrate Query Keypair", example_16_substrate_query_keypair))
    
    # Run asynchronous examples
    print("\n" + "="*70)
    print("  ASYNCHRONOUS EXAMPLES")
    print("="*70)
    
    async def run_async_examples():
        async_results = []
        async_results.append(await run_async_example("Example 7: Async Stake", example_7_async_stake))
        async_results.append(await run_async_example("Example 8: Async Unstake", example_8_async_unstake))
        async_results.append(await run_async_example("Example 9: Move Stake", example_9_move_stake))
        async_results.append(await run_async_example("Example 14: Async Neurons", example_14_async_neurons))
        return async_results
    
    async_results = asyncio.run(run_async_examples())
    results.extend(async_results)
    
    # Print summary
    print("\n" + "="*70)
    print("  SUMMARY")
    print("="*70)
    passed = sum(results)
    total = len(results)
    print(f"Passed: {passed}/{total}")
    print(f"Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n✅ All examples completed successfully!")
        return 0
    else:
        print(f"\n⚠️ {total - passed} example(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
