var tek = global['tek'],
    hbs = global['hbs'],
    $ = global['$'];

/**
 * form value object
 * @type {tek.define|*}
 */
exports.FormValue = tek.define({
    init: function (values) {
        var s = this;
        for (var name in values) {
            if (!values.hasOwnProperty(name)) continue;
            s[name] = values[name];
        }
    },
    properties: {
        addValue: function (name, val) {
            var s = this;
            if (s.hasOwnProperty(name)) {
                var isArray = s[name] instanceof Array;
                if (!isArray) {
                    s[name] = [s[name]];
                }
                s[name].push(val);
            } else {
                s[name] = val;
            }
        },
        toObj: function () {
            var s = this,
                result = {};

            function findInjectable(dst, key) {
                while (key.match(/\./)) {
                    var prop = key.match(/([^\.]*)\./)[1];
                    if (!dst[prop]) dst[prop] = {};
                    dst = dst[prop];
                    key = key.replace(/[^\.]*\./, '');
                }
                return dst;
            }

            for (var key in s) {
                if (!s.hasOwnProperty(key)) continue;
                var value = s[key];
                var dst = findInjectable(result, key);
                key = key.split('.').pop();
                if (dst[key]) {
                    var isArray = dst[key] instanceof Array;
                    if (!isArray) {
                        dst[key] = [dst[key]];
                    }
                    dst[key].push(value);
                } else {
                    dst[key] = value;
                }
            }
            return result;
        }
    }
});

/**
 * render Handlebars template
 * @param tmpl
 * @param data
 * @returns {string}
 */
exports.renderHandlebars = function (tmpl, data) {
    if (typeof(tmpl) === 'string') {
        tmpl = hbs['templates'][tmpl];
    }
    if (!$.isArray(data)) {
        data = [data];
    }
    var html = '';
    data && data.forEach(function (data) {
        html += tmpl(data);
    });
    return html;
};

/**
 * parse JSON safely.
 * when failed to parse, put warning and close quietly.
 */
exports.parseJSONSafely = function (string) {
    if (!string) return string;
    try {
        return JSON.parse(string);
    } catch (e) {
        console.warn && console.warn('[tek.view.js] failed to parse string: "' + string + '"');
        return null;
    }
};

/**
 * show confirm dialog to remove something
 * @param data
 * @param callback
 */
exports.confirmRemove = function (data, callback) {
    var body = document.body;
    $('#tk-confirm-dialog', body).remove();

    var tmpl = hbs.templates['tk-confirm-dialog'];
    data = $.extend({
        title: 'Are you ABSOLUTELY sure?',
        sub_title: 'One this done, there will be no way to go back.',
        check_label: 'I understand consequences.',
        btn_label: 'do it!'
    }, data);
    var html = tmpl(data);

    var dialog = $(html).appendTo(body),
        inner = $('.tk-confirm-dialog-inner', dialog),
        form = dialog.find('form'),
        cancelBtn = form.find('.tk-confirm-dialog-close-btn'),
        submit = form.find(':submit');

    cancelBtn.click(function () {
        dialog.fadeOut(100, function () {
            dialog.remove();
        });
    });
    dialog.click(function () {
        cancelBtn.click();
    });
    inner.click(function (e) {
        e.stopPropagation();
    });
    var check = $('#tk-confirm-dialog-check', form).change(function () {
        if (check[0].checked) {
            submit.removeAttr('disabled');
        } else {
            submit.attr('disabled', 'disabled');
        }
    });
    form.submit(function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (submit.attr('disabled')) return;
        dialog.remove();
        callback && callback();
    });
};

/**
 * get query for current page
 * @returns {tek.Query}
 */
exports.getQuery = function () {
    return tek.Query.fromLocation(location) || {};
};

exports.pushQueryToState = function (values) {
    var hst = history,
        loc = location;
    if (!hst.pushState) return;
    if (!values) return;
    if (!$.param) return;
    var query = new tek.Query(loc.search.replace('?', ''));
    for (var key in values) {
        if (!values.hasOwnProperty(key)) continue;
        query[key] = values[key];
    }
    var new_url = [loc.path, $.param(query)].join('?');
    hst.pushState(null, null, new_url);
};

/**
 * show sorry page for not supported
 * @param data
 */
exports.sorryNoSupport = function (data) {
    var body = document.body;
    $('#tk-no-support-dialog', body).remove();

    var tmpl = hbs.templates['tk-no-support-dialog'];
    data = $.extend({
        title: 'Sorry!Your browser is not supported.',
        msg: "Why don't you try one of these?"
    }, data || {});

    var html = tmpl(data);

    $(html).appendTo(body);
};

/**
 * confirm before page unload
 * @param msg
 */
exports.confirmLeave = function (msg) {
    if (!$.confirmLeave.initialized) {
        $.confirmLeave.initialized = true;
        $(window).on('beforeunload', function () {
            return $.confirmLeave.msg || undefined;
        });
    }
    $.confirmLeave.msg = msg;
};


/**
 * scroll page to top
 * @param duration
 */
exports.scrollToTop = function (duration) {
    $('html,body').animate({
        scrollTop: 0
    }, duration || 300);
};