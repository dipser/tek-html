exports.Query = function (string) {
    if (!string) return;
    var s = this;
    string.split('&').forEach(function (query) {
        var key_val = query.split('=');
        var key = decodeURIComponent(key_val[0]);
        s[key] = decodeURIComponent(key_val[1].replace(/\+/g, ' '));
    });
};
exports.Query.fromLocation = function () {
    var search = location.search;
    return search && new exports.Query(search.replace('?', ''));
};