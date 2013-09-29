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
        _done: false,
        _frameCount: 100,
        _cursor: 0, /** indicates current position. 0 ~ 1**/
        value: function () {
            var s = this,
                scale = s.ease(s._cursor);
            return s.from.clone().add(s.scope.clone().scale(scale));
        },
        ease: function (proceed) {
            //TODO
            return proceed;
        },
        next: function () {
            var s = this,
                value = s.value();
            s.move(1 / s._frameCount);
            return value;
        },
        move: function (amount) {
            var s = this;
            s._cursor += amount;
            if (s._cursor >= 1) {
                s._done = true;
                s._cursor = 1;
            }
        },
        start: function (requestAnimationFrame, duration, callback) {
            if (typeof(arguments[1]) === 'function') {
                callback = arguments[1];
                duration = 1500;
            }
            var s = this;
            var startTime = new Date;
            s._done = false;
            s._cursor = 0;
            (function loop() {
                var t = new Date - startTime;
                s.move(t / duration - s._cursor);
                callback(s.value(), s._done);
                if (!s._done) requestAnimationFrame(loop);
            })();
        }
    }
});