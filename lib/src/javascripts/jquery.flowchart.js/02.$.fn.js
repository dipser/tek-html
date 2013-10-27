var $ = global['$'];
if (!$.fn.draggable) {
    console.error('[jquery.flowchart.js] jquery-ui is required');
}

var fc = $['flowchart'],
    settings = fc.settings,
    p = fc.p,
    Item = fc.Item,
    Rect = fc.Rect,
    Arrow = fc.Arrow;

function createRoot(element, html) {
    var root = $(element).addClass(p('root')).html(html),
        items = root.find(p('.item'));
    var canvas = $(fc.createHTML('canvas', '', {
            width: root.width(),
            height: root.height(),
            "class": p('canvas')
        })).prependTo(root)[0],
        ctx = canvas.getContext('2d');
    root.get = function (id) {
        if (id) {
            return items.filter('#' + (p('item') + id));
        } else {
            return items;
        }
    };
    root.draw = function (arrows) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        arrows.forEach(function (arrow) {
            arrow.draw(ctx);
        });
    };

    root.getArrows = function () {
        var rectMap = {},
            arrows = [];
        items = root.get();
        items.each(function () {
            var item = $(this),
                _id = item.data('id');
            var p = item.position();
            rectMap[_id] = new Rect({
                x: p.left + item.width() / 2,
                y: p.top + item.height() / 2,
                w: item.outerWidth(),
                h: item.outerHeight()
            });
        });

        items.each(function () {
            var item = $(this),
                id = item.data('id'),
                rect = rectMap[id],
                from = String(item.data('from') || ''),
                to = String(item.data('to') || '');
            from && from.split(',').forEach(function (fromId) {
                var fromRect = rectMap[fromId];
                var arrow = new Arrow()
                    .from(fromRect)
                    .to(rect.nearestPoint(fromRect));
                arrows.push(arrow);
            });
            to && to.split(',').forEach(function (toId) {
                var toRect = rectMap[toId];
                var arrow = new Arrow()
                    .from(rect)
                    .to(toRect.nearestPoint(rect));
                arrows.push(arrow);
            });
        });
        return arrows;

    };
    items
        .draggable({
            start: function () {

            },
            drag: function () {
                root.draw(root.getArrows());
            },
            end: function () {

            },
            containment: 'parent'
        });

    root.draw(root.getArrows());

    return root;
}


$.fn.flowchart = function (items, options) {
    var doc = $(document),
        o = $.extend(options, settings);

    var html = items && items.map(function (item) {
        return item.toHTML();
    }).join('');

    fc.root = createRoot(this, html);


    return fc.root;
};