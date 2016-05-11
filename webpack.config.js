var webpack = require('webpack');
var uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
});

module.exports = {

    plugins: [uglifyJsPlugin],

    entry: {
        main : './src/js/main.es6'
    },

    output: {
        path: './public/js/',
        filename: '[name].min.js'
    },

    module: {
        loaders: [
            {
                test: /\.es6$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ["es2015","es2016","stage-3"]
                }
            }
        ]
    }
};
