exports.window = function (window) {
    window.requestAnimationFrame = exports.window.dectect.requestAnimationFrame(window);
    window.URL = exports.window.dectect.URL(window);
    return window;
};
exports.window.dectect = {
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

exports.navigator = function (navigator) {
    navigator.getUserMedia = exports.navigator.detect.getUserMedia(navigator);
    return navigator;
};
exports.navigator.detect = {
    getUserMedia: function (navigator) {
        return navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
    }
};