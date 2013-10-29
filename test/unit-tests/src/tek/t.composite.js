/**
 * Created by okunishitaka on 9/28/13.
 */


var should = require('should'),
    composite = require('../../../../lib/src/javascripts/tek.js/07.composite.js')['composite'];

exports.compositeTest = function (test) {
    var composition = composite(function () {
        return 1;
    }, function () {
        return 2;
    }, null, undefined)();
    composition.should.be.lengthOf(4);
    composition[0].should.equal(1);
    composition[1].should.equal(2);
    test.done();
};