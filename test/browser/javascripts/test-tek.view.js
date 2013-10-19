/**
 * Created by okunishitaka on 10/19/13.
 */

(function ($) {
    $(function () {
        test("$.fn.findByAttr", function () {
            var form = $('#section01').findByAttr('name', 'some-form');
            strictEqual(form.size(), 1, "findByAttr");
        });
        test("$.fn.findByName", function () {
            var form = $('#section01').findByName('some-form');
            strictEqual(form.size(), 1, "findByName");
        });
        test("$.fn.findByRole", function () {
            var btn = $('#section01').findByRole('submit-btn');
            strictEqual(btn.size(), 1, "findByRole");
        });

    });
})(jQuery);
