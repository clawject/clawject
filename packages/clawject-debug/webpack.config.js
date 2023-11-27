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
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.webpack.tsloader.json',
          getCustomTransformers: (program, getProgram) => ({
            before: [
              ClawjectTransformer(getProgram)
            ]
          })
        }
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
