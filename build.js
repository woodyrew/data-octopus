'use strict';

// Set Debugging up:
if (process.env.NODE_ENV === 'development' && !process.env.DEBUG) {
    process.env.DEBUG = '*';
}

var debug_lib    = require('debug');
var debug        = debug_lib('data-octopus');
var error        = debug_lib('data-octopus:error');
var path         = require('path');

var metalsmith   = require('metalsmith');
var markdown     = require('metalsmith-markdown');
var layouts      = require('metalsmith-layouts');
var sitemap      = require('metalsmith-sitemap');
var collections  = require('metalsmith-collections');
var permalinks   = require('metalsmith-permalinks');

var sass         = require('metalsmith-sass');
var assets       = require('metalsmith-assets');
var gzip         = require('metalsmith-gzip');
var serve        = require('metalsmith-serve');

var webpack_assets = require('./modules/metalsmith_webpack_assets');
// var default_values = require('./modules/metalsmith_default_values');
// var logging        = require('./modules/metalsmith_logging');

// Special handlebars markdown interperator
require('./modules/handlebars_extra');

var port     = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 9778;
var hostname = process.env.OPENSHIFT_NODEJS_IP || process.env.HOSTNAME || 'localhost';

console.time('Built');
metalsmith(__dirname)
    .source('./src')
    .metadata({
        site: {
            name           : 'Data Octopus'
            , author       : 'Andrew Goodricke'
            , url          : 'http://dataoctopus.uk'
            , email        : 'hi@dataoctopus.uk'
            , phone        : '+44 (0)208 1337 992'
            , twitter_user : 'dataoctopus'
            , google_ua    : ''
            , default_image: ''
        }
        , is_dev: process.env.NODE_ENV === 'development'
    })
    .use(collections({
        blog: {
            pattern  : 'posts/*.md'
            , sortBy : 'date'
            , reverse: true
        }
    }))
    // .use(logging.file_details)
    // .use(logging.metadata)
    .use(webpack_assets({
        stats_file: 'webpack.stats.json'
    }))
    .use(markdown())
    .use(layouts({
        engine     : 'handlebars'
        , directory: 'templates'
        , partials : 'templates/partials'
    }))
    .use(permalinks({
        pattern   : ':collection/:slug'
        , relative: false
    }))
    .use(sass({
        includePaths: [
            path.join(__dirname, 'node_modules/materialize-css/sass/')
            , path.join(__dirname, 'src/assets/styles/')
        ]
        , outputStyle      : 'compressed'
        , sourceMap        : true
        , sourceMapContents: true // This will embed all the Sass contents in your source maps.
    }))
    .use(assets({
        source       : './node_modules/materialize-css/font/' // relative to the working directory
        , destination: './assets/font/' // relative to the build directory
    }))
    .use(assets({
        source       : './assets/' // relative to the working directory
        , destination: './assets/' // relative to the build directory
    }))
    .use(gzip())
    .use(sitemap({
        hostname   : 'http://dataoctopus.uk'
        , pattern  : ['**/*.html', '!404/**']
        , omitIndex: true
    }))
    .use(serve({
        port              : port
        , host            : hostname
        , verbose         : true
        , http_error_files: {
            404: '/404/index.html'
        }
    }))
    .destination('./site')
    .build(function (err) {
        // For error handling
        if (err) {
            return error(err);
        }
        console.timeEnd('Built');
    });
