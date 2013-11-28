var define = tek.define;
/**
 * Validator
 * @constructor
 */
var Validator = define({
    init: function (expected) {
        var s = this;
        s.expected = expected;
    },
    properties: {
        skipIfEmpty: false,
        validate: function (value, callback) {
            callback();
        }
    }
});

/**
 * Err
 * @constructor
 */
Validator.Err = define({
    init: function (data) {
        var s = this;
        tek.copy(data, s);
    }
});

/**
 * define new Validator
 * @param properties
 * @returns Validator
 */
Validator.defineValidator = function (properties) {
    var Defined = define({
        prototype: Validator,
        properties: properties
    });
    tek.copy(Validator, Defined);
    return  Defined;
};

/**
 * is value empty or not
 * @param value
 * @returns {boolean}
 */
Validator.isEmpty = function (value) {
    return (value === null) || (value === undefined) || (value === '');
};


var v = exports.validators = {};
v.Validator = Validator;

var Err = Validator.Err,
    defineValidator = Validator.defineValidator;

/**
 * RequiredValidator
 * @constructor
 */
v.RequiredValidator = defineValidator({
    validate: function (value, callback) {
        var s = this;
        var actual = Validator.isEmpty(value),
            expected = false;
        var valid = actual === expected,
            err = valid ? null : new Err({
                cause: 'required',
                expected: expected,
                actual: actual
            });
        callback(err);
    },
    skipIfEmpty: false
});

/**
 * MinLengthValidator
 * @constructor
 */
v.MinLengthValidator = defineValidator({
    validate: function (value, callback) {
        var s = this,
            actual = value.length,
            expected = s.expected;
        var valid = expected <= actual,
            err = valid ? null : new Err({
                cause: 'too_short',
                expected: expected,
                actual: actual
            });
        callback(err);
    },
    skipIfEmpty: true
});

/**
 * MaxLengthValidator
 * @constructor
 */
v.MaxLengthValidator = defineValidator({
    validate: function (value, callback) {
        var s = this,
            actual = value.length,
            expected = s.expected;
        var valid = actual <= expected,
            err = valid ? null : new Err({
                cause: 'too_long',
                expected: expected,
                actual: actual
            });
        callback(err);
    },
    skipIfEmpty: true
});

/**
 * PatternValidator
 * @constructor
 */
v.PatternValidator = defineValidator({
    validate: function (value, callback) {
        var s = this,
            actual = String(value),
            expected = s.expected;
        var valid = !!actual.match(s.expected),
            err = valid ? null : new Err({
                cause: 'not_match',
                expected: expected,
                actual: actual
            });
        callback(err);
    },
    skipIfEmpty: true
});

/**
 * MinimumValidator
 * @constructor
 */
v.MinimumValidator = defineValidator({
    validate: function (value, callback) {
        var s = this,
            actual = Number(value),
            expected = s.expected;
        var valid = expected <= actual,
            err = valid ? null : new Err({
                cause: 'too_small',
                expected: expected,
                actual: actual
            });
        callback(err);
    },
    skipIfEmpty: true
});

/**
 * MaximumValidator
 * @constructor
 */
v.MaximumValidator = defineValidator({
    validate: function (value, callback) {
        var s = this,
            actual = Number(value),
            expected = s.expected;
        var valid = actual <= expected,
            err = valid ? null : new Err({
                cause: 'too_large',
                expected: expected,
                actual: actual
            });
        callback(err);
    },
    skipIfEmpty: true
});

/**
 * TypeValidator
 * @constructor
 */
v.TypeValidator = defineValidator({
    validate: function (value, callback) {
        var s = this,
            actual = typeof(value),
            expected = s.expected;
        var valid = typeof(value) === s.expected,
            err = valid ? null : new Err({
                cause: 'different_type',
                expected: expected,
                actual: actual
            });
        callback(err)
    },
    skipIfEmpty: true
});

v.FormatValidator = defineValidator({
    validate: function (value, callback) {
        var s = this,
            expected = s.expected,
            actual = String(value),
            valid = true;
        switch (expected) {
            case 'email':
                valid = !!actual.match(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
                break;
        }
        var err = valid ? null : new Err({
            cause: 'mulformat',
            expected: expected,
            actual: actual
        });
        callback(err);
    },
    skipIfEmpty: true
});

/**
 * ConformValidator
 * @constructor
 */
v.ConformValidator = defineValidator({
    validate: function (value, callback) {
        var s = this;
        s.expected(value, callback);
    }
});



