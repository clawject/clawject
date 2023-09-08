// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Clawject: DI made easy',
    tagline: 'TypeScript DI made easy',
    favicon: 'img/favicon.svg',

    // Set the production url of your site here
    url: 'https://clawject.org',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    plugins: [
        () => ({
            name: 'shopify-worker-plugin',
            configureWebpack() {
                return {
                    output: {
                        globalObject: 'self',
                    },
                    plugins: [
                        new (require('@shopify/web-worker/webpack').WebWorkerPlugin)(),
                    ]
                }
            }
        }),
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
                    breadcrumbs: false,
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
            // Replace with your project's social card
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
                        sidebarId: 'tutorialSidebar',
                        position: 'left',
                        label: 'Docs',
                    },
                    // {
                    //     position: 'left',
                    //     label: 'Playground',
                    //     to: '/playground',
                    // },
                    {
                        href: 'https://github.com/clawject/clawject',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        label: 'Made with ♥ by artem1458',
                        href: 'https://github.com/artem1458',
                    },
                    // {
                    //     title: 'Community',
                    //     items: [
                    //         {
                    //             label: 'Stack Overflow',
                    //             href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                    //         },
                    //         {
                    //             label: 'Discord',
                    //             href: 'https://discordapp.com/invite/docusaurus',
                    //         },
                    //         {
                    //             label: 'Twitter',
                    //             href: 'https://twitter.com/docusaurus',
                    //         },
                    //     ],
                    // },
                    // {
                    //     title: 'More',
                    //     items: [
                    //         {
                    //             label: 'Blog',
                    //             to: '/blog',
                    //         },
                    //         {
                    //             label: 'GitHub',
                    //             href: 'https://github.com/artem1458/clawject',
                    //         },
                    //     ],
                    // },
                ],
                // copyright: `Made with . Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
                magicComments: [
                    {
                        className: 'theme-code-block-highlighted-line',
                        line: 'highlight-next-line',
                        block: {start: 'highlight-start', end: 'highlight-end'},
                    },
                ],
            },
        }),
};

module.exports = config;
