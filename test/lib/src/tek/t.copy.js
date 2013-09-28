/**
 * User: okunishitaka
 * Date: 9/16/13
 * Time: 3:39 PM
 */

var should = require('should'),
    copy = require('../../../../lib/src/javascripts/tek.js/08.copy.js')['copy'];

exports.copy = function (test) {
    var src1 = {
            a: 1,
            b: 2
        },
        dst1 = {a: 3};
    copy(src1, dst1);
    dst1.should.have.property('a', 1);
    dst1.should.have.property('b', 2);

    var src2 = ['c', 'd'],
        dst2 = ['e'];
    copy(src2, dst2);
    dst2.should.be.lengthOf(2);
    dst2[0].should.equal('c');
    test.done();
};

exports.deepCopy = function (test) {
    var src1 = {
            a: 1,
            b: 2,
            c: {
                d: 3,
                e: 4
            },
            f: [
                5, 6, 7
            ]
        },
        dst1 = {a: 3};
    copy.deep(src1, dst1);
    dst1.should.have.property('a', 1);
    dst1['c'].should.have.property('d', 3);
    dst1['f'].should.be.lengthOf(3);
    test.done();
};
