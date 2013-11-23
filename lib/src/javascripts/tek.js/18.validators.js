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
 * validate all
 * @param validators
 * @param value
 * @param callback
 */
Validator.validateAll = function (validators, value, callback) {
    var validator = validators.pop();
    if (validator) {
        Validator.validateAll(validators, value, function (errors) {
            var isEmpty = Validator.isEmpty(value),
                skip = isEmpty && validator.skipIfEmpty;
            if (skip) {
                callback(errors);
                return;
            }
            validator.validate(value, function (err) {
                if (err) errors.push(err);
                callback(errors);
            });
        });
    } else {
        callback([]);
    }
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


