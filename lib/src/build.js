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

function collectModules(moduleDir, callback) {
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

function writeFile(filepath, content, callback) {
    fs.writeFile(filepath, content, function (err) {
        if (err) {
            handleErr(err);
        } else {
            console.log('new file created:', filepath);
        }
        callback(!err);
    });
}

function publishJavascript(filename, format_file, moduleDir, callback) {
    fs.readFile(format_file, function (err, buffer) {
        if (err) {
            handleErr(err);
            callback(false);
            return;
        }
        var format = new Format(buffer.toString());
        collectModules(moduleDir, function (modules) {
            var content = format.apply({
                name: filename.split('.').shift(),
                modules: modules.join(EOL)
            });
            var filepath = resolve(distDir, 'javascripts', filename);
            writeFile(filepath, content, function (success) {
                callback(success);
            });
        });
    });
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
            publishJavascript(filename, format_file, moduleDir, function (success) {
                (success ? next : next.abort)();
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