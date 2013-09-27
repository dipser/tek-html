/**
 * define newable function
 * @type {Function}
 */
exports.define = (function () {
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
