/**
 * restore data from local storage
 * @param key
 * @returns {*}
 */
exports.fromStorage = function (key) {
    var string = localStorage.getItem(key);
    return JSON.parse(string);
};