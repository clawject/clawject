// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
export default {
    docs: [
        'intro',
        'setup',
        {
            type: 'category',
            label: 'Core Concepts',
            collapsed: false,
            items: [
                'core-concepts/ioc-di-basics',
                'core-concepts/clawject-ioc',
            ],
        }
    ]
};
