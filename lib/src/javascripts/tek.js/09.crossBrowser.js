exports.crossBrowser = function (window) {
    window = exports.crossBrowser.fallbackWindow(window);
    window.navigator = exports.crossBrowser.fallbackNavigator(window.navigator || {});
    return window;
};
exports.crossBrowser.fallbackWindow = function (window) {
    var fallbacks = exports.crossBrowser.fallbackWindow.fallbacks;
    window.requestAnimationFrame = window.requestAnimationFrame || fallbacks.requestAnimationFrameFallback(window);
    window.URL = window.URL || fallbacks.URLFallback(window);
    return window;
};
exports.crossBrowser.fallbackWindow.fallbacks = {
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

exports.crossBrowser.fallbackNavigator = function (navigator) {
    var fallbacks = exports.crossBrowser.fallbackNavigator.fallbacks;
    navigator.getUserMedia = navigator.getUserMedia || fallbacks.getUserMediaFallback(navigator);
    return navigator;
};
exports.crossBrowser.fallbackNavigator.fallbacks = {
    getUserMediaFallback: function (navigator) {
        return navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
    }
};

exports.crossBrowser.fallbackObject = function (Object) {
    var fallbacks = exports.crossBrowser.fallbackObject.fallbacks;
    Object.keys = Object.keys || fallbacks.keysFallback;
};
exports.crossBrowser.fallbackObject.fallbacks = {
    keysFallback: function (keys) {
        return keys || (function () {
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
        }())
    }
};
