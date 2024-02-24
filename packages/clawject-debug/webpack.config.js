import HtmlWebpackPlugin from 'html-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import {ClawjectTransformer} from '@clawject/di/transformer';
import {ClawjectWebpackPlugin} from '@clawject/di/webpack';

export default {
  entry: './src/index.ts',
  mode: 'development',
  resolve: {
    extensions: ['.js', '.ts', '.mjs'],
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new CleanWebpackPlugin(),
    new ClawjectWebpackPlugin(),
  ]
};
