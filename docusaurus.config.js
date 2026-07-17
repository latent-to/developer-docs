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
  title: "tao.app Guides",
  tagline: "Staking and delegation guides for the Bittensor network",
  favicon: "img/favicon.ico",
  trailingSlash: false,
  // Set the production url of your site here
  url: "https://tao.app",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  // Local/preview value. Set back to "/guides/" before deploying to tao.app/guides.
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
            from: "/fees",
            to: "/learn/fees",
          },
          {
            from: "/community-links",
            to: "/resources/community-links",
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
            from: "/commit-reveal",
            to: "/concepts/commit-reveal",
          },
          {
            from: "/utilities",
            to: "/resources/utilities",
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
            from: "/liquidity-positions/liquidity-positions",
            to: "/learn/balancer-amm",
          },
          {
            from: "/liquidity-positions/managing-liquidity-positions",
            to: "/learn/balancer-amm",
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
      href: "https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap",
    },
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
      // Lock the site to dark ("night") mode to match tao.app.
      colorMode: {
        defaultMode: "dark",
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
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

      navbar: {
        logo: {
          alt: "tao.app Guides",
          src: "img/logo.svg",
          srcDark: "img/logo-dark-mode.svg",
          href: "https://tao.app",
          style: {
            objectFit: "contain",
            width: 21,
          },
        },
        items: [
          {
            type: "dropdown",
            label: "Get started",
            position: "left",
            className: "docs-dropdown",
            items: [
              {
                label: "Introduction",
                to: "learn/introduction",
              },
              {
                label: "Wallets and Keys",
                to: "keys/wallets",
              },
              {
                label: "Staking and Delegation",
                to: "staking-and-delegation/delegation",
              },
              {
                label: "Manage your stakes",
                to: "staking-and-delegation/managing-stake-sdk",
              },
              {
                label: "Root claims",
                to: "staking-and-delegation/root-claims",
              },
            ],
          },
          {
            type: "dropdown",
            label: "Bittensor EVM",
            position: "left",
            items: [
              {
                label: "Staking precompile",
                to: "evm-tutorials/staking-precompile",
              },
              {
                label: "Bridge vTAO",
                to: "evm-tutorials/bridge-vtao",
              },
              {
                label: "vTAO liquidity",
                to: "evm-tutorials/vtao-liquidity-on-aerodrome",
              },
              {
                label: "Convert h160 to SS58",
                to: "evm-tutorials/convert-h160-to-ss58",
              },
            ],
          },
          {
            type: "search",
            position: "left",
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
        // // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        // replaceSearchResultPathname: {
        //   from: "/docs/", // or as RegExp: /\/docs\//
        //   to: "/",
        // },
      },
      footer: {
        copyright: `
					<div className="copyRight">
						© ${new Date().getFullYear()} <a href="https://tao.app">tao.app</a>, <span>all rights reserved.</span>
          </div>
					<a href='https://tao.app/'>
					<img src="img/logo-dark-mode.svg" alt="logo"/>
					</a>
				`,
      },
    }),
};

module.exports = config;
