var tek = global['tek'],
    hbs = global['hbs'],
    $ = global['$'];

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