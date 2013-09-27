/**
 * User: okunishitaka
 * Date: 9/27/13
 * Time: 8:03 PM
 */

var should = require('should'),
    Query = require('../../../../lib/src/javascripts/t/03.Query')['Query'];

location = {
    search: '?key1=val1&key2=val2'
};
exports.QueryTest = function (test) {
    var query = new Query('key1=val1&key2=val2');
    query.should.have.property('key1', 'val1');
    query.should.have.property('key2', 'val2');
    test.done();
};

exports.fromLocationTest = function (test) {
    var query = Query.fromLocation();
    query.should.have.property('key1', 'val1');
    query.should.have.property('key2', 'val2');
    test.done();
};