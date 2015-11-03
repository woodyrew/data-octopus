'use strict';

var handlebars  = require('handlebars');
var MomentHandler = require('handlebars.moment');

MomentHandler.registerHelpers(handlebars);


handlebars.registerHelper('get_title', function (options) {
    var page_name = (options && options.data && options.data.root) ? options.data.root.name : void 0;
    var site_name = (options && options.data && options.data.root && options.data.root.site) ? options.data.root.site.name : void 0;
    var title;

    if (site_name && page_name) {
        title = (site_name === page_name) ? page_name : page_name + ' | ' + site_name;
    }
    else if (page_name) {
        title = page_name;
    }
    else if (site_name) {
        title = site_name;
    }
    else {
        title = 'Hello World';
    }
    return title;
});

handlebars.registerHelper('cloudinary', function (location, manipulations) {
    var match = /(\/\/res\.cloudinary\.com\/)([a-z_-]+\/)(image\/upload\/)(.+)/i;
    var replacement = '$1$2$3' + manipulations + '/$4';
    if (location && location.search(match !== -1)) {
        location = location.replace(match, replacement);
    }
    return location;
});


// @link http://stackoverflow.com/a/16315366
handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        case 'isEven':
            options = v2;
            return (v1 % 2 === 0) ? options.fn(this) : options.inverse(this);
        case 'isOdd':
            options = v2;
            return (v1 % 2 !== 0) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});


handlebars.registerHelper('obj_key', function (obj, key) {
    return obj[key];
});

module.exports = handlebars;
