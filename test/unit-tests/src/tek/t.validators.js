var should = require('should'),
    validators = require('../../../../lib/src/javascripts/tek.js/18.validators').validators;


exports.RequiredValidatorTest = function (test) {
    var validator = new validators.RequiredValidator;
    validator.isValid(null).should.be.false;
    validator.isValid(undefined).should.be.false;
    validator.isValid('').should.be.false;
    validator.isValid(0).should.be.true;
    validator.isValid("abc").should.be.true;
    test.done();
};

exports.MinLengthValidatorTest = function (test) {
    var validator = new validators.MinLengthValidator(4);
    validator.isValid('abc').should.be.false;
    validator.isValid('abcd').should.be.true;
    validator.isValid([1, 2, 3]).should.be.false;
    validator.isValid([1, 2, 3, 4]).should.be.true;
    test.done();
};

exports.MaxLengthValidatorTest = function (test) {
    var validator = new validators.MaxLengthValidator(4);
    validator.isValid('abcd').should.be.true;
    validator.isValid('abcde').should.be.false;
    validator.isValid([1, 2, 3, 4]).should.be.true;
    validator.isValid([1, 2, 3, 4, 5]).should.be.false;
    test.done();
};

exports.PatternValidatorTest = function (test) {
    var validator = new validators.PatternValidator(/a\d+/);
    validator.isValid("a1234").should.be.true;
    validator.isValid("a").should.be.false;
    test.done();
};

exports.MinimumValidatorTest = function (test) {
    var validator = new validators.MinimumValidator(2);
    validator.isValid(2).should.be.true;
    validator.isValid("2").should.be.true;
    validator.isValid(1).should.be.false;
    validator.isValid("1").should.be.false;
    test.done();
};

exports.MaximumValidatorTest = function (test) {
    var validator = new validators.MaximumValidator(3);
    validator.isValid(3).should.be.true;
    validator.isValid(4).should.be.false;
    test.done();
};

exports.TypeValidatorTest = function (test) {
    var numberValidator = new validators.TypeValidator('number');
    numberValidator.isValid('abc').should.be.false;
    numberValidator.isValid(123).should.be.true;
    test.done();
};

exports.ConformValidatorTest = function (test) {
    var validator = new validators.ConformValidator(function (value, callback) {
        callback(false);
    });
    validator.isValid(1234, function (isValid) {
        isValid.should.be.false;
        test.done();
    })
};