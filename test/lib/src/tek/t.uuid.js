/**
 * User: okunishitaka
 * Date: 9/27/13
 * Time: 8:02 PM
 */

var should = require('should'),
    uuid = require('../../../../lib/src/javascripts/tek/02.uuid')['uuid'];

exports.uuidTest = function (test) {
    for (var i = 0; i < 1000; i++) {
        uuid().should.not.equal(uuid());
    }
    test.done();
};
