const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
    plugins: [
        'styled-components',
        require.resolve('@shopify/web-worker/babel'),
    ].filter(Boolean)
};
