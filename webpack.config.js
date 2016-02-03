const NODE_ENV = process.env.NODE_ENV == 'production' ? 'production' : 'development';
var webpack = require('webpack');

var webpackConfig = {
    entry: {
        'page_script': './public/src/page_script.js',
        'page_action': './public/src/page_action.js',
        'content_script': './public/src/content_script.js',
        'background': './public/src/background.js'
    },
    output: {
        path: __dirname + '/public/dist',
        filename: '[name].build.js',
        library: "[name]"
    },

    module: {

        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            }
        ]

    },

    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery/dist/jquery.min',
            '_': 'lodash',
            'Q': 'q'
        })
    ]
};

if (NODE_ENV == 'development') {

    webpackConfig.devtool = 'cheap-inline-module-source-map';

}

if (NODE_ENV == 'production') {
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin()
    );

    webpackConfig.devtool = null;
}

module.exports = webpackConfig;