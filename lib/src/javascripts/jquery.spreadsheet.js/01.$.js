var $ = global['$'];

var spreadsheet = exports.spreadsheet = {};
var settings = spreadsheet.settings = {
    prefix: 'ss',
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

spreadsheet.SheetData = function (head, rows) {
    var s = this;
    s.head = head;
    s.rows = rows;
};
spreadsheet.SheetData.prototype.toHTML = function () {
    var s = this;
    return '<table>'
        + '<thead>' + (s.head && s.head.toHTML() || s.head || '') + '</thead>'
        + '<tbody>' + (s.rows && s.rows.map(function (row) {
        return row && row.toHTML && row.toHTML() || row || '';
    }).join('')) + '</tbody>'
        + '</table>';
}


spreadsheet.HeadData = function (values) {
    var s = this;
    s.values = values;
};
spreadsheet.HeadData.prototype.toHTML = function () {
    var s = this,
        values = s.values;
    return '<tr><th></th>' + (values && values.map(function (value) {
        return '<th>' + (value || '') + '</th>';
    }).join('')) + '</tr>';
};
spreadsheet.RowData = function (rowHead, values) {
    switch (arguments.length) {
        case 1:
            if (arguments[0] instanceof Array) {
                values = arguments[0];
                rowHead = '';
            }
            break;
    }
    var s = this;
    s.rowHead = rowHead;
    s.values = values;
};
spreadsheet.RowData.prototype.toHTML = function () {
    var s = this,
        values = s.values,
        rowHead = s.rowHead || '';
    return '<tr><th>' + rowHead + '</th>' + (values && values.map(function (value) {
        return '<td>' + (value || '') + '</td>';
    }).join('')) + '</tr>';
};