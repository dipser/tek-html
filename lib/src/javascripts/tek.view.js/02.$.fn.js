var $ = global['$'];

/**
 * find element by attribute
 * @param key
 * @param val
 * @returns {*}
 */
exports.findByAttr = function (key, val) {
    var condition = {};
    if (arguments.length === 1) {
        condition = arguments[0]
    } else {
        condition[key] = val;
    }
    var selector = '';
    Object.keys(condition).forEach(function (key) {
        selector += ['[', key, '="', condition[key], '"]'].join('')
    });
    return $(this).find(selector);
};


/**
 * find element by name attribute
 * @param name
 * @returns {*}
 */
exports.findByName = function (name) {
    return $(this).findByAttr('name', name);
};

/**
 * find element by name data-role
 * @param role
 * @returns {*}
 */
exports.findByRole = function (role) {
    return $(this).findByAttr('data-role', role);
};


/**
 * get form value
 * @returns {$.FormValue}
 */
exports.getFormValue = function () {
    var form = $(this),
        result = new $.FormValue;
    form.find('input,select,textarea').each(function () {
        var s = this,
            input = $(this),
            type = input.attr('type');
        switch (type) {
            case 'radio':
            case 'checkbox':
                if (!s.checked) return;
                break;
        }
        var name = input.attr('name'),
            val = input.val();
        result.addValue(name, val);
    });
    return result;
};


/**
 * set form value
 * @param values
 * @param namespace
 */
exports.setFormValue = function (values, namespace) {
    var form = $(this);
    for (var name in values) {
        if (!values.hasOwnProperty(name)) continue;
        if (namespace) name = [namespace, name].join('.');
        var value = values[name];
        if (typeof(value) === 'object') {
            form.setFormValue(value, name);
        } else {
            var input = form.findByName(name);
            if (input.is(':checkbox,:radio')) {
                input
                    .removeAttr('checked')
                    .filter('[value="' + value + '"]').attr({
                        checked: 'checked'
                    });
            } else {
                input.val(value);
            }
        }

    }
};


/**
 * capture text change in real time
 * @param callback
 * @param interval
 * @returns {*}
 */
exports.textchange = function (callback, interval) {
    return $(this).each(function () {
        var text = $(this),
            val = text.val(),
            timer = text.data('textchange-timer');
        if (timer) {
            clearInterval(timer);
        } else {
            text
                .on('textchange', function () {
                    callback.call(text, text.val());
                })
                .on('clear-textchange', function () {
                    var timer = text.data('textchange-timer');
                    clearInterval(timer);
                });
        }
        timer = setInterval(function () {
            var changed = val !== text.val();
            if (changed) {
                val = text.val();
                text.trigger('textchange');
            }
        }, interval || 300);
        text.data('textchange-timer', timer);

    });
};


/**
 * create spin
 * @param opts
 * @returns {*}
 */
exports.spin = function (opts) {
    if (!window.Spinner) {
        console.error('[jquery.tek.js] needs spin.js to use spin');
        return this;
    }
    return $(this).each(function () {
        var $this = $(this).addClass('tk-spin'),
            data = $this.data();
        if (data.spinner) {
            data.spinner.stop();
            delete data.spinner;
        }
        if (opts !== false) {
            opts = $.extend({
                color: $this.css('color'),
                lines: 11,
                length: 4,
                width: 2,
                radius: 4

            }, opts);
            data.spinner = new Spinner(opts)
                .spin(this);
        }
    });
};


/**
 * show spin
 * @param size
 * @returns {*|HTMLElement}
 */
exports.showSpin = function (size) {
    if (!size) size = 16;
    var elm = $(this),
        spin = $('.tk-spin', elm);
    if (!spin.size()) {
        spin = $('<div/>').css({
            width: size,
            height: size,
            position: 'absolute',
            left: (elm.width() - size) / 2,
            top: (elm.height() - size) / 2
        }).appendTo(elm).spin();
    }
    spin.show();
    return elm;
};


/**
 * remove spin
 * @returns {*|HTMLElement}
 */
exports.removeSpin = function () {
    $('.tk-spin', this).remove();
    return $(this);
};


/**
 * form for ajax
 * @param callback
 * @param delay
 * @returns {*}
 */
exports.ajaxForm = function (callback, delay) {
    return $(this).each(function () {
            var form = $(this),
                action = form.attr('action'),
                method = form.attr('method');
            form.submit(function (e) {
                e.preventDefault();
                var timer = form.data('tk-submit-timer');
                if (timer) clearTimeout(timer);
                var value = form.getFormValue();
                form.showSpin(16)
                    .addClass('tk-loading');
                timer = setTimeout(function () {
                    $.ajax({
                        type: method,
                        url: action,
                        data: value.toObj(),
                        success: function (data) {
                            callback && callback.call(form, data);
                        },
                        complete: function () {
                            form
                                .removeClass('bkr-loading')
                                .removeSpin();

                        }
                    });
                }, delay || 300);
                form.data('tk-submit-timer', timer);
            });
        }
    )
        ;
}
;


/**
 * render text input as editable-text
 * @param trigger
 * @returns {*}
 */
exports.editableText = function (trigger) {
    if (!trigger) trigger = 'click';
    var KEY_CODE = $.ui.keyCode;
    return $(this).each(function () {
        var input = $(this);
        if (input.hasClass('tk-editable-text')) return;
        input.addClass('tk-editable-text');
        var label = $('<label class="tk-editable-label"/>')
            .insertAfter(input)
            .on(trigger, function () {
                input.trigger('tk-editable-text-edit');
            });
        input
            .keypress(function (e) {
                switch (e.keyCode) {
                    case KEY_CODE.ENTER:
                    case KEY_CODE.TAB:
                        if (input.is('textarea')) {
                            if (e.shiftKey || e.metaKey || e.altKey) {
                                input.change();
                                e.stopImmediatePropagation();
                            }
                        } else {
                            input.change();
                            e.stopImmediatePropagation();
                        }
                        break;
                }
            })
            .on('tk-editable-text-edit', function () {
                input.show();
                setTimeout(function () {
                    input.focus().select();
                }, 20);
                label.hide();
            })
            .on('tk-editable-text-fix', function () {
                var val = input.val();
                if (!val) return;
                input.hide();
                label.text(val).show();
            })
            .change(function () {
                input.trigger('tk-editable-text-fix');
            });
        if (input.val()) input.change();
    });
};


/**
 * render select element as selectable-label
 * @param trigger
 * @returns {*}
 */
exports.selectableLabel = function (trigger) {
    if (!trigger) trigger = 'click';
    return $(this).each(function () {
        var select = $(this),
            label = $('<label class="tk-selectable-label"/>')
                .insertAfter(select);
        label
            .on(trigger, function () {
                select.show();
                label.hide();
            });
        select.change(function () {
            var selected = $('option:selected', select),
                text = selected.text();
            if (!text) return;
            label.text(text)
                .attr('data-color', selected.prevAll('option').length);
            select.hide();
        }).change();
    });
};


/**
 * add open-up animation
 */
exports.openUp = function () {
    var elm = $(this),
        height = elm.height();
    elm
        .show()
        .height(0)
        .animate({
            height: height
        }, function () {
            elm.removeAttr('style');
        });
};


/**
 * add close-down animation
 */
exports.closeDown = function () {
    var elm = $(this);
    elm.animate({
        height: 0,
        paddingTop: 0,
        paddingBottom: 0
    }, function () {
        elm
            .removeAttr('style')
            .hide();
    });
};

/**
 * render html by handlebars
 * @param tmpl
 * @param data
 * @returns {*}
 */
exports.htmlHandlebars = function (tmpl, data) {
    return this.each(function () {
        var html = $.renderHandlebars(tmpl, data);
        $(this).html(html);
    });
};


/**
 * render and append handlebars
 * @param tmpl
 * @param data
 * @returns {*}
 */
exports.appendHandlebars = function (tmpl, data) {
    return this.each(function () {
        var html = $.renderHandlebars(tmpl, data);
        $(this).append(html);
    });
};