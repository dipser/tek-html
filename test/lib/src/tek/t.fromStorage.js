/**
 * User: okunishitaka
 * Date: 9/27/13
 * Time: 8:07 PM
 */
var should = require('should'),
    fromStorage = require('../../../../lib/src/javascripts/t/05.fromStorage')['fromStorage'];


localStorage = null;
exports.fromStorageTest = function (test) {
    localStorage = {
        getItem: function (key) {
            return '{"k":2,"j":"3"}';
        }
    };
    var item = fromStorage('');
    item.should.have.property('k', 2);
    item.should.have.property('j', "3");
    test.done();
};
