"""
Query on-chain conviction parameters from a live subtensor node.
Run after mainnet deploy to get actual values for the docs.

Usage:
    source bittensor/venv/bin/activate
    python developer-docs/tmp-scripts/query_conviction_params.py

Defaults to finney (mainnet). Pass --network test for testnet.
"""

import argparse
from substrateinterface import SubstrateInterface

NETWORKS = {
    "finney": "wss://entrypoint-finney.opentensor.ai:443",
    "test":   "wss://test.finney.opentensor.ai:443",
}

BLOCKS_PER_DAY = 7200

def blocks_to_days(blocks: int) -> float:
    return blocks / BLOCKS_PER_DAY

def tau_to_90pct_days(tau_blocks: int) -> float:
    """
    90% conviction reached at 2.303 * tau (solving 1 - exp(-t/tau) = 0.9).
    Only valid for perpetual lock mode.
    """
    import math
    return math.log(10) * blocks_to_days(tau_blocks)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--network", default="finney", choices=NETWORKS.keys())
    args = parser.parse_args()

    url = NETWORKS[args.network]
    print(f"Connecting to {args.network}: {url}")

    substrate = SubstrateInterface(url=url)

    maturity_rate = substrate.query(
        module="SubtensorModule",
        storage_function="MaturityRate",
    ).value

    unlock_rate = substrate.query(
        module="SubtensorModule",
        storage_function="UnlockRate",
    ).value

    print()
    print("=== Conviction Parameters (on-chain) ===")
    print()
    print(f"MaturityRate (conviction growth τ):")
    print(f"  {maturity_rate:,} blocks")
    print(f"  ≈ {blocks_to_days(maturity_rate):.1f} days")
    print(f"  → 63.2% conviction at 1τ ({blocks_to_days(maturity_rate):.1f} days)")
    print(f"  → 90% conviction at 2.3τ ({tau_to_90pct_days(maturity_rate):.1f} days) [perpetual mode]")
    print()
    print(f"UnlockRate (locked mass decay τ, decaying mode):")
    print(f"  {unlock_rate:,} blocks")
    print(f"  ≈ {blocks_to_days(unlock_rate):.1f} days")
    print(f"  → 50% of locked mass remains after {blocks_to_days(int(unlock_rate * 0.6931)):.1f} days (half-life)")
    print(f"  → 63.2% of locked mass decayed at 1τ ({blocks_to_days(unlock_rate):.1f} days)")
    print()
    print("=== Use these values in the docs ===")

if __name__ == "__main__":
    main()
