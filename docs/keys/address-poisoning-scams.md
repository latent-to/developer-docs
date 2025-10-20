---
title: "Address Poisoning Scams: Protect Your Wallet"
---

import { SecurityWarning } from "../keys/_security-warning.mdx";

# Address Poisoning Scams: Protect Your Wallet

Address poisoning is one of the most successful cryptocurrency scams, with over $83 million stolen from more than 6,600 victims on Ethereum and Binance Smart Chain alone. Because Bittensor wallets have a similar vulnerability, users of Bittensor wallets should understand how to protect themselves.

<SecurityWarning />

## What is Address Poisoning?

Address poisoning exploits a simple human weakness: long wallet addresses are hard to read.

Here's how the scam works:

1. You make a transaction to a legitimate address (like `0x3b75...2712a`)
2. An attacker generates a fake address that looks very similar (like `0x3b75...2712b` or `0x3b74...2712a`)
   - They do this by brute-force generating millions of private keys and checking for matches with target addresses
   - When they find one that matches the first and last characters of a target's address, they keep it
   - This is computationally expensive but profitable - it's called "vanity address generation"
3. Within minutes—often less than 20 minutes—the scammer "poisons" your transaction history by sending you a tiny amount (or even zero) of tokens from their fake address
4. Later, when you're in a hurry, you copy an address from your recent transactions or wallet history
5. You accidentally send funds to the scammer's lookalike address instead of your intended recipient

The transactions are irreversible. Your funds are gone.


## What Makes Bittensor Vulnerable?

Bittensor uses the Substrate blockchain framework, which, like Ethereum, represents addresses as long hexadecimal strings. This makes Bittensor wallets vulnerable to the same address poisoning tactics as most other blockchains.

Both Substrate and Ethereum derive addresses from private keys using similar cryptographic processes:
- **Private key** (random) → **Public key** (via elliptic curve) → **Address** (via hashing)

You can't choose an address directly, but attackers can **brute-force generate millions of key pairs** until they find an address that matches the target pattern. This is computationally expensive but absolutely possible:
- Matching 7 characters: achievable with a laptop CPU
- Matching 14 characters: requires dedicated computing
- Matching 20 characters: requires GPU clusters (some attackers use these!)

[Research](#research-source) found that one attack group spent an estimated \$1.7 million on computing to generate their lookalike addresses, but made \$4 million in profit.

Whether you're:
- Transferring TAO
- Managing stake
- Delegating to validators
- Sending funds to a coldkey

## The Economics: Why This Scam Is So Prevalent

[Research](#research-source) shows address poisoning is a highly profitable criminal enterprise:

- Low success rate, high volume: Only 0.01% of poisoning attempts succeed, but scammers compensate by attacking millions of victims
- Organized crime: The largest attack groups have made $26+ million in profit over two years
- Cheap to execute: Each poisoning attempt costs only about \$1 on Ethereum and $0.01 on BSC
- Sophisticated operations: Some groups use GPU computing to generate extremely convincing lookalike addresses with 20 matching characters

One successful attack of $20,000 pays for 20,000 failed attempts. The math works in favor of the scammers.

## Who's Most at Risk?

[Research](#research-source) shows that scammers don't attack randomly. They specifically target users who:

- Have high balances: Victims targeted had significantly more funds than average users
- Are very active: Users making frequent transactions are attacked more often
- Make large transfers: The bigger your typical transaction, the more likely you are to be targeted
- Use centralized exchanges: Many attackers generate fake addresses mimicking exchange deposit addresses


## How to Protect Yourself

Address poisoning succeeds because of one thing: inattention during routine tasks.

The best defense is simple but requires discipline:
- Slow down when sending transactions
- Verify addresses completely before clicking send
- Use an address book instead of transaction history
- Trust your caution, not your convenience

Five extra seconds of verification can save you thousands of dollars. These aren't random attacks. If you're an active user with significant holdings, you're likely being targeted right now. Your transaction history may already be poisoned.

### 1. Always Double-Check the Full Address

Before sending any transaction:
- Expand and read the complete address, not just the abbreviated version
- Check the beginning AND the end—scammers match both
- If possible, verify the address through a second channel (message the recipient, check a saved note, etc.)

### 2. Use an Address Book

- Maintain a saved list of trusted addresses with clear labels
- Never select addresses from your transaction history—always use your saved address book
- Most wallet applications support address books or contact lists

### 3. Be Suspicious of Unexpected Transfers

Scammers exist, so do not give unknown parties "the benefit of the doubt." If you receive unexpected transfers for very small amounts ("dust"), they are likely attempts to seed your transaction history for address poisoning.

### 4. Send a Test Transaction First

For large transfers:
- Send a very small amount first
- Verify the recipient received it
- Then send the full amount

This two-step process can save you from a costly mistake.

### 5. Use Wallet Apps with Protection Features

Some wallet applications and blockchain scanners now flag suspicious addresses or hide poisoning attempts. Keep your wallet software updated.

The [TAO.app](https://www.tao.app) UI includes a warning for addresses flagged as suspicious.

### 6. Never Rush Important Transactions

Scammers count on you being in a hurry. If you're tired, distracted, or rushing your procedures, consider taking a break before conducting irreversible blockchain transactions. The blockchain will still be there in an hour. Your funds won't be if you make a mistake.


## Learn More

Your private key is your identity in cryptocurrency. One careless transaction can mean permanent, irreversible loss. Always verify. Always double-check.

Further reading:

- [Wallets, Coldkeys and Hotkeys in Bittensor](../keys/wallets.md)
- [Working with Keys](../keys/working-with-keys.md)
- [Coldkey and Hotkey Workstation Security](../keys/coldkey-hotkey-security.md)

### Research Source

This guide is based on the largest study of this scam to date: Tsuchiya, T., Dong, J.-D., Soska, K., & Christin, N. (2025). "Blockchain Address Poisoning," in *Proceedings of the 34th USENIX Security Symposium*. Seattle, WA, USA. [https://www.usenix.org/conference/usenixsecurity25/presentation/tsuchiya](https://www.usenix.org/conference/usenixsecurity25/presentation/tsuchiya)

