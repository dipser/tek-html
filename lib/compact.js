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
function compact(src, out, callback, options) {
    if (!options) options = {};
    var debug = options.debug,
        pretty = options.pretty;
    var dir = resolve(src, '..');

    function toFullPath(path) {
        if (isRemote(path)) {
            return path;
        } else {
            return resolve(dir, path);
        }
    }

    function escapeScript(html) {
        return html.replace(/script/g, '_script');
    }

    function restoreScript(html) {
        return html.replace(/_script/g, 'script');
    }

    read(src, function (html) {
        html = escapeScript(html);
        var doc = $('<div/>').append(html);
        var jobQueue = new JobQueue;
        doc.find('link[rel="stylesheet"]').each(function () {
            var $link = $(this);
            var href = $link.attr('href');
            if (!href) return;
            href = restoreScript(href);
            jobQueue.push(function (next) {
                if (debug)console.log('\tcreate inline resource from', href);
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
            src = restoreScript(src);
            jobQueue.push(function (next) {
                if (debug)console.log('\tcreate inline resource from', src);
                read(toFullPath(src), function (script) {
                    $script.removeAttr('src')
                        .text(script);
                    next();
                });
            });
        });
        doc.find('link[rel="shortcut icon"]').each(function () {
            var $link = $(this),
                href = $link.attr('href');
            if (!href) return;
            href = restoreScript(href);
            jobQueue.push(function (next) {
                if (debug)console.log('\tcreate inline resource from', href);
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
                if (debug)console.log('\tcreate inline resource from', src);
                toBase64(toFullPath(src), function (src) {
                    $img.attr({
                        src: src
                    });
                    next();
                });
            });
        });
        jobQueue.execute(function () {
            var html = doc.html().replace(/_script/g, 'script');
            var outPath = exists(out) && isDir(out) ? resolve(out, file.getFileName(src)) : out,
                outContent = html;
            if (pretty) {
                outContent = prettyPrint(html, {indent_size: 2});
            }
            var decode = require('ent')['decode'];
            var decoded = decode(outContent);
            if (debug) console.log(' decoded done');
            fs.writeFile(outPath, '<!DOCTYPE html>\n' + decoded, function (err) {
                if (err) console.error(err);
                callback && callback(outPath);
            });
        });
    });


}


module.exports = function (src, out, callback, options) {
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
            }, options);
        });
    });
    jobQueue.execute(function () {
        callback && callback();
    });
};