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

    var item = $('.tv-item');
    test('select', function () {
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

    test('enter', function () {
        keydown(doc, KEY.ENTER);
        ok(item.eq(0).hasClass('tv-closed'), 'close item');
        keydown(doc, KEY.ENTER);
        ok(!item.eq(0).hasClass('tv-closed'), 'reopen item');
    });
});