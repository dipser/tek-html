var $ = global['$'];

var treeview = exports.treeview = {};
var settings = treeview.settings = {
    prefix: 'tv',
    update: function (data) {
        var s = this;
        Object.keys(data).forEach(function (key) {
            s[key] = data[key];
        });
    }
};

var p = treeview.p = function (str) {
    if (str.match(/^\./)) {
        return ['.' + settings.prefix, str.replace(/^\./, '')].join('-');
    }
    return [settings.prefix, str].join('-');
};


var Item = treeview.Item = function (content) {
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
        label = ['<label class="' + p('label') + '">', (s._content || ''), '</label>'];
    var children = '';
    if (s._children) {
        children += '<ul class="' + p('children') + '">';
        s._children.forEach(function (child) {
            children += child.toHTML && child.toHTML() || child || '';
        });
        children += '</ul>'
    }
    var styleClass = p('item'), icon = '';
    if (children) {
        //noinspection JSValidateTypes
        styleClass = [styleClass, p('openable')].join(' ');

        icon += '<i class="' + p('openable-icon') + '"></i>';
    }
    label.splice(1, 0, icon);
    return [
        '<li class="' + styleClass + '">',
        label.join('') + children,
        '</li>'
    ].join('');
};