require('../../../../lib/src/tek.view.js.dependency');
var should = require('should'),
    $ = require('../../../../lib/src/javascripts/tek.view.js/01.$.js');


exports.FormValueTest = function (test) {
    var formValue = new $.FormValue({
        k1: "1", i: {i1: 11, i2: 22},
        "namespace.name": "234"
    });
    should.exist(formValue);
    var obj = formValue.toObj();
    obj.k1.should.equal("1");
    obj.namespace.should.have.property('name', "234");
    test.done();
};

exports.parseJSONSafelyTest = function (test) {
    var warn = console.warn;
    console.warn = function (msg) {
        should.exist(msg);
    };
    $.parseJSONSafely('[1,2,3]').should.be.lengthOf(3);
    should.not.exist($.parseJSONSafely('[1,'));
    console.warn = warn;
    test.done();
};