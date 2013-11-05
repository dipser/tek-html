var detectBrowser = require('../../../../lib/src/javascripts/tek.js/16.detectBrowser')['detectBrowser'],
    should = require('should');

exports.isIETest = function (test) {
    detectBrowser.isIE({appName: 'Microsoft Internet Explorer'}).should.be.true;
    test.done();
};

exports.getIEVersionTest = function (test) {
    detectBrowser.getIEVersion({
        userAgent: 'MSIE 10.4'
    }).should.equal(10.4);
    test.done();
};

exports.isFirefoxTest = function (test) {
    detectBrowser.isFirefox({}).should.be.false;
    test.done();
};