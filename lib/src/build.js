#!/usr/bin/en node
var tek = require('tek'),
    file = tek['file'],
    copy = file['copy'],
    isDir = file['isDir'],
    mkdirP = file['mkdirP'],
    cleanDir = file['cleanDir'],
    dirsInDir = file['dirsInDir'],
    filesInDir = file['filesInDir'],
    EOL = require('os')['EOL'],
    fs = require('fs'),
    getFileName = file['getFileName'],
    Format = tek['Format'],
    resolve = require('path')['resolve'],
    JobQueue = tek['JobQueue'];

var distDir = resolve(__dirname, '../../dist'),
    srcDir = resolve(__dirname);

function handleErr(err) {
    if (err) console.error(err);
    return true;
}


function eachDir(rootDir, callback) {
    fs.readdirSync(rootDir).forEach(function (name) {
        var dir = resolve(rootDir, name);
        if (!isDir(dir)) return;
        callback(dir);
    });
}

var jobQueue = new JobQueue;
jobQueue.push(function (next) {
    // build javascripts

    var jsSrcDir = resolve(srcDir, 'javascripts');
    var jobQueue = new JobQueue;
    eachDir(jsSrcDir, function (moduleDir) {
        var filename = getFileName(moduleDir);
        jobQueue.push(function (next) {
            var format_file = resolve(jsSrcDir, filename + '.format');
            fs.readFile(format_file, function (err, buffer) {
                err && handleErr(err);
                var content = new Format(buffer.toString()).apply({
                    name: filename.replace(/\.js$/, ''),
                    modules: require(moduleDir).toString()
                });
                var filepath = resolve(distDir, 'javascripts', filename);
                fs.writeFile(filepath, content, function (err) {
                    err && handleErr(err);
                    console.log('new file created:', filepath);
                    next();
                });
            });
        });
    });
    jobQueue.execute(next);
});

function fileContentsInDir(dirpath, callback) {
    var jobQueue = new JobQueue(),
        result = [];
    filesInDir(dirpath).forEach(function (filepath) {
        jobQueue.push(function (next) {
            fs.readFile(filepath, function (err, buffer) {
                err && handleErr(err);
                buffer && result.push(buffer.toString());
                next();
            });
        });
    });
    jobQueue
        .execute(function () {
            callback(result);
        });
}


jobQueue.push(function (next) {
    // build stylesheets
    var ssSrcDir = resolve(srcDir, 'stylesheets'),
        ssDistDir = resolve(distDir, 'stylesheets');
    var writeQueue = new JobQueue;
    fs.readdirSync(ssSrcDir).forEach(function (filename) {
        var ext = file.getExtension(filename);
        if (ext === '.format') return;
        if (ext === '.css') return;
        var outfile = resolve(ssDistDir, filename),
            infile = resolve(ssSrcDir, filename);
        if (isDir(infile)) {
            fs.readFile(resolve(ssSrcDir, filename + '.format'), function (err, buffer) {
                err && handleErr(err);
                fileContentsInDir(infile, function (contents) {
                    var format = new Format(buffer.toString()),
                        data = {
                            contents: contents.map(function (content) {
                                return content.replace(new RegExp("^.*@import.*" + EOL, "mg"), function (line) {
                                    return "";
                                });
                            }).join(EOL)
                        };
                    fs.writeFile(outfile, format.apply(data), function (err) {
                        err && handleErr(err);
                        next();
                    });
                });
                next();
            });
        } else {
            writeQueue.push(function (next) {
                copy(infile, outfile, function () {
                    console.log('new file created:', outfile);
                    next();
                });
            });
        }
    });
    writeQueue.execute(next);
});

jobQueue.execute(function () {
    console.log('done!');
});