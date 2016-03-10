var webpack = require('webpack');

var webpackConfig = {
    context: __dirname,
    node: {
        __filename: true
    },
    entry: {
        "unit-api": `mocha!${__dirname}/unit/api/webpack-entry.js`,
        "unit-client": `mocha!${__dirname}/unit/client/webpack-entry.js`,
        "integration-client": `mocha!${__dirname}/integration/client/webpack-entry.js`
    },
    output: {
        path: __dirname,
        filename: '[name]-test-bundle.js'
    },

    module: {

        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                optional: ['runtime'],
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            },
            { test: /\.css$/, loader: 'null' }
        ]

    },

    plugins: [
        new webpack.ProvidePlugin({
            'chai': 'chai',
            '$': 'jquery/dist/jquery.min',
            '_': 'lodash',
            'Q': 'q',
            'logger': __dirname + '/../public/lib/logger'
        })
    ],

    devtool: 'eval'
};

module.exports = webpackConfig;