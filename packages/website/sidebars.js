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
      label: 'Fundamentals',
      collapsed: false,
      items: [
        {
          type: 'doc',
          label: 'Configurations',
          id: 'fundamentals/configurations',
        },
        {
          type: 'doc',
          label: 'ClawjectFactory',
          id: 'fundamentals/clawject-factory',
        },
        {
          type: 'doc',
          label: 'ClawjectApplicationContext',
          id: 'fundamentals/clawject-application-context',
        },
        {
          type: 'doc',
          label: 'Import',
          id: 'fundamentals/import',
        },
        {
          type: 'doc',
          label: 'Bean',
          id: 'fundamentals/bean',
        },
        {
          type: 'doc',
          label: 'ExposeBeans',
          id: 'fundamentals/expose-beans',
        },
        {
          type: 'doc',
          label: '@Internal @External',
          id: 'fundamentals/internal-external',
        },
        {
          type: 'doc',
          label: 'Lifecycle',
          id: 'fundamentals/lifecycle',
        },
        {
          type: 'doc',
          label: '@Embedded',
          id: 'fundamentals/embedded',
        },
        {
          type: 'doc',
          label: '@Lazy',
          id: 'fundamentals/lazy',
        },
        {
          type: 'doc',
          label: '@Primary',
          id: 'fundamentals/primary',
        },
        {
          type: 'doc',
          label: '@Qualifier',
          id: 'fundamentals/qualifier',
        },
        {
          type: 'doc',
          label: '@Scope',
          id: 'fundamentals/scope',
        },
        {
          type: 'doc',
          label: 'ScopeRegister',
          id: 'fundamentals/scope-register',
        },
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: true,
      items: [
        'guides/injecting-collections',
        'guides/sharing-configurations',
        {
          type: 'doc',
          label: 'Creating Scope',
          id: 'guides/creating-scope',
        },
      ],
    },
    'errors',
    'support',
  ],
};
