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