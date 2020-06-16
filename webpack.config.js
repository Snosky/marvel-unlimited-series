const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = env => {
    return {
        entry: {
            'script.js': './src/index.ts'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'script.js'
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                }
            ]
        },
        resolve: {
            extensions: ['.ts']
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'RATE_URL': JSON.stringify(env.RATE_URL)
                }
            }),
            new CopyPlugin([
                {from: './icons/*', to: '[name].[ext]'},
                {from: './manifest.json', to: 'manifest.json', toType: 'file'},
            ]),
            new ZipPlugin({
                path: 'zip',
                filename: env.BROWSER + '.zip',
            })
        ]
    }
};
