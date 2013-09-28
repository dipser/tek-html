/**
 * Created by okunishitaka on 9/28/13.
 */

var should = require('should'),
    publish = require('../../lib/publish'),
    resolve = require('path')['resolve'];


exports.publishTest = function (test) {
    var out = resolve(__dirname, '../out');
    publish("tek.js", out, function () {

        test.done();
    });
};