/**
 * jquery.flowchart.js v0.3.19
 * - jquery plugin to create flowchart -
 * @version v0.3.19
 * @author Taka Okunishi
 * @license MIT
 * @date 2013-12-03
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
		
		var Range = flowchart.Range = function (min, max) {
		    var s = this;
		    s.min = min;
		    s.max = max;
		};
		/**
		 * returns the nearest number within range
		 * @param val
		 */
		Range.prototype.nearest = function (val) {
		    var s = this;
		    if (val < s.min) return s.min;
		    if (s.max < val) return s.max;
		    return val;
		};
		
		var Rect = flowchart.Rect = function (data) {
		    var s = this;
		    s.x = data.x;
		    s.y = data.y;
		    s.w = data.w;
		    s.h = data.h;
		};
		
		Rect.prototype.nearestPoint = function (point) {
		    var rect = this,
		        x = rect.x,
		        y = rect.y,
		        w2 = rect.w / 2 ,
		        h2 = rect.h / 2;
		    return {
		        x: x - new Range(-w2, w2).nearest(x - point.x),
		        y: y - new Range(-h2, h2).nearest(y - point.y)
		    }
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
	})(dependencies, undefined);

})({
    $: this['jQuery']
}, undefined);