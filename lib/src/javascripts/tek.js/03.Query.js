exports.Query = function (string) {
    if (!string) return;
    string = string.replace(/^\?/, '');
    var s = this;
    var isQuery = s instanceof exports.Query;
    if (!isQuery) {
        return new exports.Query(string);
    }
    var queries = string.split('&');
    for (var i = 0, len = queries.length; i < len; i++) {
        var query = queries[i];
        var key_val = query.split('=');
        var key = decodeURIComponent(key_val[0]);
        s[key] = decodeURIComponent(key_val[1].replace(/\+/g, ' '));
    }
    return s;
};

exports.Query.fromLocation = function (location) {
    var search = location.search;
    return search && exports.Query(search.replace(/^\?/, ''));
};
