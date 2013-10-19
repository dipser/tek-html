tek = (function (module) {
    
    var exports = module && module.exports || {};

	/**
	 * define newable function
	 * @type {Function}
	 */
	exports.define = (function () {
	    function addProperty(F, property) {
	        Object.keys(property).forEach(function (name) {
	            F.prototype[name] = property[name];
	        });
	    }
	
	    function addAttrAccessor(F, attr) {
	        if (!(attr instanceof Array)) attr = [attr];
	        attr.forEach(function (attr) {
	            var value_key = ('_' + attr);
	            if (F.prototype[value_key] === undefined) {
	                F.prototype[value_key] = null;
	            }
	            F.prototype[attr] = function () {
	                var s = this;
	                if (arguments.length) {
	                    s[value_key] = arguments[0];
	                    return s;
	                } else {
	                    return s[value_key];
	                }
	            };
	        });
	        return F;
	    }
	
	    return function (def) {
	        var F = function () {
	            var s = this;
	            s.init && s.init.apply(s, arguments);
	        };
	        var prototype = def['prototype'] || def['Prototype'];
	        if (prototype) F.prototype = new prototype;
	
	        var properties = def['properties'] || def['property'] || {};
	        addProperty(F, properties);
	
	        var init = def['init'];
	        if (init) F.prototype.init = init;
	
	        var attrAccessor = def['attrAccessor'] || def['attrAccessors'] || [];
	        addAttrAccessor(F, attrAccessor);
	
	        return F;
	    };
	})();
	
/**
	 * generate uuid
	 */
	exports.uuid = (function () {
	    function s4() {
	        return Math.floor((1 + Math.random()) * 0x10000)
	            .toString(16)
	            .substring(1);
	    }
	
	    return function () {
	        return [s4() + s4(), s4(), s4(), s4(), s4() + s4() + s4()].join('-');
	    }
	})();
	
exports.Query = function (string) {
	    if (!string) return;
	    var s = this;
	    string.split('&').forEach(function (query) {
	        var key_val = query.split('=');
	        var key = decodeURIComponent(key_val[0]);
	        s[key] = decodeURIComponent(key_val[1].replace(/\+/g, ' '));
	    });
	};
	exports.Query.fromLocation = function () {
	    var search = location.search;
	    return search && new exports.Query(search.replace('?', ''));
	};
/**
	 * save data to local storage
	 * @param key
	 * @param obj
	 */
	exports.toStorage = function (key, obj) {
	    var isString = typeof (obj) === 'string',
	        string = isString ? obj : JSON.stringify(obj);
	    localStorage.setItem(key, string);
	};
/**
	 * restore data from local storage
	 * @param key
	 * @returns {*}
	 */
	exports.fromStorage = function (key) {
	    var string = localStorage.getItem(key);
	    return JSON.parse(string);
	};
exports.math = {};
	/**
	 * make sure to values to iteratable
	 * @param values
	 * @returns {*}
	 */
	exports.ensureIteratable = function (values) {
	    switch (values.length) {
	        case 0:
	            return null;
	        case 1:
	            var $0 = values[0];
	            if ($0 instanceof Array) {
	                return $0
	            } else {
	                return [$0];
	            }
	        default :
	            return Array.prototype.slice.call(values, 0);
	    }
	};
	
	/**
	 * get largest value
	 * @returns {null}
	 */
	exports.math.max = function () {
	    var max = null,
	        values = exports.ensureIteratable(arguments);
	    for (var i = 0, len = values.length; i < len; i++) {
	        var value = values[i];
	        if (max === null) {
	            max = value;
	        } else if (max < value) {
	            max = value;
	        }
	    }
	    return max;
	};
	
	/**
	 * get smallest value
	 * @returns {null}
	 */
	exports.math.min = function () {
	    var min = null,
	        values = exports.ensureIteratable(arguments);
	    for (var i = 0, len = values.length; i < len; i++) {
	        var value = values[i];
	        if (min === null) {
	            min = value;
	        } else if (value < min) {
	            min = value;
	        }
	    }
	    return min;
	};
	
	/**
	 * get sum of values
	 * @returns {number}
	 */
	exports.math.sum = function () {
	    var sum = 0,
	        values = exports.ensureIteratable(arguments);
	    for (var i = 0, len = values.length; i < len; i++) {
	        sum += values[i];
	    }
	    return sum;
	};
	
	/**
	 * get average of values
	 * @returns {number}
	 */
	exports.math.average = function () {
	    var values = exports.ensureIteratable(arguments);
	    var len = values.length;
	    var sum = exports.math.sum(values);
	    return  len ? (sum / len) : null;
	};
    
    return exports;
    
})(typeof(module) === 'undefined' ? null : module);