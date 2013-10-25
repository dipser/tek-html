var UglifyJS = require('uglify-js'),
    fs = require('fs'),
    tek = require('tek'),
    filesInDir = tek['file']['filesInDir'],
    extname = require('path')['extname'],
    JobQueue = tek['JobQueue'];

/**
 *
 * @type {Function}
 */
exports = module.exports = function (inpath, outpath, callback) {
    switch (extname(inpath)) {
        case '.js':
            exports.minifyJS(inpath, outpath, callback);
            break;
    }
};

exports.minifyJS = function (inpath, outpath, callback) {
    var data = UglifyJS.minify(inpath);
    fs.writeFile(outpath, data.code, function (err) {
        err && handleErr(err);
        callback && callback();
    });
};

function handleErr(err) {
    console.error(err);
}
exports.concatFiles = function (in_files, outfile, callback) {
    var queue = new JobQueue().timeout(50000);
    queue.push(function (next) {
        fs.writeFile(outfile, '', function (err) {
            err && handleErr(err);
            next();
        });
    });
    in_files.forEach(function (filepath) {
        queue.push(function (next) {
            fs.readFile(filepath, function (err, buffer) {
                err && handleErr(err);
                fs.appendFile(outfile, buffer, function (err) {
                    err && handleErr(err);
                    next();
                });
            });
        });
    });
    queue.execute(function () {
        callback && callback();
    });
};

/**
 * minify all files in dir
 * @param dirpath
 * @param callback
 */
exports.minifyAllJS = function (dirpath, outpath, callback, priorities) {
    if (!priorities) priorities = [];
    function getPriority(filepath) {
        var i;
        for (i = 0; i < priorities.length; i++) {
            var hit = filepath.match(priorities[i]);
            if (hit) return i;
        }
        return i + 1;
    }

    var js_files = filesInDir(dirpath).filter(function (filepath) {
        return extname(filepath) === '.js';
    }).sort(function (a, b) {
            return getPriority(a) - getPriority(b);
        });
    exports.concatFiles(js_files, outpath, function () {
        exports.minifyJS(outpath, outpath, callback);
    });
};