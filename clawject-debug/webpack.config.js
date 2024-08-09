const HtmlWebpackPlugin = require('html-webpack-plugin');
const ClawjectUnplugin = require('@clawject/di/unplugin');

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }],
              ['@babel/preset-typescript'],
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
            ]
          }
        }
      }
    ]
  },
  devServer: {
    port: 9000,
    hot: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.json'],
  },
  plugins: [
    new HtmlWebpackPlugin(),
    ClawjectUnplugin.default.webpack(),
  ],
  output: {
    filename: 'index.js',
  }
}
