"""
Check finney chain metadata for neuron-registration-related storage items.

Goal: determine whether the PR #2382 neuron registration rework has shipped
to finney, by looking for BurnHalfLife / BurnIncreaseMult in chain metadata.
"""
from async_substrate_interface import SubstrateInterface


def main():
    s = SubstrateInterface(url="wss://entrypoint-finney.opentensor.ai:443")
    try:
        rv = s.runtime_version
        print(f"runtime_version: {rv}")
        meta = s.get_metadata()
        # MetadataV15 exposes .pallets as a list
        pallets = {p.name: p for p in meta.pallets}
        sm = pallets.get("SubtensorModule")
        if sm is None:
            print("SubtensorModule not found")
            return
        # storage entries
        entries = sm.storage.entries if sm.storage else []
        names = sorted([e.name for e in entries])
        keywords = ["burn", "adjust", "difficulty", "registration", "pow"]
        print("\n-- matching storage items --")
        for n in names:
            lo = n.lower()
            if any(k in lo for k in keywords):
                print(f"  {n}")
        print("\n-- looking specifically for new items --")
        for target in ["BurnHalfLife", "BurnIncreaseMult", "NetworkBurn", "RegistrationBurn"]:
            found = target in names
            print(f"  {target}: {'YES' if found else 'no'}")
    finally:
        try:
            s.close()
        except Exception:
            pass


if __name__ == "__main__":
    main()
