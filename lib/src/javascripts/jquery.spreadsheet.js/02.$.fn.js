var $ = global['$'];

function createRoot(elment, html) {
    var root = $(elment).html(html).addClass(p('root'));
    return root;
}
var ss = $.spreadsheet;
$.fn.spreadsheet = function (sheetData, options) {
    var doc = $(document),
        o = $.extend(options, settings);

    if (!(sheetData instanceof ss.SheetData)) {
        sheetData = new ss.SheetData(null, new ss.RowData(sheetData));
    }
    return  createRoot(this, sheetData.toHTML());
};