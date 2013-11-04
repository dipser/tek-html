exports.Query = function (string) {
    if (!string) return;
    string = string.replace(/^\?/, '');
    var s = this;
    if (s instanceof exports.Query) {
        return new exports.Query(string);
    }
    var queries = string.split('&');
    for (var i = 0, len = queries.length; i < len; i++) {
        var query = queries[i];
        var key_val = query.split('=');
        var key = decodeURIComponent(key_val[0]);
        s[key] = decodeURIComponent(key_val[1].replace(/\+/g, ' '));
    }
};

exports.Query.fromLocation = function (location) {
    var search = location.search;
    return search && new exports.Query(search.replace('?', ''));
};
