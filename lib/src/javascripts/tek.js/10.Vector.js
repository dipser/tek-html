exports.Vector = tek.define({
    init: function (values) {
        var s = this;
        for (var key in values) {
            if (!values.hasOwnProperty(key)) continue;
            s[key] = values[key];
        }
    },
    attrAccessor: "".split(','),
    properties: {
        add: function (values) {
            var s = this;
            for (var key in s) {
                if (!s.hasOwnProperty(key)) continue;
                if (!values.hasOwnProperty(key)) continue;
                s[key] += values[key];
            }
            return s;
        },
        scale: function (scale) {
            var s = this;
            for (var key in s) {
                if (!s.hasOwnProperty(key)) continue;
                s[key] = s[key] * scale;
            }
            return s;
        },
        revert: function () {
            var s = this;
            for (var key in s) {
                if (!s.hasOwnProperty(key)) continue;
                s[key] *= -1;
            }
            return s;
        },
        clone: function () {
            var s = this;
            return new exports.Vector(s);
        }
    }
});
exports.Vector.between = function (from, to) {
    var Vector = exports.Vector;
    return new Vector(to).clone().add(new Vector(from).clone().revert());
};
