const originalConfig = require('./webpack.config');
const webpack = require('webpack');
const _ = require('lodash');
const WriteFilePlugin = require('write-file-webpack-plugin');

var webpackConfig = {

    context: originalConfig.context,
    node: originalConfig.node,
    entry: {

        "unit-api": `${__dirname}/test/unit/index`,
        "integration-api": `${__dirname}/test/integration/index`,

        "unit-client": `${__dirname}/public/test/unit/index`,
        "integration-client": `mocha!${__dirname}/public/test/integration/index`

    },
    output: {
        path: __dirname + '/dist/test/',
        filename: '[name].build.js',

        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },

    module: {

        loaders: [
            originalConfig.module.loaders[0],

            {test: /\.css$/, loader: 'null'}
        ]

    },

    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery/dist/jquery.min',
            '_': 'lodash',
            'Q': 'q',
            'logger': __dirname + '/public/lib/logger',

            'expect': __dirname + '/test/requirements/chai-expect.js',
            'sinon': 'sinon'
        }),
        new WriteFilePlugin()
    ],

    devtool: 'eval',

    devServer: {
        outputPath: __dirname + '/dist/test/'
    }

};

module.exports = webpackConfig;