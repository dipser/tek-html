/**
 * User: okunishitaka
 * Date: 9/22/13
 * Time: 8:17 AM
 */

Tek = (function (T) {

    /**
     * define newable function
     * @type {Function}
     */
    T.define = (function () {

        function addProperty(F, property) {
            Object.keys(property).forEach(function (name) {
                F.prototype[name] = property[name];
            });
        }

        function addAttrAccessor(F, attr) {
            if (!(attr instanceof Array)) attr = [attr];
            attr.forEach(function (attr) {
                var value_key = ('_' + attr);
                if (F.prototype[value_key] === undefined) {
                    F.prototype[value_key] = null;
                }
                F.prototype[attr] = function () {
                    var s = this;
                    if (arguments.length) {
                        s[value_key] = arguments[0];
                        return s;
                    } else {
                        return s[value_key];
                    }
                };
            });
            return F;
        }

        return function (def) {
            var F = function () {
                var s = this;
                s.init && s.init.apply(s, arguments);
            };
            var prototype = def['prototype'] || def['Prototype'];
            if (prototype) F.prototype = new prototype;

            var properties = def['properties'] || def['property'] || {};
            addProperty(F, properties);

            var init = def['init'];
            if (init) F.prototype.init = init;

            var attrAccessor = def['attrAccessor'] || def['attrAccessors'] || [];
            addAttrAccessor(F, attrAccessor);

            return F;
        };
    })();

    /**
     * generate uuid
     */
    T.uuid = (function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return function () {
            return [s4() + s4(), s4(), s4(), s4(), s4() + s4() + s4()].join('-');
        }
    })();

    /**
     *
     * @param string
     * @constructor
     */
    T.Query = function (string) {
        if (!string) return;
        var s = this;
        string.split('&').forEach(function (query) {
            var key_val = query.split('=');
            var key = decodeURIComponent(key_val[0]);
            s[key] = decodeURIComponent(key_val[1].replace(/\+/g, ' '));
        });
    };

    /**
     * save data to local storage
     * @param key
     * @param obj
     */
    T.toStorage = function (key, obj) {
        var isString = typeof (obj) === 'string',
            string = isString ? obj : JSON.stringify(obj);
        localStorage.setItem(key, string);
    };

    /**
     * restore data from local storage
     * @param key
     * @returns {*}
     */
    T.fromStorage = function (key) {
        var string = localStorage.getItem(key);
        return JSON.parse(string);
    };

    return T;
})(window['Tek'] || {});