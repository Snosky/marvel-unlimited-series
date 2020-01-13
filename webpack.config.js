const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
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
        new CopyPlugin([
            { from: './icons/*', to: '[name].[ext]' },
            { from: './manifest.json', to: 'manifest.json', toType: 'file' },
        ])
    ]
};