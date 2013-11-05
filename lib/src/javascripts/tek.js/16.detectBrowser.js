var detectBrowser = exports.detectBrowser = function (window) {
    var navigator = window.navigator;
    if (detectBrowser.isIE(navigator)) {
        return {
            browser: 'IE',
            version: detectBrowser.getIEVersion(navigator)
        }
    }
    if (detectBrowser.isChrome(window)) {
        return {
            browser: 'chrome',
            version: null //TODO
        }
    }
    if (detectBrowser.isFirefox(window)) {
        return {
            browser: 'firefox',
            version: null //TODO
        }
    }
    return null;
};
detectBrowser.isChrome = function (window) {
    return !!(window && window.chrome);
};

detectBrowser.isFirefox = function (navigator) {
    var ua = navigator && navigator.userAgent;
    return !!(ua && ua.toLowerCase().indexOf('firefox') > -1);
};


detectBrowser.isIE = function (navigator) {
    return navigator && navigator.appName == 'Microsoft Internet Explorer';
};
detectBrowser.getIEVersion = function (navigator) {
    var ua = navigator && navigator.userAgent;
    if (!ua) return null;
    var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    return re.exec(ua) ? parseFloat(RegExp.$1) : -1;
};