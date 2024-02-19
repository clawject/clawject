// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
export default {
  docs: [
    {
      type: 'doc',
      label: 'Introduction 🚀',
      id: 'intro',
    },
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
        {
          type: 'doc',
          label: 'ClawjectFactory',
          id: 'overview/clawject-factory',
        },
        {
          type: 'doc',
          label: 'ClawjectApplicationContext',
          id: 'overview/clawject-application-context',
        },
        {
          type: 'doc',
          label: 'Import',
          id: 'overview/import',
        },
        {
          type: 'doc',
          label: 'Bean',
          id: 'overview/bean',
        },
        {
          type: 'doc',
          label: 'ExposeBeans',
          id: 'overview/expose-beans',
        },
        {
          type: 'doc',
          label: '@Internal @External',
          id: 'overview/internal-external',
        },
        {
          type: 'doc',
          label: 'Lifecycle',
          id: 'overview/lifecycle',
        },
        {
          type: 'doc',
          label: '@Embedded',
          id: 'overview/embedded',
        },
        {
          type: 'doc',
          label: '@Lazy',
          id: 'overview/lazy',
        },
        {
          type: 'doc',
          label: '@Primary',
          id: 'overview/primary',
        },
        {
          type: 'doc',
          label: '@Qualifier',
          id: 'overview/qualifier',
        },
        {
          type: 'doc',
          label: '@Scope',
          id: 'overview/scope',
        },
        {
          type: 'doc',
          label: 'ScopeRegister',
          id: 'overview/scope-register',
        },
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
