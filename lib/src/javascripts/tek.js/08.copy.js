/**
 * User: okunishitaka
 * Date: 9/16/13
 * Time: 3:36 PM
 */

/**
 * copy properties
 * @param src
 * @param dst
 */
exports.copy = function (src, dst) {
    for (var name in src) {
        if (!src.hasOwnProperty(name)) continue;
        dst[name] = src[name];
    }
    return dst;
};

/**
 * recursive copy
 * @param src
 * @param dst
 * @returns {*}
 */
exports.copy.deep = function (src, dst) {
    var copy = exports.copy;
    if (!src) return dst;
    for (var key in src) {
        if (!src.hasOwnProperty(key)) continue;
        if (src[key] instanceof Date) {
            dst[key] = new Date(src[key]);
        } else if (src[key] instanceof Function) {
            dst[key] = src[key];
        } else {
            if (src[key] instanceof Array) {
                dst[key] = copy.deep(src[key], dst[key] || []);
            } else if (src[key] instanceof Object) {
                dst[key] = copy.deep(src[key], dst[key] || {});
            } else {
                dst[key] = src[key];
            }
        }
    }
    return dst;
};

