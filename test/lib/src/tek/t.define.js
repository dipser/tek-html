var should = require('should'),
    define = require('../../../../lib/src/javascripts/tek/01.define')['define'];

exports.defineTest = function (test) {
    var F1 = define({});
    should.exist(new F1);
    var F2 = define({
        property: {
            val1: 1111,
            getter1: function () {
                var s = this;
                return s.val1 * 2
            }
        }
    });
    var f2 = new F2;
    f2.val1.should.equal(1111);
    f2.getter1().should.equal(2222);
    var F3 = define({
        init: function (data) {
            var s = this;
            s.data = data * 5;
        }
    });
    new F3(11).data.should.equal(55);

    var F4 = define({
        prototype: F3
    });
    new F4(11).data.should.equal(55);
    test.done();
};

exports.addAttrAccessor = function (test) {
    var F1 = define({
        attrAccessor: 'k'
    });
    var f1 = new F1().k("valueOfK");
    f1.k().should.equal("valueOfK");
    f1._k.should.equal("valueOfK");

    var F2 = define({
        attrAccessor: 'k2',
        properties: {
            _k2: 'valueOfK2'
        }
    });
    var f2 = new F2();
    f2._k2.should.equal("valueOfK2");
    f2.k2().should.equal("valueOfK2");
    f2.k2('changed').k2().should.equal("changed");
    test.done();
};