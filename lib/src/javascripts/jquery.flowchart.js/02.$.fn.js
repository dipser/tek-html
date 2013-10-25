var $ = global['$'];
if (!$.fn.draggable) {
    console.error('[jquery.flowchart.js] jquery-ui is required');
}

var fc = $['flowchart'],
    settings = fc.settings,
    p = fc.p,
    Item = fc.Item,
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
        var arrows = [],
            items = root.get(),
            pointMap = {};
        items.each(function () {
            var item = $(this),
                id = item.data('id');
            var o = item.offset(),
                w = item.outerWidth(true),
                h = item.outerHeight(true);
            pointMap[id] = {
                x: o.top + w / 2,
                y: o.left + h / 2
            };

        });
        items.each(function () {
            var item = $(this),
                id = item.data('id'),
                point = pointMap[id],
                from = String(item.data('from') || ''),
                to = String(item.data('to') || '');
            from && from.split(',').forEach(function (fromId) {
                var arrow = new Arrow()
                    .from(pointMap[fromId])
                    .to(point);
                arrows.push(arrow);
            });
            to && to.split(',').forEach(function (toId) {
                var arrow = new Arrow()
                    .from(point)
                    .to(pointMap[toId]);
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