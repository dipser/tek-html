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
        test("$.fn.getFormValue", function () {
            var values = $('#section01').findByAttr('name', 'some-form').getFormValue();
            strictEqual(values['radio01'], "radio-value01", 'radio');
            strictEqual(values['checkbox01'][0], 'checkbox-value01', 'checkbox');
            strictEqual(values['checkbox01'][1], 'checkbox-value03', 'checkbox');
            strictEqual(values['radio01'], 'radio-value01', 'radio');
            strictEqual(values['select01'], 'select-value02', 'select');
            strictEqual(values['textarea01'], 'text-content', 'textarea');
        });
        test("$.fn.setFormValue", function () {
            var form = $('#section01').findByAttr('name', 'some-form');
            form.setFormValue({
                "checkbox01": "checkbox-value02"
            });
            var values = form.getFormValue();
            strictEqual(values['checkbox01'], 'checkbox-value02', 'checkbox');
        });

        asyncTest("$.fn.textchange", function () {
            var form = $('#section01').findByAttr('name', 'some-form'),
                text = form.find(':text');
            text.textchange(function (text) {
                equal(text, "change-text", 'text changed');
                start();
            }, 30);
            text.val('change-text');
        });
    });
})(jQuery);
