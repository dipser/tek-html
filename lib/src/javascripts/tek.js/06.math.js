exports.math = {};
/**
 * make sure to values to iteratable
 * @param values
 * @returns {*}
 */
exports.ensureIteratable = function (values) {
    switch (values.length) {
        case 0:
            return null;
        case 1:
            var $0 = values[0];
            if ($0 instanceof Array) {
                return $0
            } else {
                return [$0];
            }
        default :
            return Array.prototype.slice.call(values, 0);
    }
};

/**
 * get largest value
 * @returns {null}
 */
exports.math.max = function () {
    var max = null,
        values = exports.ensureIteratable(arguments);
    for (var i = 0, len = values.length; i < len; i++) {
        var value = values[i];
        if (max === null) {
            max = value;
        } else if (max < value) {
            max = value;
        }
    }
    return max;
};

/**
 * get smallest value
 * @returns {null}
 */
exports.math.min = function () {
    var min = null,
        values = exports.ensureIteratable(arguments);
    for (var i = 0, len = values.length; i < len; i++) {
        var value = values[i];
        if (min === null) {
            min = value;
        } else if (value < min) {
            min = value;
        }
    }
    return min;
};

/**
 * get sum of values
 * @returns {number}
 */
exports.math.sum = function () {
    var sum = 0,
        values = exports.ensureIteratable(arguments);
    for (var i = 0, len = values.length; i < len; i++) {
        sum += values[i];
    }
    return sum;
};

/**
 * get average of values
 * @returns {number}
 */
exports.math.average = function () {
    var values = exports.ensureIteratable(arguments);
    var len = values.length;
    var sum = exports.math.sum(values);
    return  len ? (sum / len) : null;
};
