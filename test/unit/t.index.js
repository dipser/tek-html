/**
 * Created by okunishitaka on 9/28/13.
 */
var should = require('should'),
    index = require('../../lib/index');

exports.indexTest = function(test)
{
    should.exist(index.compact);
    should.exist(index.publish);
    test.done();
}
