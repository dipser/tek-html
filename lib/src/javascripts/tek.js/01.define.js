/**
 * define newable function
 * @type {Function}
 */
exports.define = (function () {
    function addProperty(F, property) {
        for (var name in property) {
            if (!property.hasOwnProperty(name)) continue;
            F.prototype[name] = property[name];
        }
    }

    function addAttrAccessor(F, attrs) {
        if (!(attrs instanceof Array)) attrs = [attrs];

        function createAccessor(key) {
            return function () {
                var s = this;
                if (arguments.length) {
                    s[key] = arguments[0];
                    return s;
                } else {
                    return s[key];
                }
            }
        }

        for (var i = 0, len = attrs.length; i < len; i++) {
            var attr = attrs[i],
                value_key = ('_' + attr);
            if (F.prototype[value_key] === undefined) {
                F.prototype[value_key] = null;
            }
            F.prototype[attr] = createAccessor(value_key);
        }
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
