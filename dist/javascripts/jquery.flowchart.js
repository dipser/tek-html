/**
 * jquery.flowchart.js v0.1.18
 * - jquery plugin to create flowchart -
 * @version v0.1.18
 * @author Taka Okunishi
 * @license MIT
 * @date 2013-10-27
 */
(function (dependencies, undefined) {
	
	/** jquery.flowchart for $ **/
	(function (global, undefined) {
	
		var $ = global['$'];
		
		var flowchart = $.flowchart = {};
		var settings = flowchart.settings = {
		    prefix: 'fc',
		    allowColor: '#BBB',
		    allowColorOutward: '#3AE',
		    allowColorInward: '#EA3',
		    update: function (data) {
		        var s = this;
		        Object.keys(data).forEach(function (key) {
		            s[key] = data[key];
		        });
		    }
		};
		var p = flowchart.p = function (str) {
		    if (str.match(/^\./)) {
		        return ['.' + settings.prefix, str.replace(/^\./, '')].join('-');
		    }
		    return [settings.prefix, str].join('-');
		};
		
		
		flowchart.toAttrStrings = function (data) {
		    if (!data) return [];
		    return Object.keys(data).map(function (key) {
		        var value = data[key];
		        return [
		            key,
		            '"' + value + '"'
		        ].join('=')
		    });
		};
		var Item = flowchart.Item = function (content) {
		    var s = this;
		    s.content(content);
		};
		Item.prototype.content = function (content) {
		    var s = this;
		    s._content = content;
		    return s;
		};
		Item.prototype.id = function (id) {
		    var s = this;
		    s._id = id;
		    return s;
		};
		Item.prototype.from = function (from) {
		    var s = this;
		    s._from = [].concat(from);
		    return s;
		};
		Item.prototype.to = function (to) {
		    var s = this;
		    s._to = [].concat(to);
		    return s;
		};
		
		Item.prototype.toHTML = function () {
		    var s = this;
		    var content = s._content,
		        id = s._id,
		        from = s._from || [],
		        to = s._to || [];
		    var attr = {
		            "data-from": from.join(','),
		            "data-to": to.join(','),
		            "class": p('item'),
		            "data-id": id,
		            "id": p('item') + id
		        },
		        attrString = flowchart.toAttrStrings(attr).join(' ');
		
		    return  [
		        ['<div', attrString , '>'].join(' '),
		        content,
		        '</div>'
		    ].join('');
		};
		
		var Arrow = flowchart.Arrow = function () {
		    var s = this;
		};
		Arrow.prototype.from = function (point) {
		    var s = this;
		    s._from = point;
		    return s;
		};
		Arrow.prototype._width = 2;
		Arrow.prototype._color = settings.allowColor;
		Arrow.prototype.to = function (point) {
		    var s = this;
		    s._to = point;
		    return s;
		};
		Arrow.prototype.color = function (color) {
		    var s = this;
		    s._color = color;
		    return s;
		};
		Arrow.prototype.width = function (width) {
		    var s = this;
		    s._width = width;
		    return s;
		};
		Arrow.prototype.draw = function (ctx) {
		    var s = this,
		        from = s._from,
		        to = s._to,
		        width = s._width,
		        color = s._color;
		    ctx.lineWidth = width;
		    ctx.strokeStyle = color;
		    ctx.beginPath();
		    ctx.moveTo(from.x, from.y);
		    console.log(from, to);
		    ctx.lineTo(to.x, to.y);
		    ctx.stroke();
		};
		flowchart.createHTML = function (tagName, body, attrs) {
		    var attrString = attrs && flowchart.toAttrStrings(attrs).join(' ');
		    return [
		        ['<' + tagName, attrString, '>'].join(' '),
		        body || '',
		        '</' + tagName + '>'
		    ].join('');
		};
	})(dependencies, undefined);
	
	/** jquery.flowchart for $.fn **/
	(function (global, undefined) {
	
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
	})(dependencies, undefined);

})({
    $: this['jQuery']
}, undefined);