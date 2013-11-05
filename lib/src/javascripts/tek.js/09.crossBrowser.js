var crossBrowser = exports.crossBrowser = function (window) {
    crossBrowser.fallbackObject(window.Object);
    crossBrowser.fallbackArray(window.Array);
    window = crossBrowser.fallbackWindow(window);
    window.navigator = crossBrowser.fallbackNavigator(window.navigator || {});
    return window;
};
crossBrowser.fallbackWindow = function (window) {
    var fallbacks = crossBrowser.fallbackWindow.fallbacks;
    window.requestAnimationFrame = window.requestAnimationFrame || fallbacks.requestAnimationFrameFallback(window);
    window.URL = window.URL || fallbacks.URLFallback(window);
    return window;
};
crossBrowser.fallbackWindow.fallbacks = {
    requestAnimationFrameFallback: function (window) {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    },
    URLFallback: function (window) {
        return window.URL || window.webkitURL || window.mozURL || window.msURL;
    }
};

crossBrowser.fallbackNavigator = function (navigator) {
    var fallbacks = crossBrowser.fallbackNavigator.fallbacks;
    navigator.getUserMedia = navigator.getUserMedia || fallbacks.getUserMediaFallback(navigator);
    return navigator;
};
crossBrowser.fallbackNavigator.fallbacks = {
    getUserMediaFallback: function (navigator) {
        return navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
    }
};

crossBrowser.fallbackObject = function (Object) {
    var fallbacks = crossBrowser.fallbackObject.fallbacks;
    Object.keys = Object.keys || fallbacks.keysFallback;
};
crossBrowser.fallbackObject.fallbacks = {
    keysFallback: function () {
        'use strict';
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }

            var result = [], prop, i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }
};


crossBrowser.fallbackArray = function (Array) {
    var fallbacks = crossBrowser.fallbackArray.fallbacks;
    Array.prototype.map = Array.prototype.map || fallbacks.mapFallback;
    Array.prototype.reduce = Array.prototype.reduce || fallbacks.reduceFallback;
    Array.prototype.filter = Array.prototype.filter || fallbacks.filterFallback;
    Array.prototype.forEach = Array.prototype.forEach || fallbacks.forEachFallback;
};
crossBrowser.fallbackArray.fallbacks = {
    mapFallback: function (callback, thisArg) {

        var T, A, k;

        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }

        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg) {
            T = thisArg;
        }

        // 6. Let A be a new array created as if by the expression new Array(len) where Array is
        // the standard built-in constructor with that name and len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[ k ];

                // ii. Let mappedValue be the result of calling the Call internal method of callback
                // with T as the this value and argument list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

                // For best browser support, use the following:
                A[ k ] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
    },
    reduceFallback: function (callback, opt_initialValue) {
        'use strict';
        if (null === this || 'undefined' === typeof this) {
            // At the moment all modern browsers, that support strict mode, have
            // native implementation of Array.prototype.reduce. For instance, IE8
            // does not support strict mode, so this check is actually useless.
            throw new TypeError(
                'Array.prototype.reduce called on null or undefined');
        }
        if ('function' !== typeof callback) {
            throw new TypeError(callback + ' is not a function');
        }
        var index, value,
            length = this.length >>> 0,
            isValueSet = false;
        if (1 < arguments.length) {
            value = opt_initialValue;
            isValueSet = true;
        }
        for (index = 0; length > index; ++index) {
            if (this.hasOwnProperty(index)) {
                if (isValueSet) {
                    value = callback(value, this[index], index, this);
                }
                else {
                    value = this[index];
                    isValueSet = true;
                }
            }
        }
        if (!isValueSet) {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        return value;
    },
    filterFallback: function (fun /*, thisp*/) {
        'use strict';

        if (!this) {
            throw new TypeError();
        }

        var objects = Object(this);
        var len = objects.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = [];
        var thisp = arguments[1];
        for (var i in objects) {
            if (objects.hasOwnProperty(i)) {
                if (fun.call(thisp, objects[i], i, objects)) {
                    res.push(objects[i]);
                }
            }
        }

        return res;
    },
    forEachFallback: function (fn, scope) {
        'use strict';
        var i, len;
        for (i = 0, len = this.length; i < len; ++i) {
            if (i in this) {
                fn.call(scope, this[i], i, this);
            }
        }
    }
}
;
