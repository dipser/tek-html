/**
 * User: okunishitaka
 * Date: 9/27/13
 * Time: 8:16 PM
 */
var should = require('should'),
    math = require('../../../../lib/src/javascripts/tek.js/06.math');

exports.maxTest = function (test) {
    var max = math.max;
    max(3, 1, 4).should.equal(4);
    max([3, 1, 4]).should.equal(4);
    test.done();
};


exports.minTest = function (test) {
    var min = math.min;
    min(3, 1, 4).should.equal(1);
    min([3, 1, 4]).should.equal(1);
    test.done();
};

exports.sumTest = function (test) {
    var sum = math.sum;
    sum(1, 2, 3).should.equal(6);
    sum([1, 2, 3]).should.equal(6);
    test.done();
};

exports.averageTest = function (test) {
    var average = math.average;
    average([1, 2, 3]).should.equal(2);
    average(1, 2, 3).should.equal(2);
    test.done();
};