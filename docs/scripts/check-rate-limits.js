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
      'freeze', 'pause', 'gap', 'timeout', 'restriction', 'throttle',
      'last', 'target', 'max', 'min', 'registration', 'commit', 'burn'
    ];
    
    const potentialRateLimits = storageKeys.filter(key => 
      rateLimitKeywords.some(keyword => key.toLowerCase().includes(keyword))
    );

    console.log(`Found ${potentialRateLimits.length} potential rate limit methods\n`);

    // Categorize and test each potential rate limit
    const categories = {
      global: [],
      subnetSpecific: [],
      operationalCounters: [],
      administrative: [],
      complex: [],
      failed: []
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
              // Some methods need specific account/transaction IDs - try with different parameters
              try {
                // Try with example account address
                const exampleAccount = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
                await queryFn(exampleAccount);
                // Skip verbose output for complex methods
                category = 'complex';
                categories.complex.push({ method, error: sampleError.message, requiresAccount: true });
              } catch (accountError) {
                // Skip verbose output for failed methods
                category = 'failed';
                categories.failed.push({ method, error: sampleError.message });
              }
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

    // Display results
    displayResults('GLOBAL RATE LIMITS', categories.global, blockTimeSeconds);
    displayResults('SUBNET-SPECIFIC RATE LIMITS', categories.subnetSpecific, blockTimeSeconds);
    displayResults('OPERATIONAL COUNTERS & INTERVALS', categories.operationalCounters, blockTimeSeconds);
    displayResults('ADMINISTRATIVE CONTROLS', categories.administrative, blockTimeSeconds);
    
    if (categories.complex.length > 0) {
      console.log("\nCOMPLEX METHODS:");
      for (const item of categories.complex) {
        console.log(`  ${item.method}`);
      }
    }
    
    if (categories.failed.length > 0) {
      console.log("\nFAILED QUERIES:");
      for (const item of categories.failed) {
        console.log(`  ${item.method}`);
      }
    }

    console.log("\n✓ Complete");

  } catch (error) {
    console.error("Error occurred while discovering rate limits:");
    console.error(error.message);
    if (error.message.includes("connect")) {
      console.error("Make sure you're connected to the internet and the network endpoint is correct.");
    }
    process.exit(1);
  }
}

function displayResults(title, items, blockTimeSeconds) {
  if (items.length === 0) return;
  
  console.log(`\n${title}:`);
  
  for (const item of items) {
    const { method, result, requiresNetuid } = item;
    
    if (!result) {
      console.log(`  ${method}: Unable to query`);
      continue;
    }
    
    try {
      if (result.toNumber) {
        const value = result.toNumber();
        const scope = requiresNetuid ? '[subnet]' : '[global]';
        
        // Determine if this is a time-based rate limit or a count/limit
        const timeBasedMethods = [
          'txRateLimit', 'txDelegateTakeRateLimit', 'txChildkeyTakeRateLimit',
          'networkRateLimit', 'weightsVersionKeyRateLimit', 'adminFreezeWindow',
          'servingRateLimit', 'adjustmentInterval', 'immunityPeriod',
          'weightsSetRateLimit', 'pendingChildKeyCooldown', 'networkImmunityPeriod',
          'networkLockReductionInterval', 'minActivityCutoff'
        ];
        
        const tempoBasedMethods = ['ownerHyperparamRateLimit'];
        
        if (tempoBasedMethods.includes(method)) {
          console.log(`  ${method}: ${value} tempos ${scope}`);
        } else if (timeBasedMethods.includes(method)) {
          const hours = Math.round(value * blockTimeSeconds / 3600 * 10) / 10;
          const days = Math.round(value * blockTimeSeconds / 86400 * 10) / 10;
          console.log(`  ${method}: ${value} blocks (~${hours}h, ${days}d) ${scope}`);
        } else {
          // For counts, limits, and other non-time values
          console.log(`  ${method}: ${value} ${scope}`);
        }
      } else {
        const scope = requiresNetuid ? '[subnet]' : '[global]';
        console.log(`  ${method}: ${result.toString()} ${scope}`);
      }
    } catch (numberError) {
      const scope = requiresNetuid ? '[subnet]' : '[global]';
      console.log(`  ${method}: Large number ${scope}`);
    }
  }
}


// Run the script
discoverAndQueryRateLimits()
  .catch(console.error);

// Suppress warning messages
console.warn = () => {};
