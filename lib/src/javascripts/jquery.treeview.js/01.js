(function ($, document) {
    var settings = {};
    if (!$.fn.draggable) {
        console.error('[jquery.treeview.js] jquery-ui is required');
        return;
    }


    /**
     * add prefix
     * @param str
     * @returns {string}
     */
    function p(str) {
        var prefix = 'tv';
        if (str.match(/^\./)) {
            return ['.' + prefix, str.replace(/^\./, '')].join('-');
        }
        return [prefix, str].join('-');
    }

    /**
     * select element
     * @param item
     * @param context
     */
    function select(item, context) {
        var selectedClass = p('selected');
        if (li.hasClass(selectedClass)) return;
        $('.' + selectedClass, context)
            .removeClass(selectedClass);
        li.addClass(selectedClass);
    }

    var Item = function (content) {
        var s = this;
        s.content(content);
    };
    Item.prototype.children = function (children) {
        var s = this;
        s._children = children;
        return s;
    };
    Item.prototype.content = function (content) {
        var s = this;
        s._content = content;
        return s;
    };
    Item.prototype.toHTML = function () {
        var s = this,
            label = ['<label class="' + p('label') + '">', (s._content || ''), '</label>'].join('');
        var children = '';
        if (s._children) {
            children += '<ul class="' + p('children') + '">';
            s._children.forEach(function (child) {
                children += child.toHTML && child.toHTML() || child || '';
            });
            children += '</ul>'
        }

        var styleClass = [p('item'), children ? p('openable') : ''].join(' ');
        return [
            '<li class="' + styleClass + '">',
            label + children,
            '</li>'
        ].join('');
    };
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


        var $items = root.find(p('.item'));

        var on = doc.data(p('on'));
        if (!on) {
            doc.data(p('on'), true);
            doc.on('click', p('.selectable'), function (e) {
                var li = $(this);
                select(li, root);
                root.active = true;
                e.stopPropagation();
            });
            doc.on('keydown', function (e) {
                switch (e.keyCode) {
                    default:
                        break;
                }
            });
        }
    }
})(jQuery, window.document);