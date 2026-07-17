/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation
 The sidebars can be generated from the filesystem, or explicitly defined here.
 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  bittensorSidebar: [
    "index",
    {
      type: "category",
      label: "Understand Bittensor",
      collapsible: true,
      collapsed: true,
      items: [
        "learn/introduction",
        "resources/questions-and-answers",
        "learn/emissions",
        "learn/ema",
        "learn/yuma-consensus",
        "learn/fees",
      ],
    },
    {
      type: "category",
      label: "Wallets and Keys",
      collapsible: true,
      collapsed: true,
      items: [
        "keys/wallets",
        {
          type: "category",
          label: "Bittensor Wallet",
          collapsible: true,
          collapsed: true,
          items: [
            "keys/btwallet/index",
            "keys/btwallet/keypair",
            "keys/btwallet/encrypt-decrypt",
            "keys/btwallet/wallet-class",
          ],
        },
        "keys/working-with-keys",
        "keys/handle-seed-phrase",
        "keys/coldkey-hotkey-security",
        "keys/address-poisoning-scams",
        {
          type: "category",
          label: "Proxies",
          collapsible: true,
          collapsed: true,
          items: [
            "keys/proxies/index",
            "keys/proxies/working-with-proxies",
            "keys/proxies/pure-proxies",
            "learn/avoid-staking-proxy-attacks",
          ],
        },
        "keys/multisig",
        "keys/coldkey-swap",
      ],
    },
    {
      type: "category",
      label: "Staking/Delegation",
      collapsible: true,
      collapsed: true,
      items: [
        "staking-and-delegation/delegation",
        {
          type: "doc",
          id: "staking-and-delegation/managing-stake-sdk",
          label: "Managing Your Stakes",
        },
        "staking-and-delegation/conviction-staking",
        {
          type: "category",
          label: "Root claims",
          collapsible: true,
          collapsed: true,
          items: [
            "staking-and-delegation/root-claims/index",
            "staking-and-delegation/root-claims/managing-root-claims",
          ],
        },
        "learn/price-protection",
        "learn/balancer-amm",
        "learn/slippage",
        "staking-and-delegation/staking-polkadot-js",
        "staking-and-delegation/using-ledger-hw-wallet",
      ],
    },
    {
      type: "category",
      label: "Tools and Special Features",
      link: { type: "doc", id: "concepts/tools" },
      collapsible: true,
      collapsed: true,
      items: [
        "concepts/mev-shield/index",
        "concepts/commit-reveal",
        "concepts/stake-burn",
      ],
    },
    {
      type: "category",
      label: "Bittensor EVM: Staking and vTAO",
      collapsible: true,
      collapsed: true,
      items: [
        "evm-tutorials/index",
        "evm-tutorials/subtensor-networks",
        "evm-tutorials/evm-mainnet-with-metamask-wallet",
        "evm-tutorials/staking-precompile",
        "evm-tutorials/bridge-vtao",
        "evm-tutorials/vtao-bridge-tutorial",
        "evm-tutorials/vtao-liquidity-on-aerodrome",
        "evm-tutorials/convert-h160-to-ss58",
        "evm-tutorials/transfer-from-metamask-to-ss58",
      ],
    },
    {
      type: "category",
      label: "Errors and Troubleshooting",
      collapsible: true,
      collapsed: true,
      items: [
        "errors/index",
        "errors/custom",
        "errors/subtensor",
        "errors/troubleshooting",
      ],
    },
    "resources/glossary",
    "resources/community-links",
    "resources/media-assets",
  ],
};

module.exports = sidebars;
