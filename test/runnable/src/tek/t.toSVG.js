/**
 * Created by okunishitaka on 9/29/13.
 */

var should = require('should'),
    toSVG = require('../../../../lib/src/javascripts/tek.js/12.toSVG')['toSVG'];
Blob = function () {

};
exports.toSVGTest = function (test) {
    should.exist(toSVG("<div><h1>ho!</h1></div>"), 100, 100);
    test.done();
};
