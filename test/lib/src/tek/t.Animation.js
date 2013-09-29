/**
 * Created by okunishitaka on 9/29/13.
 */

var should = require('should'),
    define = require('../../../../lib/src/javascripts/tek.js/01.define')['define'];
tek = {
    define: define
};
var Vector = require('../../../../lib/src/javascripts/tek.js/10.Vector.js')['Vector'];
tek.Vector = Vector;
var Animation = require('../../../../lib/src/javascripts/tek.js/11.Animation.js')['Animation'];

exports.AnimationTest = function (test) {
    var animation = new Animation({
        x: 1, y: 1
    }, {
        x: 3, y: 3
    }).frameCount(2);
    animation.done(function () {
        true.should.be.true;
    });
    animation.next().should.have.property('x', 2);
    animation.next().should.have.property('x', 3);
    animation.next().should.have.property('x', 3);
    test.done();
};