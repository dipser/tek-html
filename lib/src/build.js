#!/usr/bin/en node
var tek = require('tek'),
    file = tek['file'],
    isDir = file['isDir'],
    mkdirP = file['mkdirP'],
    cleanDir = file['cleanDir'],
    dirsInDir = file['dirsInDir'],
    filesInDir = file['filesInDir'],
    os = require('os'),
    fs = require('fs'),
    Format = tek['Format'],
    resolve = require('path')['resolve'],
    JobQueue = tek['JobQueue'];

var distDir = resolve(__dirname, '../../dist'),
    srcDir = resolve(__dirname),
    JSDir = resolve(srcDir, 'javascripts');

function handleErr(err) {
    if (err) console.error(err);
}

var jobQueue = new JobQueue;

fs.readdirSync(JSDir).forEach(function (name) {
    var moduleDir = resolve(JSDir, name);
    if (!isDir(moduleDir)) return;
    filesInDir(moduleDir).forEach(function (filepath) {
        jobQueue.push(function (next) {
            fs.readFile(filepath, function (err, buffer) {
                if (err) {
                    handleErr(err);
                    next.abort();
                } else {
                    next();
                }
            });
        });
    });
});
jobQueue.push(function (next) {
    next();
});

jobQueue.execute(function () {
    console.log('done!');
});