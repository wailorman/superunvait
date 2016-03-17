const originalConfig = require('./webpack.config');
const webpack = require('webpack');

var webpackConfig = {

    context: originalConfig.context,
    node: originalConfig.node,
    entry: {

        "unit-api": `${__dirname}/test/unit/api/index`

    },
    output: {
        path: __dirname + '/test/build',
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

    plugins: originalConfig.plugins,

    devtool: 'eval'

};

module.exports = webpackConfig;