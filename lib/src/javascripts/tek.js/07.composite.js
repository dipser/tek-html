/**
 * composite functions
 * @returns {Function}
 */
exports.composite = function (/**functions**/) {
    var callables = Array.prototype.slice.call(arguments, 0);
    return function () {
        var s = this,
            result = [];
        for (var i = 0, len = callables.length; i < len; i++) {
            var called = callables[i].apply(s, arguments);
            result = result.concat(called);
        }
        return result;
    };
};
