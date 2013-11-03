#!/usr/bin/en node
var tek = require('tek'),
    file = tek['file'],
    copy = file['copy'],
    isDir = file['isDir'],
    mkdirP = file['mkdirP'],
    filesInDir = file['filesInDir'],
    EOL = require('os')['EOL'],
    fs = require('fs'),
    getFileName = file['getFileName'],
    Format = tek['Format'],
    dateformat = require('dateformat'),
    path = require('path'),
    basename = path.basename,
    resolve = path['resolve'],
    exec = require('child_process').exec,
    JobQueue = tek['JobQueue'];

var distDir = resolve(__dirname, '../../dist'),
    srcDir = resolve(__dirname);

function handleErr(err) {
    if (err) console.error(err);
    return true;
}

var sign = {
    version: require('../../package.json')['version'],
    author: 'Taka Okunishi',
    date: dateformat(new Date, 'yyyy-mm-dd'),
    year: new Date().getFullYear()
};

function eachDir(rootDir, callback) {
    fs.readdirSync(rootDir).forEach(function (name) {
        var dir = resolve(rootDir, name);
        if (!isDir(dir)) return;
        callback(dir);
    });
}

var jobQueue = new JobQueue;

jobQueue.push(function (next) {
    console.log('-- build hbs start ---');
    var hbsSrcDir = resolve(srcDir, 'hbs');
    eachDir(hbsSrcDir, function (moduleDir) {
        var moduleName = getFileName(moduleDir);
        var src = resolve(moduleDir, '*.hbs'),
            out = resolve(srcDir, 'javascripts', moduleName, '00.hbs.templates.js');
        exec(['handlebars', src, '-f', out, '-e', 'hbs'].join(' '), function (err, stdout, stderr) {
            err && handleErr(err);
            stderr && handleErr(stderr);
            fs.readFile(out, function (err, buffer) {
                err && handleErr(err);
                var content = [
                    "var Handlebars = global['hbs'];",
                    buffer.toString()
                ].join(EOL);
                fs.writeFile(out, content, function (err) {
                    err && handleErr(err);
                    next();
                });
            });
        });
    });
});

jobQueue.push(function (next) {
    console.log('-- build javascripts start --');
    var jsSrcDir = resolve(srcDir, 'javascripts');
    var writeQueue = new JobQueue;
    eachDir(jsSrcDir, function (moduleDir) {
        var filename = getFileName(moduleDir);
        writeQueue.push(function (next) {
            var format_file = resolve(jsSrcDir, filename, 'format');
            fs.readFile(format_file, function (err, buffer) {
                err && handleErr(err);
                var name = filename.replace(/\.js$/, '');
                var content = new Format(buffer.toString()).apply({
                    version: sign.version,
                    author: sign.author,
                    date: sign.date,
                    year: sign.year,
                    name: name,
                    modules: require(moduleDir).toString().replace(/exports\./mg, name + ".")
                });
                var filepath = resolve(distDir, 'javascripts', filename);
                fs.writeFile(filepath, content, function (err) {
                    err && handleErr(err);
                    console.log('\t', getFileName(filepath));
                    next();
                });
            });
        });
    });
    writeQueue.execute(function () {
        next();
    });
});

function fileContentsInDir(dirpath, callback, ignore) {
    var jobQueue = new JobQueue(),
        result = [];
    filesInDir(dirpath).forEach(function (filepath) {
        var isFormat = basename(filepath) === 'format';
        if (isFormat) return;
        if (ignore && filepath.match(ignore)) return;
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
    console.log('-- build stylesheets start --');
    var ssSrcDir = resolve(srcDir, 'stylesheets'),
        ssDistDir = resolve(distDir, 'stylesheets');
    var writeQueue = new JobQueue;
    fs.readdirSync(ssSrcDir).forEach(function (filename) {
        var ext = file.getExtension(filename);
        if (ext === '.css') return;
        var outfile = resolve(ssDistDir, filename),
            infile = resolve(ssSrcDir, filename);

        if (isDir(infile)) {
            var format_filepath = resolve(ssSrcDir, filename, 'format');
            writeQueue.push(function (next) {
                fs.exists(format_filepath, function (exists) {
                    if (!exists) {
                        console.error('build failed! format file not found:', format_filepath);
                        next.abort();
                    } else {
                        next();
                    }
                });
            });
            writeQueue.push(function (next) {
                fs.readFile(format_filepath, function (err, buffer) {
                    err && handleErr(err);
                    fileContentsInDir(infile, function (contents) {
                        var format = new Format(buffer && buffer.toString()),
                            data = {
                                version: sign.version,
                                author: sign.author,
                                date: sign.date,
                                contents: contents.map(function (content) {
                                    return content
                                        .replace(new RegExp("^.*@import.*" + EOL, "mg"), function (line) {
                                            return "";
                                        });
                                }).join(EOL)
                            };
                        fs.writeFile(outfile, format.apply(data), function (err) {
                            err && handleErr(err);
                            console.log('\t', getFileName(outfile));
                            next();
                        });
                    }, /\.css$/);
                });
            });
        } else {
            writeQueue.push(function (next) {
                copy(infile, outfile, function () {
                    console.log('\t', getFileName(outfile));
                    next();
                });
            });
        }
    });
    writeQueue.execute(next);
});

jobQueue.execute(function () {
    console.log('build-src done!');
});