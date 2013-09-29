tek = (function (module) {
    
    var tek = module && module.exports || {};

	/**
	 * define newable function
	 * @type {Function}
	 */
	tek.define = (function () {
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
	tek.uuid = (function () {
	    function s4() {
	        return Math.floor((1 + Math.random()) * 0x10000)
	            .toString(16)
	            .substring(1);
	    }
	
	    return function () {
	        return [s4() + s4(), s4(), s4(), s4(), s4() + s4() + s4()].join('-');
	    }
	})();
	
	
	tek.Query = function (string) {
	    if (!string) return;
	    var s = this;
	    string.split('&').forEach(function (query) {
	        var key_val = query.split('=');
	        var key = decodeURIComponent(key_val[0]);
	        s[key] = decodeURIComponent(key_val[1].replace(/\+/g, ' '));
	    });
	};
	tek.Query.fromLocation = function () {
	    var search = location.search;
	    return search && new tek.Query(search.replace('?', ''));
	};
	
	/**
	 * save data to local storage
	 * @param key
	 * @param obj
	 */
	tek.toStorage = function (key, obj) {
	    var isString = typeof (obj) === 'string',
	        string = isString ? obj : JSON.stringify(obj);
	    localStorage.setItem(key, string);
	};
	
	/**
	 * restore data from local storage
	 * @param key
	 * @returns {*}
	 */
	tek.fromStorage = function (key) {
	    var string = localStorage.getItem(key);
	    return JSON.parse(string);
	};
	
	tek.math = {};
	/**
	 * make sure to values to iteratable
	 * @param values
	 * @returns {*}
	 */
	tek.ensureIteratable = function (values) {
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
	tek.math.max = function () {
	    var max = null,
	        values = tek.ensureIteratable(arguments);
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
	tek.math.min = function () {
	    var min = null,
	        values = tek.ensureIteratable(arguments);
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
	tek.math.sum = function () {
	    var sum = 0,
	        values = tek.ensureIteratable(arguments);
	    for (var i = 0, len = values.length; i < len; i++) {
	        sum += values[i];
	    }
	    return sum;
	};
	
	/**
	 * get average of values
	 * @returns {number}
	 */
	tek.math.average = function () {
	    var values = tek.ensureIteratable(arguments);
	    var len = values.length;
	    var sum = tek.math.sum(values);
	    return  len ? (sum / len) : null;
	};
	
	/**
	 * composite functions
	 * @returns {Function}
	 */
	tek.composite = function (/**functions**/) {
	    var callables = Array.prototype.slice.call(arguments, 0);
	    return function () {
	        var s = this,
	            result = [];
	        for (var i = 0, len = callables.length; i < len; i++) {
	            var callable = callables[i];
	            var called = callable && callable.apply(s, arguments);
	            result = result.concat(called);
	        }
	        return result;
	    };
	};
	
	
	
	/**
	 * User: okunishitaka
	 * Date: 9/16/13
	 * Time: 3:36 PM
	 */
	
	/**
	 * copy properties
	 * @param src
	 * @param dst
	 */
	tek.copy = function (src, dst) {
	    for (var name in src) {
	        if (!src.hasOwnProperty(name)) continue;
	        dst[name] = src[name];
	    }
	    return dst;
	};
	
	/**
	 * recursive copy
	 * @param src
	 * @param dst
	 * @returns {*}
	 */
	tek.copy.deep = function (src, dst) {
	    var copy = tek.copy;
	    if (!src) return dst;
	    for (var key in src) {
	        if (!src.hasOwnProperty(key)) continue;
	        if (src[key] instanceof Date) {
	            dst[key] = new Date(src[key]);
	        } else if (src[key] instanceof Function) {
	            dst[key] = src[key];
	        } else {
	            if (src[key] instanceof Array) {
	                dst[key] = copy.deep(src[key], dst[key] || []);
	            } else if (src[key] instanceof Object) {
	                dst[key] = copy.deep(src[key], dst[key] || {});
	            } else {
	                dst[key] = src[key];
	            }
	        }
	    }
	    return dst;
	};
	
	
	tek.crossBrowser = function (window) {
	    window = tek.crossBrowser.window(window);
	    window.navigator = tek.crossBrowser.navigator(window.navigator || {});
	    return window;
	};
	tek.crossBrowser.window = function (window) {
	    window.requestAnimationFrame = tek.crossBrowser.window.dectect.requestAnimationFrame(window);
	    window.URL = tek.crossBrowser.window.dectect.URL(window);
	    return window;
	};
	tek.crossBrowser.window.dectect = {
	    requestAnimationFrame: function (window) {
	        return window.requestAnimationFrame ||
	            window.webkitRequestAnimationFrame ||
	            window.mozRequestAnimationFrame ||
	            window.oRequestAnimationFrame ||
	            window.msRequestAnimationFrame ||
	            function (callback) {
	                window.setTimeout(callback, 1000 / 60);
	            };
	    },
	    URL: function (window) {
	        return window.URL || window.webkitURL || window.mozURL || window.msURL;
	    }
	};
	
	tek.crossBrowser.navigator = function (navigator) {
	    navigator.getUserMedia = tek.crossBrowser.navigator.detect.getUserMedia(navigator);
	    return navigator;
	};
	tek.crossBrowser.navigator.detect = {
	    getUserMedia: function (navigator) {
	        return navigator.getUserMedia ||
	            navigator.webkitGetUserMedia ||
	            navigator.mozGetUserMedia ||
	            navigator.msGetUserMedia;
	    }
	};
	
	
	tek.Vector = tek.define({
	    init: function (values) {
	        var s = this;
	        for (var key in values) {
	            if (!values.hasOwnProperty(key)) continue;
	            s[key] = values[key];
	        }
	    },
	    attrAccessor: "".split(','),
	    properties: {
	        add: function (values) {
	            var s = this;
	            for (var key in s) {
	                if (!s.hasOwnProperty(key)) continue;
	                if (!values.hasOwnProperty(key)) continue;
	                s[key] += values[key];
	            }
	            return s;
	        },
	        scale: function (scale) {
	            var s = this;
	            for (var key in s) {
	                if (!s.hasOwnProperty(key)) continue;
	                s[key] = s[key] * scale;
	            }
	            return s;
	        },
	        revert: function () {
	            var s = this;
	            for (var key in s) {
	                if (!s.hasOwnProperty(key)) continue;
	                s[key] *= -1;
	            }
	            return s;
	        },
	        clone: function () {
	            var s = this;
	            return new tek.Vector(s);
	        }
	    }
	});
	tek.Vector.between = function (from, to) {
	    var Vector = tek.Vector;
	    return new Vector(to).clone().add(new Vector(from).clone().revert());
	};
	
	tek.Animation = tek.define({
	    init: function (from, to) {
	        var Vector = tek.Vector;
	        var s = this;
	        s.from = new Vector(from);
	        s.to = new Vector(to);
	        s.scope = Vector.between(from, to);
	    },
	    attrAccessor: "cursor,frameCount,done".split(','),
	    properties: {
	        _done: false,
	        _frameCount: 100,
	        _cursor: 0, /** indicates current position. 0 ~ 1**/
	        value: function () {
	            var s = this,
	                scale = s.ease(s._cursor);
	            return s.from.clone().add(s.scope.clone().scale(scale));
	        },
	        ease: function (proceed) {
	            //TODO
	            return proceed;
	        },
	        next: function () {
	            var s = this,
	                value = s.value();
	            s.move(1 / s._frameCount);
	            return value;
	        },
	        move: function (amount) {
	            var s = this;
	            s._cursor += amount;
	            if (s._cursor >= 1) {
	                s._done = true;
	                s._cursor = 1;
	            }
	        },
	        start: function (requestAnimationFrame, duration, callback) {
	            if (typeof(arguments[1]) === 'function') {
	                callback = arguments[1];
	                duration = 1500;
	            }
	            var s = this;
	            var startTime = new Date;
	            s._done = false;
	            s._cursor = 0;
	            (function loop() {
	                var t = new Date - startTime;
	                s.move(t / duration - s._cursor);
	                callback(s.value(), s._done);
	                if (!s._done) requestAnimationFrame(loop);
	            })();
	        }
	    }
	});
	tek.toSVG = function (html, w, h) {
	    if (typeof(Blob) === undefined) return null;
	    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'>" +
	        "<foreignObject width='100%' height='100%'>" +
	        "<div xmlns='http://www.w3.org/1999/xhtml'>" +
	        html +
	        "</div>" +
	        "</foreignObject>" +
	        "</svg>";
	    return  new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
	};
	/**
	 * filter to unique values
	 */
	tek.unique = function (values) {
	    var isArray = values instanceof Array;
	    if (!isArray) values = Array.prototype.splice.call(arguments, 0);
	    return values.filter(function (entry, i) {
	        var first = values.indexOf(entry);
	        return first === i;
	    });
	};
    
    return tek;
    
})(typeof(module) === 'undefined' ? null : module);