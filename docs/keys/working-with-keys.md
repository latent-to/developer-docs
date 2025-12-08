---
title: "Creating/Importing a Bittensor Wallet"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { SdkVersion } from "../sdk/_sdk-version.mdx";

# Creating/Importing a Bittensor Wallet

In Bittensor (like other cryptocurrency applications), a _wallet_ is a tool for proving your identity, signing transactions, accessing your TAO, and managing your stake in subnets.

This page describes several different ways to instantiate your wallet keypairs into a wallet application, in order to interact with the Bittensor blockchain.

Recommended background reading:

- For an introduction to the core concepts, see [wallets and keys in Bittensor](./wallets.md).

- For discussion of security considerations about working with Bittensor wallets, see [Coldkey and Hotkey Workstation Security](./coldkey-hotkey-security).

:::tip Protect your seed phrase
The most critical operational goal when handling Bittensor wallets is to avoid losing or leaking your seed phrase. Make sure you [Handle your Seed Phrase/Mnemonic Securely](./handle-seed-phrase).
:::

:::tip Use proxies for regular operations
Once you've created your wallet, consider setting up **proxy wallets** for any operations you'll perform regularly. Proxies let you keep your coldkey in secure cold storage while still managing stake, making transfers, or performing other operations through a less-privileged proxy account.

See [Proxies: Overview](./proxies/index.md) to learn more.
:::

## Creating a wallet with `btcli`

<Tabs queryString="create-wallet" groupId="create-wallet">
<TabItem value="cold-hot" label="Coldkey and Hotkey">
If you intend to mine or validate within a subnet, or create and manage a subnet, you’ll need both a coldkey and a hotkey. If you already have a coldkey, you can [create a new hotkey](?create-wallet=hotkey) for it.

To create a new coldkey and hotkey, run the following command in the terminal:

```bash
btcli wallet create --wallet.name <my_coldkey> --wallet.hotkey <my_hotkey>
```

:::info
Use the below command to generate the hotkey. Replace `<my_coldkey>` with the name of the coldkey generated above, and `<my_hotkey>` with a name for your hotkey.

For example,

```bash
btcli wallet create --wallet.name test-coldkey --wallet.hotkey test-hotkey
```

:::

Next, you will be prompted to configure the wallet by setting a password for the coldkey, and choosing the desired mnemonic length. Completing the prompts creates a complete Bittensor wallet by setting up both coldkey and hotkeys. A unique mnemonic is generated for each key and output to the terminal upon creation.

:::tip Regenerating the wallet keys
Take note of the mnemonics in the response as they are required to regenerate your coldkey and hotkey. To regenerate your coldkey, run the following command in the terminal:

```sh
btcli wallet regen_coldkey --mnemonic "word1 word2 ... word12"
```

Similarly, run the following command in the terminal to regenerate your hotkey:

```sh
btcli wallet regen_hotkey --mnemonic "word1 word2 ... word12"
```

:::

</TabItem>
<TabItem value="coldkey" label="Coldkey only">
If a user does not intend to mine, validate, manage subnets, or participate in governance, a hotkey is not required. In such cases, a coldkey-only wallet is recommended for simplicity.

Run the following command to create a coldkey-only wallet:

```bash
btcli wallet new_coldkey --wallet.name <my_coldkey>
```

For example,

```bash
btcli wallet new_coldkey --wallet.name test-coldkey
```

You will see the terminal output like the following, which includes your all-important seed phrase, a.k.a. the _mnemonic_ to the coldkey.

```text
IMPORTANT: Store this mnemonic in a secure (preferable offline place), as anyone who has possession of this mnemonic can use it to regenerate the key and access your tokens.

The mnemonic to the new hotkey is: **** *** **** **** ***** **** *** **** **** **** ***** *****
You can use the mnemonic to recreate the key in case it gets lost.
```

:::tip Regenerating the coldkey
Take note of the mnemonic in the response as it is required to regenerate your coldkey. To regenerate your coldkey, run the following command in the terminal:

```sh
btcli wallet regen_coldkey --mnemonic "word1 word2 ... word12"
```

:::

</TabItem>
<TabItem value="hotkey" label="Hotkey only">
If you plan to validate or mine in a subnet, you must create both a coldkey and a hotkey. A hotkey is also required when creating and managing subnets.

Before creating a hotkey, you must have created a coldkey as described in the [creating a coldkey tab](?create-wallet=coldkey). Next, provide this coldkey as a parameter to generate a hotkey. This will pair the hotkey with the coldkey as shown:

```bash
btcli wallet new_hotkey --wallet.name <my_coldkey> --wallet.hotkey <my_hotkey>
```

:::info
Use the below command to generate the hotkey. Replace `<my_coldkey>` with the name of the coldkey generated above, and `<my_hotkey>` with a name for your hotkey.

For example,

```bash
btcli wallet new_hotkey --wallet.name test-coldkey --wallet.hotkey test-hotkey
```

:::

You will see the terminal log like below. The mnemonic is hidden for security reasons.

```text
IMPORTANT: Store this mnemonic in a secure (preferably offline place), as anyone who has possession of this mnemonic can use it to regenerate the key and access your tokens.
The mnemonic to the new hotkey is:
**** *** **** **** ***** **** *** **** **** **** ***** *****
You can use the mnemonic to recreate the key in case it gets lost.
```

:::tip Regenerating the hotkey
Take note of the mnemonic in the response as it is required to regenerate your hotkey. To regenerate your hotkey, run the following command in the terminal:

```sh
btcli wallet regen_hotkey --mnemonic "word1 word2 ... word12"
```

:::

</TabItem>
</Tabs>

---

### Encrypting the hotkey

By default, a hotkey is not encrypted on the device, whereas the coldkey is encrypted. To encrypt your hotkey, include the `--use-password` in the hotkey creation command as shown:

```bash
btcli wallet new_hotkey --use-password --wallet.name test-coldkey --wallet.hotkey test-hotkey
```

## Creating a wallet using Python

<SdkVersion />

<Tabs queryString="create-wallet" groupId="create-wallet">
<TabItem value="cold-hot" label="Coldkey and Hotkey">
If you intend to mine or validate within a subnet, or create and manage a subnet, you’ll need both a coldkey and a hotkey. If you already have a coldkey, you can [create a new hotkey](?create-wallet=hotkey) for it.

To create a wallet with Python, copy and paste the following three lines into your Python interpreter. Replace the string values for `name` (`my_coldkey`) and `hotkey` (`my_hotkey`) with your own.

```python showLineNumbers
import bittensor as bt
wallet = bt.Wallet(name = 'my_coldkey', hotkey = 'my_hotkey' )
wallet.create_if_non_existent()
```

You will see a terminal output like this for an example wallet with `name` as `test-coldkey` and `hotkey` as `test-hotkey`. The mnemonic is hidden for security reasons.

```text
>>> import bittensor as bt
>>> wallet = bt.Wallet(name = 'test-coldkey', hotkey = 'test-hotkey')
>>> wallet.create_if_non_existent()

IMPORTANT: Store this mnemonic in a secure (preferable offline place), as anyone who has possession of this mnemonic can use it to regenerate the key and access your tokens.

The mnemonic to the new coldkey is:

**** **** **** **** **** **** **** **** **** **** **** ****

You can use the mnemonic to recreate the key with `btcli` in case it gets lost.
Enter your password:
Retype your password:
Encrypting...
wallet(test-coldkey, test-hotkey, ~/.bittensor/wallets/)
```

:::info Encrypting the hotkey
Since the coldkey is encrypted by default, the command above only encrypts the newly created coldkey. To encrypt your hotkey when creating a wallet, include the `hotkey_use_password=True` parameter in the `wallet.create_if_non_existent()` method as shown:

```python showLineNumbers
import bittensor as bt
wallet = bt.Wallet(name = 'my_coldkey', hotkey = 'my_hotkey')
wallet.create_if_non_existent(hotkey_use_password=True)
```

Then, you will be prompted to configure the wallet by setting a password for both the coldkey and the hotkey.
:::

</TabItem>
<TabItem value="coldkey" label="Coldkey only">
If a user does not intend to mine, validate, manage subnets, or participate in governance, a hotkey is not required. In such cases, a coldkey-only wallet is recommended for simplicity.

Copy and paste the following lines into your Python interpreter. Replace the string values for `name` (`my_coldkey`) with your own.

```python showLineNumbers
import bittensor as bt
wallet = bt.Wallet(name = 'my_coldkey')
wallet.create_new_coldkey()
```

You will be prompted to input a password for the coldkey and then see the terminal output, which includes your all-important seed phrase, a.k.a. the _mnemonic_ to the coldkey.

```text
IMPORTANT: Store this mnemonic in a secure (preferable offline place), as anyone who has possession of this mnemonic can use it to regenerate the key and access your tokens.

The mnemonic to the new hotkey is: **** *** **** **** ***** **** *** **** **** **** ***** *****
You can use the mnemonic to recreate the key in case it gets lost.
```

</TabItem>
<TabItem value="hotkey" label="Hotkey only">
If you plan to validate or mine in a subnet, you must have both a coldkey and a hotkey. A hotkey is also required when creating and managing subnets.

Before creating a hotkey, you must have created a coldkey as described in the [creating a coldkey tab](?create-wallet=coldkey). Next, provide this coldkey as a parameter to generate a hotkey. This will pair the hotkey with the coldkey as shown:

```python showLineNumbers
import bittensor as bt
wallet = bt.Wallet(name = 'my_coldkey')
wallet.create_new_hotkey()
```

:::info Encrypting the hotkey
To encrypt your hotkey when creating a wallet, include the `use_password=True` parameter in the `wallet.create_new_hotkey()` method as shown:

```python showLineNumbers
import bittensor as bt
wallet = bt.Wallet(name = 'my_coldkey')
wallet.create_new_hotkey(use_password=True)
```

Then, you will be prompted to configure the wallet by setting a password for both the hotkey.
:::

</TabItem>
</Tabs>

---

## Location and addresses of the local wallets

Both `btcli` and the Bittensor Python SDK use a local wallet/key store. By default, this is located on your machine at `~/.bittensor/wallets`. Use the below command to list them:

```bash
tree ~/.bittensor/
```

You will see an output like this:

```bash
tree ~/.bittensor/
/Users/docwriter/.bittensor/    # The Bittensor root directory.
└── wallets                     # The folder contains all Bittensor wallets.
    └── test-coldkey            # The name of the wallet.
        ├── coldkey             # The password-encrypted coldkey.
        ├── coldkeypub.txt      # The unencrypted version of the coldkey.
        └── hotkeys             # The folder contains all this coldkey's hotkeys.
            └── test-hotkey     # The unencrypted hotkey information.
```

and listing out the contents of the `coldkeypub.txt` file:

```bash
cd ~/.bittensor/wallets/test-coldkey
cat coldkeypub.txt | jq
{
  "accountId": "0x36e49805b105af2b5572cfc86426247df111df2f584767ca739d9fa085246c51",
  "publicKey": "0x36e49805b105af2b5572cfc86426247df111df2f584767ca739d9fa085246c51",
  "privateKey": null,
  "secretPhrase": null,
  "secretSeed": null,
  "ss58Address": "5DJgMDvzC27QTBfmgGQaNWBQd8CKP9z5A12yjbG6TZ5bxNE1"
}
```

The contents of the `coldkeypub.txt` are to be interpreted as below:

- The fields `accountId` and `publicKey` contain the same value.
- The `secretPhrase` and `secretSeed` are not included in the file due to the high-security nature of the coldkey. When you create your wallet, either using the Chrome extension or `btcli`, the mnemonic (`secretPhrase`) is shown only once, while `secretSeed` is not shown.
- The `ss58Address` is the SS58-version of the `accountId` or `publicKey`. **This is your coldkey's public address, and can be used to transfer TAO from another wallet.**

:::tip Conversion between publicKey and ss58Address
Use this site [SS58.org](https://ss58.org/) to verify the conversions between `publicKey` and `ss58Address` fields.
:::

Similarly, listing out the contents of the `hotkeys/test-hotkey` file:

```bash
cat hotkeys/test-hotkey | jq
{
  "accountId": "0xc66695556006c79e278f487b01d44cf4bc611f195615a321bf3208f5e351621e",
  "publicKey": "0xc66695556006c79e278f487b01d44cf4bc611f195615a321bf3208f5e351621e",
  "privateKey": "0x38d3ae3b6e4b5df8415d15f44f * * * 0f975749f835fc221b * * * cbaac9f5ba6b1c90978e3858 * * * f0e0470be681c0b28fe2d64",
  "secretPhrase": "pyramid xxx wide slush xxx hub xxx crew spin xxx easily xxx",
  "secretSeed": "0x6c359cc52ff1256c9e5 * * * 5536c * * * 892e9ffe4e4066ad2a6e35561d6964e",
  "ss58Address": "5GYqp3eKu6W7KxhCNrHrVaPjsJHHLuAs5jbYWfeNzVudH8DE"
}
```

The contents of the `hotkeys/test-hotkey` file are to be interpreted as below:

- The fields `accountId` and `publicKey` contain the same value, just as seen in `coldkeypub.txt`.
- The `secretPhrase` and `secretSeed` are shown because the hotkey is, by default, not encrypted.
- The `ss58Address` is the SS58-version of the `accountId` or `publicKey`. **This is your hotkey's public address and can be used to stake/delegate to your hotkey from other wallets.**

:::danger
Hotkeys are for staking. Do not _transfer_ TAO to a hotkey!
:::

## Listing all the local wallets

You can list all the local wallets stored in Bittensor's root directly with:

```bash
btcli wallet list
```

You will see a terminal output like this:

```text
Wallets
└─
    test-coldkey (5DJgMDvzC27QTBfmgGQaNWBQd8CKP9z5A12yjbG6TZ5bxNE1)
       └── test-hotkey (5GYqp3eKu6W7KxhCNrHrVaPjsJHHLuAs5jbYWfeNzVudH8DE)
```

The output will show only the `ss58Address` field values from the `coldkeypub.txt` and `test-hotkey` files of the wallets.

:::tip Use the ss58Address keys as destinations for TAO
Use the above shown `ss58Address` field values as your public wallet addresses, i.e., as destinations for TAO transfers from another wallet to your wallet. For example, when using a command: `btcli wallet transfer`.
:::

## Store your mnemonics safely

:::danger If someone has your mnemonic, they own your TAO
If you lose the password to your wallet, or if you have lost access to the machine where the wallet is stored, you can regenerate the coldkey using the mnemonic you saved during the wallet creation steps above. You can **not** retrieve the wallet with the password alone. Remember that if someone has your mnemonic, they own your TAO.
:::

As a reminder, if you need to regenerate your wallets, you can use the `btcli` with your mnemonic, as shown below:

```bash
btcli wallet regen_coldkey --mnemonic **** *** **** **** ***** **** *** **** **** **** ***** *****
```

## Creating a Wallet with the Chrome Extension

[The Chrome extension...](https://chromewebstore.google.com/detail/bittensor-wallet/bdgmdoedahdcjmpmifafdhnffjinddgc)

:::tip Suitable for non-technical users
Use this option if your activities are limited to sending and receiving TAO and you are not creating a subnet or participating as a subnet validator or a subnet miner.
:::

1. The Wallet will first create a wallet account address in the form of a 48-hexadecimal character string that usually starts with `5`.
2. Critically, the Wallet will display your [_seed phrase_](./wallets#the-seed-phrase-aka-mnemonic), which you must carefully save.
3. The Wallet will then prompt you for specific mnemonic words as a way of authentication.
4. Next, you will assign a name and a password to your wallet account.
5. Finally, to receive TAO from another party, you will give them your wallet account address from Step 1 (the 48-hexadecimal character string) as the destination address. Similarly, to send (transfer) TAO to another party, you will first ask them for their wallet address and send TAO to their wallet address. This way, you can create multiple wallet accounts, each with a different name and even a different password for each wallet account.

## Updating legacy wallet

It is important that you update any legacy Bittensor wallets to the new NaCL format for security. You may accomplish this with the `btcli` using the `wallet update` subcommands.

See the below example command and the terminal output:

```bash
btcli wallet update
```

You will see an output like this:

```bash
>> Do you want to update all legacy wallets? [y/n]: y
>> =====  wallet(test-coldkey, default, ~/.bittensor/wallets/)  =====
>> ✅ Keyfile is updated.
>> 🔑 Keyfile (NaCl encrypted, /Users/docwriter/.bittensor/wallets/test-coldkey/coldkey)>
```
