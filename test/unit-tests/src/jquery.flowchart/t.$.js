require('../../../../lib/src/jquery.flowchart.js.dependency.js');
var should = require('should'),
    $ = require('../../../../lib/src/javascripts/jquery.flowchart.js/01.$.js'),
    fc = $.flowchart;

exports.pTest = function (test) {
    var p = fc.p;
    p('item').should.equal('fc-item');
    fc.settings.update({prefix: 'tt'});
    p('item').should.equal('tt-item');
    fc.settings.update({prefix: 'fc'});
    test.done();
};

exports.ItemTest = function (test) {
    var Item = fc['Item'];

    var item = new Item().content('<span>flow01</span>');
    var html = item.toHTML();
    should.exist(html);
    test.done();
};

exports.toAttrStringsTest = function (test) {
    var toAttrStrings = fc.toAttrStrings;
    toAttrStrings({
        key1: 'val1',
        key2: 'val2'
    }).should.be.lengthOf(2);
    test.done();
};

exports.createHTMLTest = function (test) {
    var html = fc.createHTML('canvas', '', {width: 300, height: 200});
    html.should.equal('<canvas width="300" height="200" ></canvas>');
    test.done();
};