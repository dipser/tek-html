var should = require('should');
tek = {
    define: require('../../../../lib/src/javascripts/tek.js/01.define')['define'],
    copy: require('../../../../lib/src/javascripts/tek.js/08.copy')['copy']
};
var validators = require('../../../../lib/src/javascripts/tek.js/18.validators').validators;


exports.RequiredValidatorTest = function (test) {
    var validator = new validators.RequiredValidator;
    validator.validate(null, function (err) {
        should.exist(err);
        validator.validate(undefined, function (err) {
            should.exist(err);
            validator.validate('', function (err) {
                should.exist(err);
                validator.validate(0, function (err) {
                    should.not.exist(err);
                    validator.validate("abc", function (err) {
                        should.not.exist(err);
                        test.done();
                    });
                });
            });
        });
    });
};

exports.MinLengthValidatorTest = function (test) {
    var validator = new validators.MinLengthValidator(4);
    validator.validate('abc', function (err) {
        should.exist(err);
        validator.validate('abcd', function (err) {
            should.not.exist(err);
            validator.validate([1, 2, 3], function (err) {
                should.exist(err);
                validator.validate([1, 2, 3, 4], function (err) {
                    should.not.exist(err);
                    test.done();
                });
            });
        });
    });
};

exports.MaxLengthValidatorTest = function (test) {
    var validator = new validators.MaxLengthValidator(4);
    validator.validate('abcd', function (err) {
        should.not.exist(err);
        validator.validate('abcde', function (err) {
            should.exist(err);
            validator.validate([1, 2, 3, 4], function (err) {
                should.not.exist(err);
                validator.validate([1, 2, 3, 4, 5], function (err) {
                    should.exist(err);
                    test.done();
                });
            });
        });
    });
}
;

exports.PatternValidatorTest = function (test) {
    var validator = new validators.PatternValidator(/a\d+/);
    validator.validate("a1234", function (err) {
        should.not.exist(err);
        validator.validate("a", function (err) {
            should.exist(err);
            test.done();
        });
    });
};

exports.MinimumValidatorTest = function (test) {
    var validator = new validators.MinimumValidator(2);
    validator.validate(2, function (err) {
        should.not.exist(err);
        validator.validate("2", function (err) {
            should.not.exist(err);
            validator.validate(1, function (err) {
                should.exist(err);
                validator.validate("1", function (err) {
                    should.exist(err);
                    test.done();
                });
            });
        });
    });
};

exports.MaximumValidatorTest = function (test) {
    var validator = new validators.MaximumValidator(3);
    validator.validate(3, function (err) {
        should.not.exist(err);
        validator.validate(4, function (err) {
            should.exist(err);
            test.done();
        });
    });
};

exports.TypeValidatorTest = function (test) {
    var numberValidator = new validators.TypeValidator('number');
    numberValidator.validate('abc', function (err) {
        should.exist(err);
        numberValidator.validate(123, function (err) {
            should.not.exist(err);
            test.done();
        });
    });
};

exports.ConformValidatorTest = function (test) {
    var validator = new validators.ConformValidator(function (value, callback) {
        callback(null);
    });
    validator.validate(1234, function (err) {
        should.not.exist(err);
        test.done();
    })
};


exports.FormatValidatorTest = function (test) {
    var validator = new validators.FormatValidator('email');
    validator.validate('123', function (err) {
        should.exist(err);
        validator.validate('a@example.com', function (err) {
            should.not.exist(err);
            test.done();
        });
    });
};