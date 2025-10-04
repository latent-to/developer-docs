/* 
BITENSOR RATE LIMITS CHECKER
===========================
This script programmatically discovers and queries all rate limit parameters 
from the Bittensor blockchain by leveraging the Polkadot API metadata.

INSTALLATION STEPS
==================
1. Install Node.js from https://nodejs.org/en/download/
2. Install the following packages:
   npm install @polkadot/api prompt-sync
3. Run the script using: node check-rate-limits.js

FEATURES
=========
- Automatic discovery of all rate-limiting storage methods
- Programmatic querying without hardcoded method names
- Support for multiple networks (finney, local)
- Intelligent parameter detection (tries no params, then subnet 1)

Written by AI Assistant  
Version: 2.0.0 - Streamlined Discovery Version
*/

const { ApiPromise, WsProvider } = require("@polkadot/api");
const prompt = require("prompt-sync")();

// Network configuration
let network = "";
let networkEntryPoint = "";

// Default network selection
if (network === "") {
  try {
    network = prompt("Enter network (finney, local): ");
  } catch (error) {
    // If prompt fails (no terminal), default to finney
    console.log("No terminal available, defaulting to finney network");
    network = "finney";
  }
}

// Set network endpoint
switch (network.toLowerCase()) {
  case "finney":
  case "f":
    networkEntryPoint = "wss://entrypoint-finney.opentensor.ai:443";
    break;
  case "local":
  case "l":
    try {
      networkEntryPoint = prompt("Enter local network WSS address (e.g., ws://127.0.0.1:443): ");
    } catch (error) {
      console.log("No terminal available, using default local address");
      networkEntryPoint = "ws://127.0.0.1:443";
    }
    break;
  default:
    console.log("Invalid network. Defaulting to finney.");
    networkEntryPoint = "wss://entrypoint-finney.opentensor.ai:443";
}

async function discoverAndQueryRateLimits() {
  try {
    console.log(`\nConnecting to Bittensor network: ${networkEntryPoint}`);
    const wsProvider = new WsProvider(networkEntryPoint);
    const api = await ApiPromise.create({ provider: wsProvider });

    console.log("✓ Connected to Bittensor network successfully!\n");

    // Get current block for context
    const currentBlock = await api.query.system.number();
    const currentBlockNumber = currentBlock.toNumber();
    const blockTimeSeconds = 12; // Bittensor blocks are ~12 seconds

    console.log("=".repeat(80));
    console.log("BITENSOR RATE LIMITS DISCOVERY REPORT");
    console.log("=".repeat(80));
    console.log(`Current Block: ${currentBlockNumber}`);
    console.log(`Block Time: ~${blockTimeSeconds} seconds`);
    console.log(`Connection: ${networkEntryPoint}\n`);

    // Get all storage functions from the subtensor module
    const subtensorModule = api.query.subtensorModule;
    const storageKeys = Object.keys(subtensorModule);
    
    // Find methods that might be rate limits using comprehensive keywords
    const rateLimitKeywords = [
      'limit', 'rate', 'period', 'delay', 'cooldown', 'interval', 
      'freeze', 'pause', 'gap', 'timeout', 'restriction', 'throttle'
    ];
    
    const potentialRateLimits = storageKeys.filter(key => 
      rateLimitKeywords.some(keyword => key.toLowerCase().includes(keyword))
    );

    console.log(`Discovered ${potentialRateLimits.length} storage methods with rate-limiting characteristics:`);
    console.log("=".repeat(80));

    // Categorize and test each potential rate limit
    const categories = {
      global: [],
      subnetSpecific: [],
      operationalCounters: [],
      administrative: []
    };

    for (const method of potentialRateLimits) {
      try {
        const queryFn = subtensorModule[method];
        if (typeof queryFn === 'function') {
          let category = 'other';
          let testResult = null;
          let requiresNetuid = false;

          // Try to call it without parameters first
          try {
            testResult = await queryFn();
            category = 'global';
            categories.global.push({ method, result: testResult, requiresNetuid: false });
          } catch (paramError) {
            // If it fails without params, try with a sample subnet (netuid = 1)
            try {
              testResult = await queryFn(1);
              requiresNetuid = true;
              category = 'subnetSpecific';
              categories.subnetSpecific.push({ method, result: testResult, requiresNetuid: true });
            } catch (sampleError) {
              category = 'failed';
            }
          }

          // Determine category based on method name
          if (method.toLowerCase().includes('registration') || 
              method.toLowerCase().includes('interval')) {
            category = 'operationalCounters';
            if (!categories.operationalCounters.some(item => item.method === method)) {
              categories.operationalCounters.push({ method, result: testResult, requiresNetuid });
            }
          } else if (method.toLowerCase().includes('admin') || 
                     method.toLowerCase().includes('owner') ||
                     method.toLowerCase().includes('freeze')) {
            category = 'administrative';
            if (!categories.administrative.some(item => item.method === method)) {
              categories.administrative.push({ method, result: testResult, requiresNetuid });
            }
          }

        }
      } catch (error) {
        // Skip silently for failed queries
      }
    }

    // Display categorized results
    displayCategoryResults('GLOBAL RATE LIMITS', categories.global, blockTimeSeconds);
    displayCategoryResults('SUBNET-SPECIFIC RATE LIMITS', categories.subnetSpecific, blockTimeSeconds);
    displayCategoryResults('OPERATIONAL COUNTERS & INTERVALS', categories.operationalCounters, blockTimeSeconds);
    displayCategoryResults('ADMINISTRATIVE CONTROLS', categories.administrative, blockTimeSeconds);

    // Staking operation lock information
    console.log("=".repeat(80));
    console.log("STAKING OPERATION LOCK SYSTEM");
    console.log("=".repeat(80));
    console.log("- Per-block locking system for (hotkey, coldkey, subnet) combinations");
    console.log("- Adding stake SETS the lock but allows unlimited additions");
    console.log("- Removing/transferring requires waiting until next block");
    console.log("- Provides MEV protection against sandwich/arbitrage attacks");
    console.log("- All locks reset automatically at block finalization (~12 seconds)");
    console.log("\n✓ Rate limit discovery completed successfully!");

  } catch (error) {
    console.error("Error occurred while discovering rate limits:");
    console.error(error.message);
    if (error.message.includes("connect")) {
      console.error("Make sure you're connected to the internet and the network endpoint is correct.");
    }
    process.exit(1);
  }
}

function displayCategoryResults(title, items, blockTimeSeconds) {
  if (items.length === 0) return;
  
  console.log("\n" + title);
  console.log("-".repeat(80));
  
  for (const item of items) {
    const { method, result, requiresNetuid } = item;
    
    if (!result) {
      console.log(`${method}: Unable to query`);
      continue;
    }
    
    console.log(`\n${method}:`);
    
    if (result.toNumber) {
      const blockValue = result.toNumber();
      const hours = Math.round(blockValue * blockTimeSeconds / 3600 * 10) / 10;
      const days = Math.round(blockValue * blockTimeSeconds / 86400 * 10) / 10;
      
      console.log(`  Value: ${blockValue} blocks`);
      console.log(`  Time: ~${hours} hours (${days} days)`);
      console.log(`  ${requiresNetuid ? 'Subnet-specific' : 'Global'}`);
      
      // Add interpretation based on method name
      const interpretation = getRateLimitInterpretation(method);
      if (interpretation) {
        console.log(`  Purpose: ${interpretation}`);
      }
    } else {
      console.log(`  Complex object result`);
      console.log(`  ${requiresNetuid ? 'Subnet-specific' : 'Global'}`);
    }
  }
}

function getRateLimitInterpretation(methodName) {
  const interpretations = {
    'txRateLimit': 'General transaction cooldown (hotkey swaps, child relationships)',
    'txDelegateTakeRateLimit': 'Delegate take increase frequency control',
    'txChildkeyTakeRateLimit': 'Childkey take modification frequency control',
    'networkRateLimit': 'Subnet registration frequency control',
    'weightsSetRateLimit': 'Validator weight setting frequency',
    'servingRateLimit': 'Serving operation frequency limit',
    'adjustmentInterval': 'Time between subnet adjustment periods',
    'immunityPeriod': 'Protection period for new registrations',
    'ownerHyperparamRateLimit': 'Subnet owner hyperparameter change frequency',
    'weightsVersionKeyRateLimit': 'Weights version key update frequency',
    'pendingChildKeyCooldown': 'Cooldown delays for child key operations',
    'networkImmunityPeriod': 'Network-wide immunity protection period',
    'networkLockReductionInterval': 'Interval for network lock cost reductions',
    'subnetLimit': 'Maximum number of subnets allowed'
  };
  
  return interpretations[methodName] || null;
}

// Run the script
discoverAndQueryRateLimits()
  .catch(console.error);

// Suppress warning messages
console.warn = () => {};
