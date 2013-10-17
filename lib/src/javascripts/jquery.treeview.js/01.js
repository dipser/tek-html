(function ($, document) {
    var settings = {};
    if (!$.fn.draggable) {
        console.error('[jquery.treeview.js] jquery-ui is required');
        return;
    }




    /**
     * select element
     * @param item
     * @param context
     */
    function select(item, context) {
        var selectedClass = p('selected');
        if (item.hasClass(selectedClass)) return;
        $('.' + selectedClass, context)
            .removeClass(selectedClass);
        item.addClass(selectedClass);
    }


    $.treeview = {
        Item: Item
    };

    $.fn.treeview = function (items, options) {
        var doc = $(document),
            root = $(this).addClass(p('root')),
            o = $.extend(options, settings);

        var html = items && items.map(function (item) {
            return item.toHTML();
        }).join('');
        root.html(html);

        var on = doc.data(p('on'));
        if (!on) {
            doc.data(p('on'), true);
            doc.on('click', p('.item'), function (e) {
                var li = $(this);
                select(li, root);
                root.active = true;
                e.stopPropagation();
            });
            doc.on('keydown', function (e) {
                var KEY = $.ui.keyCode;
                switch (e.keyCode) {
                    case KEY.UP:
                        break;
                    default:
                        return;
                }
                e.preventDefault();
            });
        }
    }
})(jQuery, window.document);