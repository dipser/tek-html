var $ = global['$'];

var ss = $.spreadsheet,
    p = ss.p;

function createRoot(elment, html) {
    html = ['<div class="' + p('scrollable') + '">' + html + '</div>'].join('');
    var root = $(elment).html(html).addClass(p('root'));

    return root;
}
function createTopFixed(thead, scrollable) {
    var fixedThead = thead.clone().addClass('top-fixed-thead');
    var left = scrollable.offset().left;
    fixedThead.free = function () {
        fixedThead.hide();
        thead
            .data(p('fixed'), false);
    };
    fixedThead.fix = function () {
        fixedThead.show().css({
            left: -1 * scrollable.scrollLeft() + left
        });
        thead
            .data(p('fixed'), true);
    };

    scrollable.scroll(function () {
        var scrollLeft = scrollable.scrollLeft();
        if (thead.data(p('fixed'))) {
            fixedThead.css({left: -1 * scrollLeft + left});
        }
    });

    return fixedThead;
}
function createLeftFixed(th) {
    var html = '<table class="' + p('left-fixed-table') + '"><caption>&nbsp;</caption>' +
        '<thead><tr><th >&nbsp;</th></tr></thead><tbody></tr>';
    th.each(function () {
        var th = $(this);
        var attrString = ss.toAttrStrings({
            "class": th.attr('class'),
            'width': th.width()
        }).join(' ');
        html += '<tr><th ' + attrString + '>' + th.html() + '</th></tr>';
    });
    return html + '</tbody></table>';
}
$.fn.spreadsheet = function (sheetData, options) {
    var doc = $(document),
        win = $(window),
        o = $.extend(options, ss.settings);

    if (!(sheetData instanceof ss.SheetData)) {
        sheetData = new ss.SheetData(null, new ss.RowData(sheetData));
    }
    var root = createRoot(this, sheetData.toHTML()),
        scrollable = root.children(p('.scrollable')),
        table = scrollable.children('table'),
        thead = table.children('thead'),
        tbody = table.children('tbody');

    var theadTh = thead.find(p('.head-th')),
        tbodyTh = tbody.find(p('.body-th'));

    var leftFixed = $(createLeftFixed(tbodyTh)).appendTo(root);

    var topFixed = createTopFixed(thead, scrollable);
    table.append(topFixed);


    var theadOffset = thead.offset();


    win.scroll(function () {
        var scrollTop = win.scrollTop(),
            fixed = thead.data(p('fixed'));
        if (theadOffset.top < scrollTop) {
            !fixed && topFixed.fix();
        } else {
            fixed && topFixed.free();
        }
    });

    var cellSelector = [p('.root'), p('.cell')].join(' ');

    var leftFixedTh = leftFixed.find(p('.body-th'));

    root
        .on('mouseleave', function(){
            root.find(p('.th-hover')).removeClass(p('th-hover'));
        })
        .on(p('resize'), function () {
            leftFixedTh.width(tbodyTh.width());
            leftFixed.children('thead').eq(0)
                .find('th').eq(0).height(theadTh.height() + 1);


            tbodyTh.each(function (i) {
                var th = $(this);
                leftFixedTh.eq(i)
                    .width(th.width())
                    .height(th.height());
            });

            theadTh.each(function (i) {
                var th = $(this);
                topFixed.find('.ss-head-th').eq(i)
                    .height(th.height())
                    .width(th.width());
            });

            topFixed.children('tr').children('th').first().width(leftFixed.width());
        })
        .trigger(p('resize'));

    win
        .on('resize', function () {
            root.trigger(p('resize'));
        });

    doc
        .on('mouseenter', cellSelector, function () {
            var cell = $(this),
                row = cell.data('row'),
                col = cell.data('col');


            theadTh
                .removeClass(p('th-hover'))
                .eq(col).addClass(p('th-hover'));

            if (thead.data(p('fixed'))) {
                var topFixedTr = topFixed.children('tr');
                topFixedTr
                    .children(p('.th-hover'))
                    .removeClass(p('th-hover'));
                topFixedTr
                    .children(p('.head-th'))
                    .eq(col).addClass(p('th-hover'));
            }

            tbodyTh
                .removeClass(p('th-hover'))
                .eq(row).addClass(p('th-hover'));


            leftFixedTh
                .removeClass(p('th-hover'))
                .eq(row).addClass(p('th-hover'));
        })
        .on('mouseleave', cellSelector, function () {

        });
    return    root;
};