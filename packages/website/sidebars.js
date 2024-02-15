// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
export default {
  docs: [
    'intro',
    'setup',
    'language-service',
    'configuration',
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: false,
      items: [
        'core-concepts/ioc-di-basics',
        'core-concepts/clawject-ioc',
        'core-concepts/type-system',
      ],
    },
    {
      type: 'category',
      label: 'API',
      collapsed: false,
      items: [
        'api/configuration-decorator',
        'api/clawject-application',
        'api/clawject-factory',
        'api/clawject-application-context',
        'api/expose-beans',
        'api/import',
        'api/scope-register',
        'api/bean',
        'api/lifecycle',
        'api/embedded',
        'api/lazy',
        'api/primary',
        'api/qualifier',
        'api/scope',
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
