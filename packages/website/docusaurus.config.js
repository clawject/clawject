// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Clawject | DI made easy',
  tagline: 'TypeScript DI made easy',
  favicon: 'img/logo.svg',

  // Set the production url of your site here
  url: 'https://clawject.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  plugins: [
    // () => ({
    //   name: 'shopify-worker-plugin',
    //   configureWebpack() {
    //     return {
    //       output: {
    //         globalObject: 'self',
    //       },
    //       plugins: [
    //         new (require('@shopify/web-worker/webpack').WebWorkerPlugin)(),
    //       ]
    //     };
    //   }
    // }),
  ],

  trailingSlash: undefined,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'clawject', // Usually your GitHub org/user name.
  projectName: 'clawject', // Usually your repo name.
  deploymentBranch: 'gh-pages', // The branch of your docs repo that you are going to deploy to GitHub pages.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          breadcrumbs: true,
          showLastUpdateTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 6,
      },
      navbar: {
        title: 'Clawject',
        hideOnScroll: true,
        logo: {
          alt: 'Clawject logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/clawject/clawject',
            position: 'right',
            className: 'header-github-link',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            label: 'Made with <3 by Artem Korniev',
            href: 'https://github.com/artem1458',
          },
        ],
      },
      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
        additionalLanguages: ['typescript', 'javascript', 'json', 'bash'],
      },

      algolia: {
        appId: 'XY3XUTLPXF',
        apiKey: '55b87fd126a26b83c535c8e62371a41f',

        indexName: 'clawject',

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',

        //... other Algolia params
      },
    }),
};

module.exports = config;
