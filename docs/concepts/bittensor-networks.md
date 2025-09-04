---
title: "Bittensor Networks"
---

# Bittensor Networks

The below table presents Bittensor networks and a few details:

| DESCRIPTION                   | MAINNET                                     | TESTNET                                                    | LOCALNET                                                                                                             |
| :---------------------------- | :------------------------------------------ | :--------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Chain URL**                 | wss://entrypoint-finney.opentensor.ai:443   | wss://test.finney.opentensor.ai:443                        | ws://127.0.0.1:9944                                                                                                  |
| **Example Usage**             | `btcli wallet swap_hotkey --network finney` | `btcli wallet swap_hotkey --network test`                  | `btcli wallet swap_hotkey --network local`                                                                           |
| **Block processing**          | One block every 12 seconds                  | One block every 12 seconds                                 | One block every 0.25s seconds in fast blocks mode and one block every 12s in non-fast blocks mode.                   |
| **Mainnet Archive**           | wss://archive.chain.opentensor.ai:443       | None                                                       | None                                                                                                                 |
| **Mainnet Lite**              | wss://lite.chain.opentensor.ai:443          | None                                                       | None                                                                                                                 |
| **Experimental Mainnet Lite** | wss://lite.finney.test.opentensor.ai:443    | None                                                       | None                                                                                                                 |
| **Network Purpose**           | Transactions with financial value           | Test transactions with no value, constrained by tokenomics | Development and testing in fully user-controlled environment                                                         |
| **Test TAO**                  | None                                        | Available on request (not compatible with devnet test TAO) | Available in Alice wallet. See [Access the Alice account](../local-build/provision-wallets#access-the-alice-account). |
