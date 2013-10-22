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

exports.fallbackArrayTest = function (test) {
    var Array = {prototype: {}};
    crossBrowser.fallbackArray(Array);
    Array.should.have.property('map');
    Array.should.have.property('reduce');
    Array.should.have.property('filter');
    Array.should.have.property('forEach');
    test.done();
};