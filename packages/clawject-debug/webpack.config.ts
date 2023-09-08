import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { ClawjectWebpackPlugin } from 'clawject/webpack';

module.exports = {
  entry: './src/index.ts',
  mode: 'development',
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          // getCustomTransformers: (program: any) => {
          //   console.log(program);
          // }
        }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new CleanWebpackPlugin(),
    new ClawjectWebpackPlugin(),
  ]
};
