var resolve = require('path')['resolve'];


var distDir = resolve(__dirname, '../../dist/javascripts');
global.tek = require(resolve(distDir, 'tek.js'));
global.hbs = require('Handlebars');
global.$ = require('cheerio');