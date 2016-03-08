var webpack = require('webpack');

var webpackConfig = {
    context: __dirname,
    node: {
        __filename: true
    },
    entry: `mocha!${__dirname}/unit/index.js`,
    output: {
        path: __dirname,
        filename: 'test-bundle.js'
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
            }
        ]

    },

    plugins: [
        new webpack.ProvidePlugin({
            'chai': 'chai',
            '$': 'jquery/dist/jquery.min',
            '_': 'lodash',
            'Q': 'q',
            'logger': __dirname + '../public/lib/logger'
        })
    ],

    devtool: 'eval'
};

module.exports = webpackConfig;