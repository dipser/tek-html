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
        async: false
    }
});
Validator.extend = function (isValid, async) {
    return define({
        prototype: Validator,
        properties: {
            async: async,
            isValid: isValid
        }
    });
};

var v = exports.validators = {};
v.Validator = Validator;

/**
 * RequiredValidator
 * @constructor
 */
v.RequiredValidator = Validator.extend(function (value) {
    var isFalse = (value === null) || (value === undefined) || (value === '');
    return !isFalse;
});

/**
 * MinLengthValidator
 * @constructor
 */
v.MinLengthValidator = Validator.extend(function (value) {
    var s = this;
    return s.expected <= value.length;
});

/**
 * MaxLengthValidator
 * @constructor
 */
v.MaxLengthValidator = Validator.extend(function (value) {
    var s = this;
    return value.length <= s.expected;
});

/**
 * PatternValidator
 * @constructor
 */
v.PatternValidator = Validator.extend(function (value) {
    var s = this;
    return !!value.match(s.expected);
});

/**
 * MinimumValidator
 * @constructor
 */
v.MinimumValidator = Validator.extend(function (value) {
    var s = this;
    return s.expected <= Number(value);
});

/**
 * MaximumValidator
 * @constructor
 */
v.MaximumValidator = Validator.extend(function (value) {
    var s = this;
    return Number(value) <= s.expected;
});

/**
 * TypeValidator
 * @constructor
 */
v.TypeValidator = Validator.extend(function (value) {
    var s = this;
    return typeof(value) === s.expected;
});

/**
 * ConformValidator
 * @constructor
 */
v.ConformValidator = Validator.extend(function (value, callback) {
    var s = this;
    s.expected(value, function (isValid) {
        callback(isValid);
    });
}, true);