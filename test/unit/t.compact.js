var should = require('should'),
    compact = require('../../lib/compact');

exports.compact = function (test) {
    compact(__dirname + '/../mock/index.html',
        __dirname + '/../out');
    test.done();
};