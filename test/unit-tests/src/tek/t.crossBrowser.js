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

    Obj.keys({a: 1, b: 2}).should.be.lengthOf(2);


    test.done();
};

exports.fallbackArrayTest = function (test) {
    var Array = {prototype: {}};
    crossBrowser.fallbackArray(Array);
    Array.prototype.should.have.property('map');
    Array.prototype.should.have.property('reduce');
    Array.prototype.should.have.property('filter');
    Array.prototype.should.have.property('forEach');
    test.done();
};

exports.fallbackStringTest = function (test) {
    var String = {prototype: {}};
    crossBrowser.fallbackString(String);
    String.prototype.should.have.property('trim');

    crossBrowser.fallbackString.fallbacks.trim.call(" abc ").should.equal('abc');

    test.done();
};