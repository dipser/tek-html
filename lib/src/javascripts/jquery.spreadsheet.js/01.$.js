var $ = global['$'];

var spreadsheet = exports.spreadsheet = {};
var settings = spreadsheet.settings = {
    prefix: '',
    update: function (data) {
        var s = this;
        Object.keys(data).forEach(function (key) {
            s[key] = data[key];
        });
    }
};
var p = spreadsheet.p = function (str) {
    if (str.match(/^\./)) {
        return ['.' + settings.prefix, str.replace(/^\./, '')].join('-');
    }
    return [settings.prefix, str].join('-');
};