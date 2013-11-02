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

spreadsheet.toAttrStrings = function (data) {
    if (!data) return [];
    return Object.keys(data).map(function (key) {
        var value = data[key];
        return [
            key,
            '"' + value + '"'
        ].join('=')
    });
};


spreadsheet.SheetData = function (name, head, rows) {
    var s = this;
    if (typeof(arguments[0]) !== 'string') {
        head = arguments[0];
        rows = arguments[1];
    }
    s.name = name;
    s.head = head;
    s.rows = rows;
};
spreadsheet.SheetData.prototype.toHTML = function () {
    var s = this;
    return '<table class=' + p('table') + '>'
        + '<caption>' + (s.name || '') + '</caption>'
        + '<thead>' + (s.head && s.head.toHTML() || s.head || '') + '</thead>'
        + '<tbody>' + (s.rows && s.rows.map(function (row, rownum) {
        return row && row.toHTML && row.toHTML(rownum) || row || '';
    }).join('')) + '</tbody>'
        + '</table>';
};


spreadsheet.HeadData = function (values) {
    var s = this;
    s.values = values;
};
spreadsheet.HeadData.prototype.toHTML = function () {
    var s = this,
        values = s.values;
    return '<tr><th></th>' + (values && values.map(function (value, col) {
        var attrString = spreadsheet.toAttrStrings({
            "class": [p('th'), p('head-th')].join(' '),
            "data-col": col
        }).join(' ');
        return '<th ' + attrString + '>' + (value || '') + '</th>';
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
spreadsheet.RowData.prototype.toHTML = function (row) {
    var s = this,
        values = s.values,
        rowHead = s.rowHead || '';

    var thAttrString = spreadsheet.toAttrStrings({
        "class": [p('th'), p('body-th')].join(' '),
        "data-row": row
    }).join(' ');
    return '<tr class="' + p('tbody-row') + '"><th ' + thAttrString + '>' + rowHead + '</th>' + (values && values.map(function (value, col) {
        var attrString = spreadsheet.toAttrStrings({
            "class": p('cell'),
            "data-row": row,
            "data-col": col
        }).join(' ');
        return '<td ' + attrString + '>' + (value || '') + '</td>';
    }).join('')) + '</tr>';
};