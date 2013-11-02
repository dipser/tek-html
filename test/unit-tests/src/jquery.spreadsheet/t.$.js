require('../../../../lib/src/jquery.spreadsheet.js.dependency.js');
var should = require('should'),
    $ = require('../../../../lib/src/javascripts/jquery.spreadsheet.js/01.$.js'),
    spreadsheet = $.spreadsheet;


exports.HeadDataTest = function (test) {
    var html = new spreadsheet.HeadData("a,b,c,d".split(',')).toHTML();
    html.should.equal('<tr><th></th><th>a</th><th>b</th><th>c</th><th>d</th></tr>');
    test.done();
};
exports.RowDataTest = function (test) {
    var html = new spreadsheet.RowData('h', "a,b,c,d".split(',')).toHTML();
    html.should.equal('<tr><th>h</th><th>a</th><th>b</th><th>c</th><th>d</th></tr>');
    test.done();
};