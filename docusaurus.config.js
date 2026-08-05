// @ts-check

const { themes } = require("prism-react-renderer");
const lightTheme = themes.github;
const darkTheme = themes.dracula;

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Learn Bittensor - Developer Guides",
  tagline: "Guides and tutorials for the Bittensor network",
  favicon: "favicon.ico",
  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
    },
  ],
  trailingSlash: false,
  url: "https://guides.learnbittensor.org",
  baseUrl: "/",
  organizationName: "latent-to",
  projectName: "developer-docs",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",

  customFields: {
    enableIssueLinks: true,
    enableEditUrlLinks: true,
    issueBaseUrl: "https://github.com/latent-to/developer-docs/issues",
    enableFeedback: false,
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          path: "docs",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsible: true,
          showLastUpdateTime: true,
          docItemComponent: "@theme/DocItem",
          editUrl: "https://github.com/latent-to/developer-docs/blob/main/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            to: "/keys/proxies/working-with-proxies",
            from: "/keys/proxies/create-proxy",
          },
          {
            from: "/keys/proxies/staking-with-proxy",
            to: "/staking-and-delegation/managing-stake-sdk",
          },
          {
            from: "/staking-and-delegation/managing-stake-btcli",
            to: "/staking-and-delegation/managing-stake-sdk",
          },
          {
            from: "/staking-and-delegation/stakers-btcli-guide",
            to: "/staking-and-delegation/managing-stake-sdk",
          },
          {
            to: "/subnets/understanding-multiple-mech-subnets",
            from: "/subnets/understanding-sub-subnets",
          },
          {
            to: "/staking-and-delegation/staking-polkadot-js",
            from: "/staking/staking-polkadot-js",
          },
          {
            to: "/staking-and-delegation/delegation",
            from: "/staking",
          },
          {
            to: "/staking-and-delegation/delegation",
            from: "/staking-and-delegation/staking",
          },
          {
            from: "/subnets/register-validate-mine",
            to: "/validators",
          },
          {
            to: "/errors",
            from: "/subtensor-nodes/subtensor-error-messages",
          },
          {
            from: "/glossary",
            to: "/resources/glossary",
          },

          {
            from: "/questions-and-answers",
            to: "/resources/questions-and-answers",
          },
          {
            to: "/keys/coldkey-swap",
            from: "/keys/schedule-coldkey-swap",
          },
          {
            from: "/emissions",
            to: "/learn/emissions",
          },
          {
            from: "/yuma-consensus",
            to: "/learn/yuma-consensus",
          },
          {
            from: "/subnets/yc3-blog",
            to: "/learn/yc3-blog",
          },
          {
            from: "/fees",
            to: "/learn/fees",
          },
          {
            from: "/community-links",
            to: "/resources/community-links",
          },
          {
            from: "/subnets/yuma3-migration-guide",
            to: "/learn/yuma3-migration-guide",
          },
          {
            from: "/subnets/child-hotkeys",
            to: "/validators/child-hotkeys",
          },
          {
            from: "/btcli-permissions",
            to: "/btcli/btcli-permissions",
          },
          {
            from: "/migration_guide",
            to: "/sdk/migration-guide",
          },
          {
            from: "/getting-started/wallets",
            to: "/keys/wallets",
          },
          {
            from: "/getting-started/coldkey-hotkey-security",
            to: "/keys/coldkey-hotkey-security",
          },
          {
            from: "/working-with-keys",
            to: "/keys/working-with-keys",
          },
          {
            from: "/tools",
            to: "/concepts/tools",
          },
          {
            from: "/bittensor-networks",
            to: "/concepts/bittensor-networks",
          },
          {
            from: "/commit-reveal",
            to: "/concepts/commit-reveal",
          },
          {
            from: "/consensus-based-weights",
            to: "/concepts/consensus-based-weights",
          },
          {
            from: "/bt-logging-levels",
            to: "/concepts/bt-logging-levels",
          },
          {
            from: "/utilities",
            to: "/resources/utilities",
          },
          {
            from: "/senate",
            to: "/governance/senate",
          },
          {
            from: "/concepts/weight-copying-in-bittensor",
            to: "/learn/weight-copying-in-bittensor",
          },
          {
            from: "/learn/avoid-staking-proxy-attacks",
            to: "/keys/proxies/avoid-staking-proxy-attacks",
          },
          {
            from: "/learn/price-protection",
            to: "/staking-and-delegation/price-protection",
          },
          {
            from: "/learn/balancer-amm",
            to: "/staking-and-delegation/balancer-amm",
          },
          {
            from: "/learn/slippage",
            to: "/staking-and-delegation/slippage",
          },
          {
            from: "/getting-started/installation",
            to: "/sdk/installation",
          },
          {
            from: "/getting-started/install-btcli",
            to: "/btcli/install-btcli",
          },
          {
            from: "/errors/subtensor",
            to: "/subtensor-api/errors",
          },
          {
            from: "/errors-and-troubleshooting",
            to: "/errors/troubleshooting",
          },
          {
            from: "/media-assets",
            to: "/resources/media-assets",
          },
          {
            from: "/subtensor-nodes/using-docker",
            to: "/subtensor-nodes/run/using-docker",
          },
          {
            from: "/subtensor-nodes/using-source",
            to: "/subtensor-nodes/run/using-source",
          },
          {
            from: "/liquidity-positions/liquidity-positions",
            to: "/staking-and-delegation/balancer-amm",
          },
          {
            from: "/liquidity-positions/managing-liquidity-positions",
            to: "/staking-and-delegation/balancer-amm",
          },
        ],
      },
    ],
  ],
  scripts: [
    {
      src: "https://unpkg.com/@antonz/codapi@0.19.10/dist/settings.js",
      defer: true,
    },
    {
      src: "https://unpkg.com/@antonz/codapi@0.19.10/dist/snippet.js",
      defer: true,
    },
  ],

  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM",
      crossorigin: "anonymous",
    },
    {
      href: "https://unpkg.com/@antonz/codapi@0.19.10/dist/snippet.css",
    },
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/lb-logo.png",
      metadata: [
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Learn Bittensor" },
      ],
      announcementBar: {
        id: "package_source",
        content:
          '<span class="lb-notice"><span class="lb-notice__badge">Security</span><span class="lb-notice__text"><span class="lb-notice__long">⚠️ Only use links and commands directly from our docs or official release announcements to avoid malicious lookalikes.</span><span class="lb-notice__short">⚠️ Only use links from our official docs.</span></span></span>',
        backgroundColor: "#6366f1",
        textColor: "#ffffff",
        isCloseable: true,
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: false,
        },
      },

      navbar: {
        logo: {
          alt: "Learn Bittensor",
          src: "img/learnbittensor_light.png",
          srcDark: "img/learnbittensor_dark.png",
          href: "https://guides.learnbittensor.org",
          width: 179,
          height: 24,
          style: {
            objectFit: "contain",
            height: 24,
            width: "auto",
          },
        },
        items: [
          {
            type: "dropdown",
            label: "Get started",
            position: "left",
            activeBaseRegex: "^/(keys|miners|validators|staking-and-delegation|subnets|tutorials)(/|$)",
            className: "docs-dropdown",
            items: [
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Introduction</span><span class="lb-mega-item__desc">Learn what Bittensor is and how the network works</span></span>',
                to: "/learn/introduction",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Wallets and Keys</span><span class="lb-mega-item__desc">Create and secure your coldkeys and hotkeys</span></span>',
                to: "/keys/wallets",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Mining</span><span class="lb-mega-item__desc">Run a miner and produce digital commodities on a subnet</span></span>',
                to: "/miners",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Validating</span><span class="lb-mega-item__desc">Evaluate miner work and earn emissions as a validator</span></span>',
                to: "/validators",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Manage subnets</span><span class="lb-mega-item__desc">Create and operate your own Bittensor subnet</span></span>',
                to: "/subnets/create-a-subnet",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Stake and delegate</span><span class="lb-mega-item__desc">Put TAO to work by delegating to a validator</span></span>',
                to: "/staking-and-delegation/delegation",
              },
            ],
          },
          {
            type: "dropdown",
            label: "Learn",
            position: "left",
            activeBaseRegex: "^/(learn|concepts|resources|navigating-subtensor|governance)(/|$)",
            items: [
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Emissions</span><span class="lb-mega-item__desc">How TAO is minted and shared out every block</span></span>',
                to: "/learn/emissions",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Yuma Consensus</span><span class="lb-mega-item__desc">How validator weights turn into miner rewards</span></span>',
                to: "/learn/yuma-consensus",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Subnets</span><span class="lb-mega-item__desc">What subnets are and how they fit together</span></span>',
                to: "/subnets/understanding-subnets",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Incentive mechanisms</span><span class="lb-mega-item__desc">How a subnet decides what work is worth rewarding</span></span>',
                to: "/learn/anatomy-of-incentive-mechanism",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Transaction fees</span><span class="lb-mega-item__desc">What each on-chain action costs and why</span></span>',
                to: "/learn/fees",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Glossary</span><span class="lb-mega-item__desc">Plain definitions for the terms used across these docs</span></span>',
                to: "/resources/glossary",
              },
            ],
          },
          {
            type: "dropdown",
            label: "Reference",
            position: "left",
            activeBaseRegex: "^/(sdk|btcli|subtensor-api|errors|local-build|subtensor-nodes)(/|$)",
            items: [
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Python SDK</span><span class="lb-mega-item__desc">Build against Bittensor from Python</span></span>',
                to: "/sdk",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Bittensor CLI</span><span class="lb-mega-item__desc">Manage wallets, stake and subnets from the terminal</span></span>',
                to: "/btcli/overview",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Subtensor API</span><span class="lb-mega-item__desc">Extrinsics, storage, events and constants</span></span>',
                to: "/subtensor-api",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Subnet hyperparameters</span><span class="lb-mega-item__desc">Every subnet setting and what changing it does</span></span>',
                to: "/subnets/subnet-hyperparameters",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Error codes</span><span class="lb-mega-item__desc">Look up a Subtensor error and what triggers it</span></span>',
                to: "/errors",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Troubleshooting</span><span class="lb-mega-item__desc">Fixes for the problems people hit most often</span></span>',
                to: "/errors/troubleshooting",
              },
            ],
          },
          {
            type: "dropdown",
            label: "Bittensor EVM",
            position: "left",
            activeBaseRegex: "^/evm-tutorials(/|$)",
            items: [
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">EVM smart contracts</span><span class="lb-mega-item__desc">Deploy and interact with smart contracts on the Bittensor EVM</span></span>',
                to: "/evm-tutorials",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Token Bridging</span><span class="lb-mega-item__desc">Bridge tokens to and from the Bittensor EVM</span></span>',
                to: "/evm-tutorials/bridge-vtao",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Convert H160 to SS58</span><span class="lb-mega-item__desc">Map Ethereum H160 addresses to Substrate SS58 format</span></span>',
                to: "/evm-tutorials/convert-h160-to-ss58",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">Precompiles</span><span class="lb-mega-item__desc">Call staking, subnet and metagraph precompiles from Solidity</span></span>',
                to: "/evm-tutorials/examples",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">EVM networks</span><span class="lb-mega-item__desc">Endpoints and chain IDs for mainnet, testnet and localnet</span></span>',
                to: "/evm-tutorials/subtensor-networks",
              },
              {
                html: '<span class="lb-mega-item"><span class="lb-mega-item__label">EVM troubleshooting</span><span class="lb-mega-item__desc">Gas, opcode and pending-transaction problems</span></span>',
                to: "/evm-tutorials/troubleshooting",
              },
            ],
          },
          {
            type: "search",
            position: "right",
            className: "custom_algolia",
          },
          {
            href: "https://github.com/latent-to/developer-docs",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
          },
        ],
      },

      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
        additionalLanguages: ["bash", "python", "diff", "json", "yaml"],
      },
      algolia: {
        appId: "UXNFOAH677",
        apiKey: "72af66272aba6bd27e76ac6f7eec0068",
        indexName: "learnbittensor",
        contextualSearch: true,
        insights: true,
        debug: false,
        searchPagePath: "search",
      },
      footer: {
        // Rendered by swizzled Footer/Copyright (brand mark, links, social).
        copyright: "© Learn Bittensor",
      },
    }),
};

module.exports = config;
