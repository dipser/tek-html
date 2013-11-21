var tek = global['tek'],
    $ = global['$'],
    hbs = global['hbs'];

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
        if (!name) return;
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
                input = input
                    .removeAttr('checked')
                    .filter('[value="' + value + '"]');
                var checkable = input.get(0);
                if (checkable)checkable.checked = true;
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
        var tmpl = hbs.templates['tk-spin'];
        spin = $(tmpl({
            width: size,
            height: size,
            left: (elm.width() - size) / 2,
            top: (elm.height() - size) / 2
        })).appendTo(elm).spin();
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
                                .removeClass('tk-loading')
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
    var tmpl = hbs.templates['tk-editable-label'];
    return $(this).each(function () {
        var input = $(this);
        if (input.data('tk-editable-text')) return;
        input.data('tk-editable-text', true);
        input.addClass('tk-editable-text');
        var label = $(tmpl({})).insertAfter(input)
            .on(trigger, function () {
                input.trigger('tk-editable-text-edit');
            });
        input
            .keypress(function (e) {
                switch (e.keyCode || e.which) {
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
                    var focused = $('.tk-editable-text').filter(':focus').size();
                    if (!focused) {
                        input.last().focus().select();
                    }
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
    var tmpl = hbs.templates['tk-selectable-label'];
    return $(this).each(function () {
        var select = $(this);
        if (select.data('tk-selectable-label')) return;
        select.data('tk-selectable-label', true);
        var
            label = $(tmpl({}))
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
                .attr('data-tk-color-index', selected.prevAll('option').length)
                .show();
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

/**
 * text box with selection
 * @param candidates
 */
exports.selectableText = function (candidates) {
    var ambiguousMatch = tek.string.ambiguousMatch;
    var tml = {
        ul: hbs.templates['tk-selectable-text-list']
    };
    var input = $(this);
    var ul = input.first().after(tml.ul({candidates: candidates})).next('.tk-selectable-text-list').hide();
    ul.childItems = function () {
        return ul.children('.tk-selectable-list-item');
    };
    ul.filterItem = function (searchWord) {
        ul.childItems().each(function () {
            var li = $(this),
                text = li.children('a').text();
            var hit = (text !== searchWord) && ((!searchWord) || ambiguousMatch(searchWord, text));
            hit ? li.show() : li.hide();
        });
        return ul;
    };
    ul.hideList = function () {
        ul.find('.tk-selected').removeClass('tk-selected');
        return ul.hide();
    };
    ul.showList = function (style) {
        return ul.show()
            .css(style)
            .children('li')
            .show();
    };
    setTimeout(function () {
        ul.find('a').click(function () {
            var input = ul.data('tk-selectable-text-active');
            clearTimeout(input.hideTimer);
            var a = $(this);
            input.val(a.text());
            ul.hide();
        });
    }, 10);

    return input
        .attr({
            autocomplete: 'off'
        })
        .each(function () {
            var input = $(this);
            input
                .focus(function () {
                    clearTimeout(input.hideTimer);
                    ul.data('tk-selectable-text-active', input);
                    input.after(ul);
                    var position = input.position();
                    ul
                        .showList({
                            left: position.left,
                            top: position.top + input.outerHeight(true),
                            width: input.outerWidth()
                        });
                    ul.filterItem(input.val());
                })
                .blur(function () {
                    input.hideTimer = setTimeout(function () {
                        ul.hideList();
                    }, 100);
                })
                .keydown(function (e) {
                    clearTimeout(input.hideTimer);
                    var KEY = $.ui.keyCode;
                    var li = ul.children('li'),
                        selected = li.filter('.tk-selected:visible');
                    switch (e.which) {
                        case KEY.ENTER:
                            selected.find('a').click();
                            e.preventDefault();
                            break;
                        case KEY.UP:
                            var prev = selected.prevAll(':visible').not('.tk-selected').first();
                            if (prev.size()) {
                                li.not(prev).removeClass('tk-selected');
                                prev.addClass('tk-selected');
                            } else {
                                ul.hideList();
                            }
                            break;
                        case KEY.DOWN:
                            if (selected.size()) {
                                var next = selected.nextAll(':visible').not('.tk-selected').first();
                                if (next.size()) {
                                    li.not(next).removeClass('tk-selected');
                                    next.addClass('tk-selected');
                                }
                            } else {
                                ul.show();
                                li.filter('tk-selected').removeClass('tk-selected');
                                li.filter(':visible').first().addClass('tk-selected');
                            }
                            break;
                    }
                })
                .textchange(function () {
                    clearTimeout(input.hideTimer);
                    ul.show();
                    ul.filterItem(input.val());
                });
        })
};

/**
 * show fixed element as spy
 */
exports.spyFor = function (elm) {
    if (typeof(elm) === 'string') {
        elm = $(elm);
    }
    var spy = $(this),
        win = $(window);
    if (spy.data('tk-spy')) return spy;
    spy
        .addClass('tk-spy')
        .hide();
    spy.on = function () {
        spy
            .show()
            .data('tk-spy-active', true);
    };
    spy.off = function () {
        spy
            .hide()
            .data('tk-spy-active', false);
    };
    win.scroll(function () {
        var showSpy = elm.height() + elm.offset().top < win.scrollTop();
        var active = spy.data('tk-spy-active');
        if (active) {
            (!showSpy) && spy.off();
        } else {
            showSpy && spy.on();
        }
    });
    return spy;
};

exports.showErrBalloon = function (msg, close_label) {
    var elm = $(this);
    elm.find('.tk-err-balloon').remove();
    var tmpl = {
        balloon: hbs.templates['tk-err-balloon']
    };
    var balloonHTML = tmpl.balloon({
            msg: [].concat(msg),
            close_label: close_label || '[close]'
        }),
        balloon = elm.append(balloonHTML).find('.tk-err-balloon');
    balloon.click(function () {
        balloon.fadeOut(200, function () {
            balloon.remove();
        });
    });
    return elm;
};

/**
 * input with auto format feature
 * @param format
 * @returns {*}
 *
 * available formats
 *   hankaku,zenkaku,hiragana,katakana
 */
exports.autoformatInput = function (format) {
    var string = tek.string;
    var input = $(this);
    input.data('autoformat', format);
    return input.each(function () {
        var input = $(this);
        if (input.data('autoformat-input')) return;
        input.data('autoformat-input', true);
        input.change(function () {
            var input = $(this),
                format = input.data('autoformat'),
                val = input.val();
            if (typeof(format) === 'string') {
                format = format.split(',');
            }
            for (var i = 0, len = format.length; i < len; i++) {
                switch (format[i]) {
                    case 'hankaku':
                        val = string.toHankaku(val);
                        break;
                    case 'zenkaku':
                        val = string.toZenkaku(val);
                        break;
                    case 'hiragana':
                        val = string.toHiragana(val);
                        break;
                    case 'katakana':
                        val = string.toKatakana(val);
                        break;
                    default:
                        console.warn('[tek.view.js]', format[i], 'is not supported for autoformat');
                        break;
                }
            }
            input.val(val);
        });
    });
};

/**
 * search by word
 * @param word
 */
exports.wordSearch = function (word) {
    var ambiguousMatch = tek.string.ambiguousMatch;
    var elm = $(this);
    if (!elm.length) return false;
    if (elm.is('.tk-hit-word')) return false;

    $.wordSearch.restore(elm.find('.tk-hit-word'));

    var hit = false,
        contents = elm.contents(),
        inner = $();


    for (var i = 0, len = contents.length; i < len; i++) {
        var content = contents[i];
        switch (content.nodeType) {
            case 3:
                var match = ambiguousMatch(word, content.nodeValue);
                if (match) {
                    var span = $.wordSearch.hitElement(match);
                    content.parentNode.replaceChild(span, content);
                    hit = true;
                }
                break;
            default:
                inner = inner.add(content);
                break;

        }
    }
    return inner.wordSearch(word) || hit;
};

/**
 * make table sortable by click th in thead
 * @returns {*|jQuery|HTMLElement}
 */
exports.sortableTable = function (callback) {
    var table = $(this),
        thead = table.find('thead'),
        tbody = table.find('tbody');

    var bodyTr = tbody.find('tr');

    bodyTr
        .each(function (row) {
            var tr = $(this);
            tr
                .data('tk-row', row)
                .find('th,td').each(function (col) {
                    $(this).addClass('tk-col-' + col);
                });
        });
    thead
        .find('th')
        .addClass('tk-sortable-th')
        .each(function (col) {
            var th = $(this);
            th.data('col', col);
            if (!th.find('label').size()) {
                var msg = '[tek.view.js] Thead th should contain label for sortable table.';
                msg += 'tek.view.js complete it, but, consider prepare before rendering, for performance reasons.';
                console.warn(msg);
                th.wrapInner('<label/>');
            }
            if (!th.data('tek-sortable-th')) {
                th.data('tek-sortable-th', true);
                th.click(function () {
                    var th = $(this),
                        asc = eval(th.attr('data-tk-asc') || 'false'),
                        col = th.data('col');
                    th.siblings('[data-tk-asc]').removeAttr('data-tk-asc');
                    bodyTr
                        .each(function (i) {
                            var tr = $(this),
                                td = tr.find('.tk-col-' + col);
                            tr
                                .data('tk-sort-value', td.text() || '')
                                .data('tk-row', i);
                        })
                        .sort(function (a, b) {
                            var $1 = $(a);
                            var $2 = $(b);
                            var v1 = $1.data('tk-sort-value'),
                                v2 = $2.data('tk-sort-value');
                            var sorted = v1.localeCompare(v2) * (asc ? 1 : -1);
                            if (sorted) {
                                return  sorted;
                            } else {
                                return ($2.data('tk-row') - $1.data('tk-row')) * (asc ? 1 : -1);
                            }
                        })
                        .appendTo(tbody);
                    th.attr('data-tk-asc', !asc);
                    callback && callback(col, asc);
                });
            }
        });
    return table;
};

/**
 * ajax file upload
 * @param url
 * @param data (extra data to submit. use format of $.fn.serializeArray)
 * @param callback
 * @returns {*|jQuery}
 */
exports.uploadFileInput = function (url, data, callback) {
    if ($.isFunction(data)) {
        callback = data;
        data = [];
    }
    var tmpl = {
        workDiv: hbs.templates['tk-upload-work-div']
    };
    return $(this).change(function () {
        var file = $(this);
        var work_id = 'tk-upload-work-' + new Date().getTime();
        var workDiv = $(tmpl.workDiv({
            work_id: work_id,
            action: url,
            data: [].concat(data).filter(function (data) {
                return !!data;
            })
        })).insertBefore(file);
        var form = workDiv.find('form'),
            iframe = workDiv.find('iframe');
        form.append(file);
        iframe.load(function () {
            setTimeout(function () {
                var data;
                try {
                    var json = $(iframe.contents()).find('body').html();
                    data = JSON.parse(json);
                } catch (e) {
                    console.error('[tek.view.js]failed to parse upload response.');
                }
                workDiv.after(file).remove();
                callback && callback(data);
            }, 1);
        });
        form.submit();
    });
};
/**
 * drop upload file input
 * @param url
 * @param name
 * @param msg
 * @param callback
 * @returns {*|jQuery}
 */
exports.dropUploadInput = function (url, name, msg, callback) {
    var tmpl = hbs.templates['tk-drop-upload-form'];
    var data = $.extend({
        msg: ['drop', 'file', 'here'].join('<br/>')
    }, {
        action: url,
        name: name,
        msg: msg
    });
    return $(this)
        .html(tmpl(data))
        .find('form').each(function () {
            var form = $(this),
                action = form.attr('action'),
                file = form.find(':file');
            file
                .on('dragover', function () {
                    form.addClass('tk-drop-ready');
                })
                .on('dragleave', function () {
                    form.removeClass('tk-drop-ready');
                })
                .on('change', function () {
                    form.addClass('tk-loading').showSpin();
                })
                .uploadFileInput(action, function (data) {
                    form.removeClass('tk-drop-ready');
                    form.removeClass('tk-loading').removeSpin();
                    callback && callback(data);
                });
        });
};

/**
 * move a element from one to another by dragging
 */
exports.transferable = function (draggable) {
    $(draggable)
        .draggable({

            revert: "invalid"
        })
        .addClass('tk-transferable-item');
    return $(this)
        .not('.tk-transferable')
        .addClass('tk-transferable')
        .droppable({
            accept: '.tk-transferable-item',
            hoverClass: 'tk-transferable-drop-ready',
            drop: function (e, ui) {
                var droppable = $(this),
                    draggable = $(ui.draggable);
                droppable.append(draggable);
                draggable.removeAttr('style');
                droppable.trigger('tk-transfer', [draggable]);
            }
        });
};