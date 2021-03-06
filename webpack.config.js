const NODE_ENV = process.env.NODE_ENV == 'production' ? 'production' : 'development';
var webpack = require('webpack');

var webpackConfig = {
    context: __dirname,
    node: {
        __filename: true,
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        dgram: 'empty',
        'pg-hstore': 'empty',
        dns: 'empty'
    },
    entry: {
        'page_script': './public/src/page-script.js',
        'page_action': './public/src/page-action-controller.js',
        'content_script': './public/src/content-script.js',
        'background': './public/src/background.js'
    },
    output: {
        path: __dirname + '/dist/crx',
        filename: '[name].build.js',
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
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            { test: /\.css$/, loader: 'style!css' }
        ]

    },

    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery/dist/jquery.min',
            '_': 'lodash',
            'Q': 'q',
            'logger': __dirname + '/public/lib/logger'
        })
    ]
};

if (NODE_ENV == 'development') {

    webpackConfig.devtool = 'eval';

}

if (NODE_ENV == 'production') {
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );

    webpackConfig.devtool = null;
}

module.exports = webpackConfig;