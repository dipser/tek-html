exports.Animation = tek.define({
    init: function (from, to) {
        var Vector = tek.Vector;
        var s = this;
        s.from = new Vector(from);
        s.to = new Vector(to);
        s.scope = Vector.between(from, to);
    },
    attrAccessor: "cursor,frameCount,done".split(','),
    properties: {
        _done: function () {
            console.log('animaction done!');
        },
        _frameCount: 100,
        _cursor: 0, /** indicates current position. 0 ~ 1**/
        value: function () {
            var s = this;
            return s.from.clone().add(s.scope.clone().scale(s._cursor));
        },
        next: function () {
            var s = this;
            s._cursor += (1 / s._frameCount);
            if (s._cursor >= 1) {
                var done = s.done();
                done && done();
                s._cursor = 1;
            }
            return s.value();
        }
    }
});