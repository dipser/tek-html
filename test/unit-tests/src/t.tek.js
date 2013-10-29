/**
 * Created by okunishitaka on 9/28/13.
 */

var should = require('should'),
    index = require('../../../lib/src/javascripts/tek.js/index');

exports.toStringTest = function (test) {
    should.exist(index.toString());
    test.done();
};