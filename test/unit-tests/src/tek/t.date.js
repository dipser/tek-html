/**
 * Created by okunishitaka on 11/5/13.
 */

var should = require('should'),
    date = require('../../../../lib/src/javascripts/tek.js/15.date')['date'];

exports.toUTC = function (test) {
    date.toUTC(new Date('2013/11/05')).should.equal(1383609600000);
    test.done();
}