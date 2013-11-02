var should = require('should'),
    fs = require('fs'),
    minify = require('../../lib/minify'),
    resolve = require('path')['resolve'];

exports.minifyAllJSTest = function (test) {
    var dirpath = resolve(__dirname, '../../dist/javascripts'),
        outfile = resolve(__dirname, '../out/all_dist.js');
    minify.minifyAllJS(dirpath, outfile, function () {
        test.done();
    }, [/tek\.js$/, /jquery\.js$/,/jquery-ui\.js$/]);
};