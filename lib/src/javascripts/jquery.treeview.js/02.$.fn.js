var $ = global['$'];
if (!$.fn.draggable) {
    console.error('[jquery.treeview.js] jquery-ui is required');
}

var tv = $['treeview'],
    settings = tv.settings,
    p = tv.p,
    Item = tv.Item;

function createRoot(element, html) {
    var root = $(element).addClass(p('root'))
        .html(html);

    root.selected = $();

    root.get = function () {
        return root.find(p('.item'));
    };
    root.get.parent = function (item) {
        return item && item.parent(p('.children')).parent(p('.item'));
    };
    root.get.children = function (item) {
        return item && item.children(p('.children'))
            .find(p('.item'))
    };
    root.get.prev = function (item) {
        return item && item.prev(p('.item'));
    };
    root.get.next = function (item) {
        return item && item.next(p('.item'));
    };


    root.select = function (item) {
        if (!item.length) return null;
        if (!item.is(':visible')) return null;
        var selectedClass = p('selected');
        if (item.hasClass(selectedClass)) return null;
        $('.' + selectedClass, root)
            .removeClass(selectedClass);
        item.addClass(selectedClass);
        root.selected = item;
        return root.selected
    };

    root.select.prev = function (deep) {
        var selected = root.selected,
            prev = root.get.prev(selected);
        var result = root.select(prev);
        if (deep) {
            while (result) {
                var children = root.get.children(result);
                if (children && children.length) {
                    var child = root.select(children.last());
                    if (child) {
                        result = child;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        return  result;
    };
    root.select.next = function (deep) {
        var selected = root.selected,
            next = root.get.next(selected),
            result = root.select(next);
        if (deep) {
            var current = selected;
            while (!result && current.length) {
                var parent = root.get.parent(current);
                next = root.get.next(parent);
                result = root.select(next);
                current = parent;
            }
        }
        return result;
    };
    root.select.child = function () {
        var selected = root.selected,
            child = root.get.children(selected).first();
        return root.select(child);
    };
    root.select.parent = function () {
        var selected = root.selected,
            parent = root.get.parent(selected);
        return root.select(parent);
    };

    root.open = function (item) {
        if(!item) item = root.selected;
        var children = root.get.children(item),
            hasChildren = !!(children && children.length);
        if (!hasChildren) return null;
        if (!item.hasClass(p('closed'))) return null;
        item.removeClass(p('closed'));
        return item;
    };

    root.close = function (item) {
        if(!item) item = root.selected;
        var children = root.get.children(item),
            hasChildren = !!(children && children.length);
        if (!hasChildren) return null;
        if (item.hasClass(p('closed'))) return null;
        item.addClass(p('closed'));
        return item;
    };


    return root;
}


$.fn.treeview = function (items, options) {
    var doc = $(document),
        o = $.extend(options, settings);


    var html = items && items.map(function (item) {
        return item.toHTML();
    }).join('');

    var root = createRoot(this, html);

    var on = doc.data(p('on'));
    if (!on) {
        doc.data(p('on'), true);
        doc.on('click', p('.item'), function (e) {
            root.active = true;

            var item = $(this);
            root.select(item);
            e.stopPropagation();
        });
        doc.on('click', p('.openable-icon'), function (e) {
            var item = $(this).parent(p('.label')).parent(p('.item')).first();
            if(item.length){
                root.open(item) || root.close(item);
            }
            e.stopPropagation();
        });
        doc.on('dblclick', p('.item'), function (e) {
            var item = $(this);
            root.open(item) || root.close(item);
            e.stopPropagation();
        });
        doc.on('keydown', function (e) {
            var KEY = $.ui.keyCode,
                select = root.select;
            switch (e.keyCode) {
                case KEY.UP:
                    select.prev(true) || select.parent();
                    break;
                case KEY.DOWN:
                    select.child() || select.next(true);
                    break;
                case KEY.LEFT:
                    root.close() || select.parent();
                    break;
                case KEY.RIGHT:
                    root.open() || select.child();
                    break;
                case KEY.ENTER:
                    root.open() || root.close();
                    break;
                default:
                    return;
            }
            e.preventDefault();
        });
    }
};
