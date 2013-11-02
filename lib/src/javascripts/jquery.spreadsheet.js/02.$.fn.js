var $ = global['$'];

function createRoot(elment, html) {
    html = ['<div class="' + p('scrollable') + '">' + html + '</div>'].join('');
    var root = $(elment).html(html).addClass(p('root'));

    return root;
}
function createLeftFixed(th, theadHeight) {
    var html = '<table class="' + p('left-fixed-table') + '"><caption>&nbsp;</caption>' +
        '<thead><tr><th style="height:' + theadHeight + 'px;">&nbsp;</th></tr></thead><tbody></tr>';
    th.each(function () {
        var th = $(this);
        var attrString = spreadsheet.toAttrStrings({
            "class": th.attr('class'),
            'width': th.width()
        }).join(' ');
        html += '<tr><th ' + attrString + '>' + th.html() + '</th></tr>';
    });
    return html + '</tbody></table>';
}
var ss = $.spreadsheet;
$.fn.spreadsheet = function (sheetData, options) {
    var doc = $(document),
        o = $.extend(options, settings);

    if (!(sheetData instanceof ss.SheetData)) {
        sheetData = new ss.SheetData(null, new ss.RowData(sheetData));
    }
    var root = createRoot(this, sheetData.toHTML()),
        table = root.find('table'),
        thead = table.find('thead'),
        tbody = table.find('tbody');

    var theadTh = thead.find('th'),
        tbodyTh = tbody.find('th');

    var leftFixed = $(createLeftFixed(tbody.find('.ss-body-th'), theadTh.height()+1)).appendTo(root);

    var cellSelector = [p('.root'), p('.cell')].join(' ');
    doc
        .on('mouseenter', cellSelector, function () {
            var cell = $(this),
                row = cell.data('row'),
                col = cell.data('col');


            theadTh
                .removeClass(p('th-hover'))
                .eq(col + 1).addClass(p('th-hover'));

            tbodyTh
                .removeClass(p('th-hover'))
                .eq(row).addClass(p('th-hover'));
        })
        .on('mouseleave', cellSelector, function () {

        });
    return    root;
};