/**
 * Created by okunishitaka on 10/19/13.
 */

(function ($) {
    $(function () {
        var body = $(document.body),
            win = $(window);

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
            strictEqual(values['text03'], undefined);
            strictEqual(values['text04'], "0");

            var obj = values.toObj();
            console.log(obj);

            ok(!values['undefined']);
        });
        test("$.fn.setFormValue", function () {
            var form = $('#section01').findByAttr('name', 'some-form');
            form.setFormValue({
                "checkbox01": "checkbox-value02"
            });
            var values = form.getFormValue();
            strictEqual(values['checkbox01'], 'checkbox-value02', 'checkbox');
        });

        test('$.fn.spyFor', function () {
            var spy = $('#spy');
            spy.spyFor('#spy-for');
            ok(spy.is(':hidden'));
            win.scrollTop(500).scroll();
            ok(!spy.is(':hidden'));
        });

        asyncTest("$.fn.textchange", function () {
            var form = $('#section01').findByAttr('name', 'some-form'),
                text = form.find(':text').eq(0);
            expect(1);
            text.textchange(function (text) {
                equal(text, "change-text", 'text changed');
                start();
            }, 30);
            text.val('change-text');
        });

        asyncTest("$.fn.spin", function () {
            var form = $('#section01').findByAttr('name', 'some-form');
            expect(2);
            form.showSpin();
            setTimeout(function () {
                strictEqual(form.find('.tk-spin').size(), 1, 'spin');
                form.removeSpin();
                setTimeout(function () {
                    strictEqual(form.find('.tk-spin').size(), 0, 'spin');
                    start();
                }, 10);
            }, 10);
        });

        test("$.fn.editableText", function () {
            var editableText = body.findByRole('editable-text');
            ok(!editableText.data('tk-editable-text'), 'binding');
            editableText.editableText();
            editableText.editableText();
            ok(editableText.data('tk-editable-text'), 'binding');
        });

        test("$.fn.selectableLabel", function () {
            var selectableLabel = body.findByRole('selectable-label');
            ok(!selectableLabel.data('tk-selectable-label'));
            selectableLabel.selectableLabel();
            selectableLabel.selectableLabel();
            ok(selectableLabel.data('tk-selectable-label'));
            selectableLabel.next('.tk-selectable-label').click();
            selectableLabel.change();
        });

        test("$.confirmRemove", function () {
            $.confirmRemove();
            var dialog = $('#tk-confirm-dialog'),
                submit = dialog.find(':submit');
            strictEqual(submit.attr('disabled'), 'disabled', 'btn disabled at first');
            dialog.find('label').click();
            ok(!submit.attr('disabled'));
            dialog.find('label').click();
            strictEqual(submit.attr('disabled'), 'disabled', 'btn disabled at first');
            dialog.find('label').click();
            submit.click();
            ok(dialog.is(':hidden'));
        });


        asyncTest("$.fn.selectableText", function () {
            var selectableText = body.findByRole('selectable-text').val('').selectableText(
                'りんご,ばなな,みかん'.split(',')
            ).first();
            var ul = $('.tk-selectable-text-list', body);
            strictEqual(ul.size(), 1, 'create list');
            var li = ul.find('li');
            strictEqual(li.size(), 3, 'create list content');

            selectableText.focus();
            ok(ul.is(':visible'), 'show list on focus');

            selectableText.blur();
            setTimeout(function () {
                ok(ul.is(':hidden'), 'hide when blur');
                selectableText.focus();
                selectableText.val('ん');
                strictEqual(li.filter(':visible').size(), 3);
                li.filter(':visible').find('a').first().click();
                strictEqual(selectableText.val(), 'りんご');
                start();
            }, 500);
        });

        test('$.getQuery', function () {
            var q = $.getQuery();
            ok(!!q);
        });

        test('$.sorryNoSupport', function () {
            $.sorryNoSupport();
            equal($('#tk-no-support-dialog').size(), 1);
            $.sorryNoSupport();
            equal($('.tk-no-support-dialog').size(), 1);
            $('.tk-no-support-dialog').remove();
        });

        test('$.confirmLeave', function () {
            ok(!!$.confirmLeave);
            $.confirmLeave("sure to leave?");
            $.confirmLeave(false);
            ok(!!$.confirmLeave);
        });

        test('$.showErrBalloon', function () {
            var form = $('form').first();
            form.css({
                position: 'relative'
            });
            form.showErrBalloon([
                'username is required',
                'password is required'
            ]);
            var balloon = $('.tk-err-balloon', form);
            equal(balloon.size(), 1);
        });

        test('$.autoformatInput', function () {
            var form = $('form[name="some-form"]').first();
            var hiragana = form.findByAttr('data-autoformat', 'hiragana').autoformatInput('hiragana');
            hiragana.val('あイう１２３').change();
            equal(hiragana.val(), 'あいう１２３');

            var katakana = form.findByAttr('data-autoformat', 'katakana').autoformatInput('katakana');
            katakana.val('あイう１２３').change();
            equal(katakana.val(), 'アイウ１２３');

            var hankaku = form.findByAttr('data-autoformat', 'hankaku').autoformatInput('hankaku');
            hankaku.val('あイう１２３').change();
            equal(hankaku.val(), 'あイう123');

            var zenkaku = form.findByAttr('data-autoformat', 'zenkaku').autoformatInput('zenkaku');
            zenkaku.val('あイう１２３1456abcDEF').change();
            equal(zenkaku.val(), 'あイう１２３１４５６ａｂｃＤＥＦ');

        });

        test('$.scrollToTop', function () {
            location.href = '#section01';
            $.scrollToTop();
            ok(true);
        });

        test('$.word-Search', function () {
            $('#word-search-input').textchange(function () {
                $('#search-table').wordSearch($(this).val())
            }).val('02').change();
            ok(true);
        });

        test('$.sortableTable', function () {
            var table = $('#search-table').sortableTable();
            var th = table.find('thead th');
            th.eq(2).click();
            ok(true);
        });

        test('$.fn.dropUploadInput', function () {
            $('#drop-upload-input').dropUploadInput('', 'new-file');
            ok(true);
        });
    });
})(jQuery);
