'use strict';

var webpack = require('webpack');
var path    = require('path');

module.exports = {
    entry: {
        main    : './app/main.js'
        , vendor: ['jquery'] //, 'hammerjs' './node_modules/materialize-css/bin/materialize.js'
    }
    , output: {
        path           : path.join(__dirname, 'assets/js/', '[hash]')
        , publicPath   : 'assets/js/[hash]/'
        , filename     : '[name].[hash].bundle.js'
        , chunkFilename: '[id].[hash].bundle.js'
    }
    , plugins: [
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery'
            , $            : 'jquery'
            , jQuery       : 'jquery'
            , Hammer       : 'hammerjs'
        })
        , new webpack.optimize.DedupePlugin()
        , new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.bundle.js')
        , new webpack.optimize.OccurenceOrderPlugin()
        //, new webpack.optimize.UglifyJsPlugin()
    ]
    , devtool: 'source-map'
    , module : {
        loaders: [
            { test: /\.scss$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap'] }
        ]
    }
};
