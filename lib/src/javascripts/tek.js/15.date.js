/**
 * Created by okunishitaka on 11/5/13.
 */

exports.date = {};

/**
 * convert date to utc
 * @param date
 */
exports.date.toUTC = function (date) {
    return Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds());
};