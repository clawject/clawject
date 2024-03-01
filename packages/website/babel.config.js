const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
  plugins: [
    'styled-components',
  ].filter(Boolean)
};
