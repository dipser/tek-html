/**
 * User: okunishitaka
 * Date: 9/27/13
 * Time: 8:07 PM
 */
var should = require('should'),
    toStorage = require('../../../../lib/src/javascripts/tek.js/04.toStorage')['toStorage'];


localStorage = null;
exports.toStorageTest = function (test) {
    localStorage = {
        setItem: function (key, string) {
            string.should.equal('{"k":2,"j":"3"}');
            key.should.equal('item1')
        }
    };
    toStorage('item1', {k: 2, j: "3"});
    test.done();
};
