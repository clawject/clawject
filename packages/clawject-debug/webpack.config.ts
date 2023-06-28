import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { ClawjectWebpackPlugin } from 'clawject/webpack';
import { ClawjectTransformer } from 'clawject/transformer';
import HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    devtool: 'source-map',
    resolve: {
        fallback: {
            assert: require.resolve('assert')
        },
        extensions: ['.js', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    // compiler: 'ts-patch',
                    getCustomTransformers: (program: any, getProgram: any) => ({
                        before: [ClawjectTransformer(getProgram)],
                    })
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
