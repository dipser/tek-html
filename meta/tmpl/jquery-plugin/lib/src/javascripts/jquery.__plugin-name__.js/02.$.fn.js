var $ = global['$'];


$.fn.__pluginName__ = function (items, options) {
    var doc = $(document),
        o = $.extend(options, settings);

    return $(this);
};