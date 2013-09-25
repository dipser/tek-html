var $ = require('cheerio'),
    fs = require('fs'),
    prettyPrint = require('html')['prettyPrint'],
    resolve = require('path')['resolve'],
    tek = require('tek'),
    file = tek['file'],
    request = require('request'),
    JobQueue = tek['JobQueue'],
    exists = file.exists,
    isDir = file.isDir;

function isRemote(path) {
    return path && path.match(/^http/);
}
function toFiles(path) {
    if (isDir(path)) {
        return file.filesInDir(path);
    } else {
        return [path];
    }
}
function read(path, callback) {
    if (isRemote(path)) {
        request(path, function (err, response, body) {
            callback(body);
        });
    } else {
        fs.readFile(path, 'utf-8', function (err, data) {
            if (err) console.error(err);
            callback(data);
        });
    }
}

function createStyle(href, callback) {
    if (href) {
        read(href, function (data) {
            var result = ['<style type="text/css">', data, '</style>'].join('\n');
            callback(result);
        });
    } else {
        callback('');
    }
}
function toBase64(path, callback) {
    if (exists(path)) {
        var getExtension = file.getExtension;
        fs.readFile(path, function (err, buffer) {
            var extension = getExtension(path);
            var result = "data:image/" + extension + ";base64, " + buffer.toString('base64');
            callback(result);
        });
    } else {
        callback('');
    }
}
function compact(src, out, callback) {
    var dir = resolve(src, '..');

    function toFullPath(path) {
        if (isRemote(path)) {
            return path;
        } else {
            return resolve(dir, path);
        }
    }

    read(src, function (html) {
        html = html.replace(/script/g, '_script');
        var doc = $('<div/>').append(html);
        var jobQueue = new JobQueue;
        doc.find('link[rel="stylesheet"]').each(function () {
            var $link = $(this);
            var href = $link.attr('href');
            if (!href) return;
            jobQueue.push(function (next) {
                createStyle(toFullPath(href), function (style) {
                    $link.after(style);
                    $link.remove();
                    next();
                });
            });
        });
        doc.find('_script').each(function () {
            var $script = $(this),
                src = $script.attr('src');
            if (!src) return;
            jobQueue.push(function (next) {
                read(toFullPath(src), function (script) {
                    $script.removeAttr('src')
                        .text(script);
                    console.log('script', $script.html());
                    next();
                });
            });
        });
        doc.find('link[rel="shortcut icon"]').each(function () {
            var $link = $(this),
                href = $link.attr('href');
            if (!href) return;
            jobQueue.push(function (next) {
                toBase64(toFullPath(href), function (href) {
                    $link.attr({
                        href: href
                    });
                    next();
                });
            });
        });
        doc.find('img').each(function () {
            var $img = $(this),
                src = $img.attr('src');
            if (!src) return;
            jobQueue.push(function (next) {
                toBase64(toFullPath(src), function (src) {
                    $img.attr({
                        src: src
                    });
                    next();
                });
            });
        });
        jobQueue.execute(function () {
            var outPath = exists(out) && isDir(out) ? resolve(out, file.getFileName(src)) : out,
                outContent = prettyPrint(doc.html().replace(/_script/g, 'script'), {indent_size: 2});
            var decode = require('ent')['decode'];
            fs.writeFile(outPath, '<!DOCTYPE html>\n' + decode(outContent), function (err) {
                if (err) console.error(err);
                callback && callback(outPath);
            });
        });
    });


}


module.exports = function (src, out, callback) {
    if (!exists) {
        console.error(src, 'does not exit');
        return;
    }
    var jobQueue = new JobQueue;
    toFiles(src).forEach(function (src) {
        jobQueue.push(function (next) {
            compact(src, out, function (path) {
                console.log('new compact file created:', path);
                next();
            });
        });
    });
    jobQueue.execute(function () {
        callback && callback();
    });
};