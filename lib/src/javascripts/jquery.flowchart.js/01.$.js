var $ = global['$'];

var flowchart = exports.flowchart = {};
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