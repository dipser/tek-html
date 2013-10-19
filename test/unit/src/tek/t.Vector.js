/**
 * Created by okunishitaka on 9/29/13.
 */
var should = require('should'),
    define = require('../../../../lib/src/javascripts/tek.js/01.define')['define'];
tek = {
    define: define
};

var Vector = require('../../../../lib/src/javascripts/tek.js/10.Vector.js')['Vector'];
exports.VectorTest = function (test) {
    var vector = new Vector({x: 10, y: 10});
    vector.should.have.property('x', 10);
    vector.clone().should.have.property('x', 10);
    vector.clone().scale(0.5).should.have.property('x', 5);
    vector.clone().revert().should.have.property('x', -10);
    vector.clone().add({y: 20}).should.have.property('y', 30);

    Vector.between({x: 1, y: 1}, {x: 5, y: 5}).should.have.property("x", 4);

    test.done();
};