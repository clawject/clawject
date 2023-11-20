// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
export default {
  docs: [
    'intro',
    'setup',
    'language-service',
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
        'api/container-manager',
        'api/cat-context',
        'api/initialized-context',
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
