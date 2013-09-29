/**
 * Created by okunishitaka on 9/29/13.
 */

var should = require('should'),
    unique = require('../../../../lib/src/javascripts/tek.js/13.unique')['unique'];

exports.uniqueTest = function (test) {
    unique([1, 2, 3, 1]).should.be.lengthOf(3);
    unique(1, 2, 3, 1).should.be.lengthOf(3);
    test.done();
};