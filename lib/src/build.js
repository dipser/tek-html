#!/usr/bin/en node
var tek = require('tek'),
    file = tek['file'],
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
    var dir = resolve(srcDir, 'javascripts');
    var jobQueue = new JobQueue;
    eachDir(dir, function (moduleDir) {
        var filename = getFileName(moduleDir);
        jobQueue.push(function (next) {
            var format_file = resolve(dir, filename + '.format');
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


jobQueue.push(function (next) {
    next();
});

jobQueue.execute(function () {
    console.log('done!');
});