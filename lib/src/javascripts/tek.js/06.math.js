/**
 * User: okunishitaka
 * Date: 9/16/13
 * Time: 11:38 AM
 */

/**
 * make sure to values to iteratable
 * @param values
 * @returns {*}
 */
function ensureIteratable(values) {
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
}

/**
 * get largest value
 * @returns {null}
 */
exports.max = function () {
    var max = null,
        values = ensureIteratable(arguments);
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
exports.min = function () {
    var min = null,
        values = ensureIteratable(arguments);
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
exports.sum = function () {
    var sum = 0,
        values = ensureIteratable(arguments);
    for (var i = 0, len = values.length; i < len; i++) {
        sum += values[i];
    }
    return sum;
};

/**
 * get average of values
 * @returns {number}
 */
exports.average = function () {
    var values = ensureIteratable(arguments);
    var len = values.length;
    var sum = exports.sum(values);
    return  len ? (sum / len) : null;
};