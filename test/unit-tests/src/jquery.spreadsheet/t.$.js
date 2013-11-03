require('../../../../lib/src/jquery.spreadsheet.js.dependency.js');
var should = require('should'),
    $ = require('../../../../lib/src/javascripts/jquery.spreadsheet.js/01.$.js'),
    spreadsheet = $.spreadsheet;


exports.HeadDataTest = function (test) {
    var html = new spreadsheet.HeadData("a,b,c,d".split(',')).toHTML();
    should.exist(html);
    test.done();
};
exports.RowDataTest = function (test) {
    var html = new spreadsheet.RowData('h', "a,b,c,d".split(',')).toHTML();
    should.exist(html);
    test.done();
};