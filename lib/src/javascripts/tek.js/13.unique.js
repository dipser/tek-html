/**
 * filter to unique values
 */
exports.unique = function (values) {
    var isArray = values instanceof Array;
    if (!isArray) values = Array.prototype.splice.call(arguments, 0);
    return values.filter(function (entry, i) {
        var first = values.indexOf(entry);
        return first === i;
    });
};