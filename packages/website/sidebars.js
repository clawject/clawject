// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
export default {
  docs: [
    'intro',
    {
      type: 'doc',
      label: 'Setup 🛠',
      id: 'setup',
    },
    {
      type: 'doc',
      label: 'Language Service ✨',
      id: 'language-service',
    },
    {
      type: 'doc',
      label: 'Configuration 🔮',
      id: 'configuration',
    },
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: false,
      items: [
        {
          type: 'doc',
          label: 'IoC and DI',
          id: 'core-concepts/ioc-di-basics',
        },
        {
          type: 'doc',
          label: 'Clawject IoC Container',
          id: 'core-concepts/clawject-ioc',
        },
        {
          type: 'doc',
          label: 'Clawject Type System',
          id: 'core-concepts/type-system',
        },
      ],
    },
    {
      type: 'category',
      label: 'Overview',
      collapsed: false,
      items: [
        {
          type: 'doc',
          label: 'Configurations',
          id: 'overview/configurations',
        },
        'overview/clawject-factory',
        'overview/clawject-application-context',
        {
          type: 'doc',
          label: '@Internal @External',
          id: 'overview/internal-external',
        },
        {
          type: 'doc',
          label: 'ExposeBeans',
          id: 'overview/expose-beans',
        },
        'overview/import',
        'overview/scope-register',
        'overview/bean',
        'overview/lifecycle',
        'overview/embedded',
        'overview/lazy',
        'overview/primary',
        'overview/qualifier',
        'overview/scope',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: true,
      items: [
        'guides/sharing-configurations',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Concepts',
      collapsed: true,
      items: [
        'advanced-concepts/injecting-collections',
        'advanced-concepts/custom-scopes',
      ],
    },
    'errors',
  ],
};
