/**
 * Created by okunishitaka on 11/3/13.
 */

var should = require('should'),
    string = require('../../../../lib/src/javascripts/tek.js/14.string')['string'];

exports.toHiraganaTest = function (test) {
    string.toHiragana("あうえおカキクケコ").should.equal('あうえおかきくけこ');
    test.done();
};

exports.toKatakanaTest = function (test) {
    string.toKatakana("あいうえおカキクケコ").should.equal('アイウエオカキクケコ');
    test.done();
};

exports.toHankaku = function (test) {
    string.toHankaku('１２３4567Ａ').should.equal('1234567A');
    test.done();
};
exports.toZenkaku = function (test) {
    string.toZenkaku('１２３4567Ａ').should.equal('１２３４５６７Ａ');
    test.done();
};

exports.ambiguousMatch = function (test) {
    string.ambiguousMatch('１２３', '１２３４５６７Ａ').should.be.true;
    string.ambiguousMatch('1', '１２３４５６７Ａ').should.be.true;
    string.ambiguousMatch("ア", 'あいうえおカキクケコ').should.be.true;
    string.ambiguousMatch("ぬ", 'あいうえおカキクケコ').should.be.false;
    test.done();
};