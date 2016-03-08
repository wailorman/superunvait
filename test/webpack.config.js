var webpack = require('webpack');

var webpackConfig = {
    context: __dirname,
    node: {
        __filename: true
    },
    entry: {
        unit: `mocha!${__dirname}/unit/.webpack-entry.js`,
        integration: `mocha!${__dirname}/integration/.webpack-entry.js`
    },
    output: {
        path: __dirname,
        filename: '[name]-test-bundle.js',
        library: "[name]"
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