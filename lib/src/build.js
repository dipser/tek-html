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

function collectJavascripts(moduleDir, callback) {
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
        callback(modules);
    });
}

function writeJavascript(filename, content, callback) {
    var filepath = resolve(distDir, 'javascripts', filename);
    fs.writeFile(filepath, content, function (err) {
        if (err) {
            handleErr(err);
        } else {
            console.log('new file created:', filepath);
        }
        callback(!err);
    });
}

var jobQueue = new JobQueue;

jobQueue.push(function (next) {
    var dir = resolve(srcDir, 'javascripts');
    var jobQueue = new JobQueue;
    fs.readdirSync(dir).forEach(function (name) {
        var moduleDir = resolve(dir, name);
        if (!isDir(moduleDir)) return;
        var filename = getFileName(moduleDir);
        jobQueue.push(function (next) {
            fs.readFile(resolve(dir, filename + '.format'), function (err, buffer) {
                if (err) handleErr(err) && next.abort();
                var format = new Format(buffer.toString());
                collectJavascripts(moduleDir, function (modules) {
                    var content = format.apply({
                        name: filename.split('.').shift(),
                        modules: modules.join(EOL)
                    });
                    writeJavascript(filename, content, function (success) {
                        (success ? next : next.abort)();
                    });
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