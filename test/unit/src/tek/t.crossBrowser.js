var crossBrowser = require('../../../../lib/src/javascripts/tek.js/09.crossBrowser')['crossBrowser'],
    should = require('should');


exports.fallbackWindowTest = function (test) {
    var window = {msURL: {}};
    crossBrowser.fallbackWindow(window);
    window.should.have.property('requestAnimationFrame');
    window.should.have.property('URL');
    test.done();
};

exports.fallbackNavigatorTest = function (test) {
    var navigator = {
        mozGetUserMedia: function () {
        }
    };
    crossBrowser.fallbackNavigator(navigator);
    navigator.should.have.property('getUserMedia');
    test.done();
};

exports.fallbackObjectTest = function (test) {
    var Obj = {};
    crossBrowser.fallbackObject(Obj);
    Obj.should.have.property('keys');
    test.done();
};