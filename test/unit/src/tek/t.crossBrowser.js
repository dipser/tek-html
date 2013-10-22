var crossBrowser = require('../../../../lib/src/javascripts/tek.js/09.crossBrowser')['crossBrowser'],
    should = require('should');


exports.windowTest = function (test) {
    var window = {};
    crossBrowser.window(window);
    window.should.have.property('requestAnimationFrame');
    test.done();
};

exports.navigatorTest = function (test) {
    var navigator = {
        mozGetUserMedia: function () {
        }
    };
    crossBrowser.navigator(navigator);
    navigator.should.have.property('getUserMedia');
    test.done();
};

exports.ObjectTest ={};
exports.ObjectTest.keysTest = function(test){
    var keys = crossBrowser.Object.keys(null)({
        a:1
    });
    keys[0].should.equal('a');
    test.done();
};