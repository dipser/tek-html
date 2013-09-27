#!/usr/bin/en node
var tek = require('tek'),
    file = tek['file'],
    isDir = file['isDir'],
    mkdirP = file['mkdirP'],
    cleanDir = file['cleanDir'],
    dirsInDir = file['dirsInDir'],
    filesInDir = file['filesInDir'],
    EOL = require('os')['EOL'],
    TAB = '\t',
    fs = require('fs'),
    Format = tek['Format'],
    resolve = require('path')['resolve'],
    JobQueue = tek['JobQueue'];

var distDir = resolve(__dirname, '../../dist'),
    srcDir = resolve(__dirname);

function handleErr(err) {
    if (err) console.error(err);
    return true;
}

function buildJavascripts(format, moduleDir, callback) {
    var getFileName = file['getFileName'],
        fileName = getFileName(moduleDir);
    var jobQueue = new JobQueue,
        modules = [];
    filesInDir(moduleDir).forEach(function (filepath) {
        jobQueue.push(function (next) {
            fs.readFile(filepath, function (err, buffer) {
                if (err) handleErr(err) && next.abort();
                modules.push(TAB + buffer.toString().replace(new RegExp(EOL, 'g'), EOL + TAB));
                next();
            });
        });
    });
    jobQueue.execute(function () {
        var data = format.apply({
                name: fileName.split('.').shift(),
                modules: modules.join(EOL)
            }
        );
        callback(fileName, data);
    });
}


var jobQueue = new JobQueue;

jobQueue.push(function (next) {
    var dir = resolve(srcDir, 'javascripts');
    var jobQueue = new JobQueue,
        format = null;
    jobQueue.push(function (next) {
        fs.readFile(resolve(dir, 'javascripts.format'), function (err, buffer) {
            if (err) handleErr(err) && next.abort();
            format = new Format(buffer.toString());
            next();
        });
    });
    fs.readdirSync(dir).forEach(function (name) {
        var moduleDir = resolve(dir, name);
        if (!isDir(moduleDir)) return;
        jobQueue.push(function (next) {
            buildJavascripts(format, moduleDir, function (filename, data) {
                var filepath = resolve(distDir, 'javascripts', filename);
                fs.writeFile(filepath, data, function (err) {
                    if (err) handleErr(err) && next.abort();
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