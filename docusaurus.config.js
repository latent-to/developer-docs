// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// const lightCodeTheme = require("prism-react-renderer/themes/github");
// const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const { themes } = require("prism-react-renderer");
const lightTheme = themes.github;
const darkTheme = themes.dracula;

// KaTex stuff
// const math = require("remark-math");
// const katex = require("rehype-katex");
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Bittensor",
  tagline: "Developer Documentation",
  favicon: "img/favicon.ico",
  trailingSlash: false,
  // Set the production url of your site here
  url: "https://docs.learnbittensor.org",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "latent-to", // Usually your GitHub org/user name.
  projectName: "developer-docs", // Usually your repo name.
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".

  customFields: {
    enableIssueLinks: true, // Set to true to enable issue links
    enableEditUrlLinks: true, // Set to true to enable edit url links
    issueBaseUrl: "https://github.com/latent-to/developer-docs/issues",
    enableFeedback: false, // Set to false to disable feedback
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
    // "@gracefullight/docusaurus-plugin-vercel-analytics",
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
        {
            "to": "/keys/proxies/working-with-proxies",
            "from": "/keys/proxies/create-proxy"
          },
        {
            "to": "/subnets/understanding-multiple-mech-subnets",
            "from": "/subnets/understanding-sub-subnets"
          },
            {
            to: "/liquidity-positions/",
            from: "/liquidity-provider",
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
            to: "/keys/schedule-coldkey-swap",
            from: "/subnets/schedule-coldkey-swap",
          },
          {
            to: "/sdk/bt-api-ref",
            from: "/reference/bittensor-api-ref",
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
            from: "/bittensor-rel-notes",
            to: "/resources/bittensor-rel-notes",
          },
          {
            from: "/questions-and-answers",
            to: "/resources/questions-and-answers",
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
            from: "/btcli",
            to: "/btcli",
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
            from: "/bt-api-ref",
            to: "/sdk/bt-api-ref",
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
            from: "/governance",
            to: "/governance",
          },
          {
            from: "/senate",
            to: "/governance/senate",
          },
          {
            from: "/errors-and-troubleshooting",
            to: "/errors/troubleshooting",
          },
          {
            from: "/media-assets",
            to: "/resources/media-assets",
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
  // clientModules: ["/static/feedbug-widjet.js"],

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
      // Replace with your project's social card
      image: "img/bittensor-dev-docs-social-card.png",
      announcementBar: {
        id: "package_source",
        content:
          "<strong> ⚠️ For security, only use links and commands directly from our docs or official release announcements to avoid malicious lookalikes.</strong>",
        backgroundColor: "#FFF4E5",
        textColor: "#4A2F00",
        isCloseable: true,
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: false,
        },
      },

      // announcementBar: {
      //   id: 'support_us',
      //   content:
      //     'The dynamic TAO docs are preliminary. Check <a target="_blank" rel="noopener noreferrer" href="#">this page for more.</a>',
      //   backgroundColor: '#171717',
      //   textColor: '#f43228',
      //   isCloseable: false,
      // },

      navbar: {
        logo: {
          alt: "Bittensor",
          src: "img/logo.svg",
          srcDark: "img/logo-dark-mode.svg",
          href: "https://docs.learnbittensor.org",
          style: {
            objectFit: "contain",
            width: 21,
          },
        },
        items: [
          {
            position: "left",
            label: "Announcements",
            to: "learn/announcements",
          },
          {
            position: "left",
            label: "Bittensor SDKv10 Migration Guide",
            to: "sdk/migration-guide",
          },
          {
            position: "left",
            label: "What is Bittensor?",
            to: "learn/introduction",
          },
          {
            position: "left",
            label: "Bittensor SDK Reference",
            to: "sdk/bt-api-ref",
          },

          {
            position: "left",
            label: "EVM on Bittensor",
            to: "evm-tutorials",
          },
          {
            type: "search",
            position: "left",
            className: "custom_algolia",
          },
          {
            to: "resources/bittensor-rel-notes",
            label: "Releases",
            position: "left",
          },
          {
            href: "https://github.com/latent-to/developer-docs",
            label: "Docs GitHub",
            position: "right",
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
        // // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        // replaceSearchResultPathname: {
        //   from: "/docs/", // or as RegExp: /\/docs\//
        //   to: "/",
        // },
      },
      footer: {
        copyright: `
					<div className="copyRight">
						© ${new Date().getFullYear()} <a href="https://learnbittensor.org">LearnBittensor</a> • <a href="https://latent.to/">Latent Holdings</a>, <span>all rights reserved.</span>
            <a href="mailto:m@latent.to">contact the docs team</a>
          </div>
					<a href='https://learnbittensor.org/'>
					<img src="img/logo-dark-mode.svg" alt="logo"/>
					</a>
				`,
      },
    }),
};

module.exports = config;
