/**
 * save data to local storage
 * @param key
 * @param obj
 */
exports.toStorage = function (key, obj) {
    var isString = typeof (obj) === 'string',
        string = isString ? obj : JSON.stringify(obj);
    localStorage.setItem(key, string);
};
