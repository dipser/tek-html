#!/usr/bin/en node
var tek = require('tek'),
    file = tek['file'],
    isDir = file['isDir'],
    mkdirP = file['mkdirP'],
    cleanDir = file['cleanDir'],
    dirsInDir = file['dirsInDir'],
    os = require('os'),
    fs = require('fs'),
    Format = tek['Format'],
    resolve = require('path')['resolve'],
    JobQueue = tek['JobQueue'];

var distDir = resolve(__dirname, '../../dist'),
    srcDir = resolve(__dirname);

function handleErr(err) {
    if (err) console.error(err);
}

var jobQueue = new JobQueue;

jobQueue.push(function (next) {

});

fs.readdirSync(srcDir).forEach(function (subdir) {
    jobQueue.push(function (next) {
        mkdirP(resolve(distDir, subdir), next);
    });
});
dirsInDir(srcDir).forEach(function (dirpath) {
    jobQueue.push(function (next) {
        fs.readdir(dirpath, function (err, files) {
            if (err) handleErr(err);
            files = files.map(function (file) {
                return resolve(dirpath, file);
            }).filter(function (filepath) {
                    return !isDir(filepath);
                });
            console.log(dirpath);
        });
        next();
    });
})
;

jobQueue.execute(function () {
    console.log('done!');
});