var $ = global['$'];


$.fn.spreadsheet = function (items, options) {
    var doc = $(document),
        o = $.extend(options, settings);

    return $(this);
};