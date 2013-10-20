/**
 * Created by okunishitaka on 10/20/13.
 */
var $ = jQuery;
$(function () {
    var doc = $(document);

    var KEY = $.ui.keyCode;

    function keydown(elm, keycode) {
        var e = $.Event('keydown');
        e.keyCode = keycode;
        elm.trigger(e);
    }

    test('select', function () {
        var item = $('.tv-item');
        item.first().click();
        ok(item.first().hasClass('tv-selected'), 'select item');
        keydown(doc, KEY.RIGHT);
        ok(item.eq(1).hasClass('tv-selected'), 'select child with right key');
        keydown(doc, KEY.DOWN);
        ok(item.eq(2).hasClass('tv-selected'), 'select next with down key');
        keydown(doc, KEY.UP);
        ok(item.eq(1).hasClass('tv-selected'), 'select prev with up key');
        keydown(doc, KEY.LEFT);
        ok(item.eq(0).hasClass('tv-selected'), 'select parent with left key');
        keydown(doc, KEY.DOWN);
        ok(item.eq(1).hasClass('tv-selected'), 'select next with down key');
        keydown(doc, KEY.UP);
        ok(item.eq(0).hasClass('tv-selected'), 'select parent with up key');

    });
});