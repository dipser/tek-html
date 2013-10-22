require('../../../../lib/src/jquery.treeview.js.dependency.js');
var should = require('should'),
    $ = require('../../../../lib/src/javascripts/jquery.treeview.js/01.$.js'),
    tv = $.treeview;

exports.pTest = function (test) {
    var p = tv.p;
    p('item').should.equal('tv-item');
    tv.settings.update({prefix: 'tt'});
    p('item').should.equal('tt-item');
    tv.settings.update({prefix: 'tv'});
    test.done();
};

exports.ItemTest = function (test) {
    var Item = tv['Item'];

    var item = new Item().content('<span>abc</span>').children([
        new Item('def'),
        new Item().content('ghi')
    ]);
    should.exist(item.toHTML());
    test.done();
};