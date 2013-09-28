(function ($, Hbs, tek, undefined) {
    var global = {
        $:$,
        Hbs:Hbs,
        tek:tek
    };

	/**
	 * Created by okunishitaka on 9/28/13.
	 */
	
	var tek = global['tek'];
	exports.FormValue = tek.define({
	    init: function (values) {
	        var s = this;
	        for (var name in values) {
	            if (!values.hasOwnProperty(name)) continue;
	            s[name] = values[name];
	        }
	    },
	    properties: {
	        addValue: function (name, val) {
	            var s = this;
	            if (s.hasOwnProperty(name)) {
	                var isArray = s[name] instanceof Array;
	                if (!isArray) {
	                    s[name] = [s[name]];
	                }
	                s[name].push(val);
	            } else {
	                s[name] = val;
	            }
	        },
	        toObj: function () {
	            var s = this,
	                result = {};
	
	            function findInjectable(dst, key) {
	                while (key.match(/\./)) {
	                    var prop = key.match(/([^\.]*)\./)[1];
	                    if (!dst[prop]) dst[prop] = {};
	                    dst = dst[prop];
	                    key = key.replace(/[^\.]*\./, '');
	                }
	                return dst;
	            }
	
	            for (var name in s) {
	                if (!s.hasOwnProperty(name)) continue;
	                var value = s[name];
	                var isNumeric = (value instanceof String) && value.match(/^[\d\.]+$/);
	                if (isNumeric) {
	                    value = parseFloat(value);
	                } else {
	                    if (!value) value = undefined;
	                }
	                var dst = findInjectable(result, name);
	                if (dst[name]) {
	                    var isArray = dst[name] instanceof Array;
	                    if (!isArray) {
	                        dst[name] = [dst[name]];
	                    }
	                    dst[name].push(value);
	                } else {
	                    dst[name] = value;
	                }
	            }
	            return result;
	        }
	    }
	});

})(jQuery, Handlebars, tek, undefined);