/* 
SIMPLE BITENSOR RATE LIMITS CHECKER
===================================
Queries the specific rate limit state variables mentioned in the documentation.

Usage: node simple-rate-limits.js
*/

const { ApiPromise, WsProvider } = require("@polkadot/api");

async function checkRateLimits() {
  try {
    console.log("Connecting to Bittensor network...");
    const wsProvider = new WsProvider(
      "wss://entrypoint-finney.opentensor.ai:443"
    );
    const api = await ApiPromise.create({ provider: wsProvider });

    console.log("✓ Connected successfully!\n");

    const blockTimeSeconds = 12; // Bittensor blocks are ~12 seconds

    // Global rate limits
    console.log("GLOBAL RATE LIMITS:");
    console.log("==================");

    try {
      const txRateLimit = await api.query.subtensorModule.txRateLimit();
      console.log(
        `TxRateLimit: ${txRateLimit.toNumber()} blocks (~${
          Math.round(
            ((txRateLimit.toNumber() * blockTimeSeconds) / 3600) * 10
          ) / 10
        }h)`
      );
    } catch (e) {
      console.log("TxRateLimit: Unable to query");
    }

    try {
      const txDelegateTakeRateLimit =
        await api.query.subtensorModule.txDelegateTakeRateLimit();
      console.log(
        `TxDelegateTakeRateLimit: ${txDelegateTakeRateLimit.toNumber()} blocks (~${
          Math.round(
            ((txDelegateTakeRateLimit.toNumber() * blockTimeSeconds) / 3600) *
              10
          ) / 10
        }h)`
      );
    } catch (e) {
      console.log("TxDelegateTakeRateLimit: Unable to query");
    }

    try {
      const txChildkeyTakeRateLimit =
        await api.query.subtensorModule.txChildkeyTakeRateLimit();
      console.log(
        `TxChildkeyTakeRateLimit: ${txChildkeyTakeRateLimit.toNumber()} blocks (~${
          Math.round(
            ((txChildkeyTakeRateLimit.toNumber() * blockTimeSeconds) / 3600) *
              10
          ) / 10
        }h)`
      );
    } catch (e) {
      console.log("TxChildkeyTakeRateLimit: Unable to query");
    }

    try {
      const networkRateLimit =
        await api.query.subtensorModule.networkRateLimit();
      console.log(
        `NetworkRateLimit: ${networkRateLimit.toNumber()} blocks (~${
          Math.round(
            ((networkRateLimit.toNumber() * blockTimeSeconds) / 3600) * 10
          ) / 10
        }h)`
      );
    } catch (e) {
      console.log("NetworkRateLimit: Unable to query");
    }

    try {
      const ownerHyperparamRateLimit =
        await api.query.subtensorModule.ownerHyperparamRateLimit();
      console.log(
        `OwnerHyperparamRateLimit: ${ownerHyperparamRateLimit.toNumber()} tempos`
      );
    } catch (e) {
      console.log("OwnerHyperparamRateLimit: Unable to query");
    }

    try {
      const weightsVersionKeyRateLimit =
        await api.query.subtensorModule.weightsVersionKeyRateLimit();
      console.log(
        `WeightsVersionKeyRateLimit: ${weightsVersionKeyRateLimit.toNumber()} blocks (~${
          Math.round(
            ((weightsVersionKeyRateLimit.toNumber() * blockTimeSeconds) /
              3600) *
              10
          ) / 10
        }h)`
      );
    } catch (e) {
      console.log("WeightsVersionKeyRateLimit: Unable to query");
    }

    try {
      const adminFreezeWindow =
        await api.query.subtensorModule.adminFreezeWindow();
      console.log(
        `AdminFreezeWindow: ${adminFreezeWindow.toNumber()} blocks (~${
          Math.round(
            ((adminFreezeWindow.toNumber() * blockTimeSeconds) / 3600) * 10
          ) / 10
        }h)`
      );
    } catch (e) {
      console.log("AdminFreezeWindow: Unable to query");
    }

    // Subnet-specific rate limits (check subnet 1 as example)
    console.log("\nSUBNET-SPECIFIC RATE LIMITS (Subnet 1):");
    console.log("=======================================");

    try {
      const servingRateLimit = await api.query.subtensorModule.servingRateLimit(
        1
      );
      console.log(
        `ServingRateLimit: ${servingRateLimit.toNumber()} blocks (~${
          Math.round(
            ((servingRateLimit.toNumber() * blockTimeSeconds) / 3600) * 10
          ) / 10
        }h)`
      );
    } catch (e) {
      console.log("ServingRateLimit: Unable to query");
    }

    try {
      const adjustmentInterval =
        await api.query.subtensorModule.adjustmentInterval(1);
      console.log(
        `AdjustmentInterval: ${adjustmentInterval.toNumber()} blocks (~${
          Math.round(
            ((adjustmentInterval.toNumber() * blockTimeSeconds) / 3600) * 10
          ) / 10
        }h)`
      );
    } catch (e) {
      console.log("AdjustmentInterval: Unable to query");
    }

    try {
      const immunityPeriod = await api.query.subtensorModule.immunityPeriod(1);
      console.log(
        `ImmunityPeriod: ${immunityPeriod.toNumber()} blocks (~${
          Math.round(
            ((immunityPeriod.toNumber() * blockTimeSeconds) / 3600) * 10
          ) / 10
        }h)`
      );
    } catch (e) {
      console.log("ImmunityPeriod: Unable to query");
    }

    try {
      const weightsSetRateLimit =
        await api.query.subtensorModule.weightsSetRateLimit(1);
      console.log(
        `WeightsSetRateLimit: ${weightsSetRateLimit.toNumber()} blocks (~${
          Math.round(
            ((weightsSetRateLimit.toNumber() * blockTimeSeconds) / 3600) * 10
          ) / 10
        }h)`
      );
    } catch (e) {
      console.log("WeightsSetRateLimit: Unable to query");
    }

    try {
      const maxRegistrationsPerBlock =
        await api.query.subtensorModule.maxRegistrationsPerBlock(1);
      console.log(
        `MaxRegistrationsPerBlock: ${maxRegistrationsPerBlock.toNumber()} registrations`
      );
    } catch (e) {
      console.log("MaxRegistrationsPerBlock: Unable to query");
    }

    try {
      const targetRegistrationsPerInterval =
        await api.query.subtensorModule.targetRegistrationsPerInterval(1);
      console.log(
        `TargetRegistrationsPerInterval: ${targetRegistrationsPerInterval.toNumber()} registrations`
      );
    } catch (e) {
      console.log("TargetRegistrationsPerInterval: Unable to query");
    }

    console.log("\n✓ Complete");

    await api.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Run the script
checkRateLimits().catch(console.error);

// Suppress warning messages
console.warn = () => {};
