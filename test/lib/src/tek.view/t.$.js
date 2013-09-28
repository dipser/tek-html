require('../../../../lib/src/tek.view.js.dependency');
var should = require('should'),
    $ = require('../../../../lib/src/javascripts/tek.view.js/01.$.js');


exports.FormValueTest = function (test) {
    var formValue = new $.FormValue({k1: 1, k2: 2, i: {i1: 11, i2: 22}});
    console.log(formValue.toObj());
    test.done();
};