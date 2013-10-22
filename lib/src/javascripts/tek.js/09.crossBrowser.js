exports.crossBrowser = function (window) {
    window = exports.crossBrowser.window(window);
    window.navigator = exports.crossBrowser.navigator(window.navigator || {});
    return window;
};
exports.crossBrowser.window = function (window) {
    window.requestAnimationFrame = exports.crossBrowser.window.dectect.requestAnimationFrame(window);
    window.URL = exports.crossBrowser.window.dectect.URL(window);
    return window;
};
exports.crossBrowser.window.dectect = {
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

exports.crossBrowser.navigator = function (navigator) {
    navigator.getUserMedia = exports.crossBrowser.navigator.detect.getUserMedia(navigator);
    return navigator;
};
exports.crossBrowser.navigator.detect = {
    getUserMedia: function (navigator) {
        return navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
    }
};

exports.crossBrowser.Object = function(Object){
    Object.keys = exports.crossBrowser.Object.keys(Object.keys);
};
exports.crossBrowser.Object.keys = function(keys){
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
};
