var resolve = require('path')['resolve'];


var ditDir = resolve(__dirname, '../../dist/javascripts');
global.tek = require(resolve(ditDir, 'tek.js'));