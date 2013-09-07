var $ = require('jquery'),
    fs = require('fs'),
    prettyPrint = require('html')['prettyPrint'],
    resolve = require('path')['resolve'],
    util = require('tek')['util'],
    exists = util.file.exists,
    isDir = util.file.isDir;


function toFiles(path) {
    if (isDir(path)) {
        return util.file.filesInDir(path);
    } else {
        return [path];
    }
}

function read(path) {
    return fs.readFileSync(path, 'utf-8');
}

function createStyle(href) {
    if (!href) return '';
    return  ['<style type="text/css">', read(href), '</style>'].join('\n');
}
function createScript(src) {
    if (!src) return '';
    return ['<_script type="text/javascript">', read(src), '</_script>'].join('\n');
}
module.exports = function (src, out) {
    if (!exists) {
        console.error(src, 'does not exit');
        return;
    }
    toFiles(src).forEach(function (src) {
        var dir = resolve(src, '..'),
            html = read(src).replace(/script/g, '_script'),
            doc = $('<div/>').append(html);
        doc.find('link[rel="stylesheet"]').each(function () {
            var link = $(this);
            var href = link.attr('href');
            if (!href) return;
            link.after(createStyle(resolve(dir, href)));
            link.remove();
        });
        doc.find('_script').each(function () {
            var script = $(this),
                src = script.attr('src');
            if (!src) return;
            script.after(createScript(resolve(dir, src)));
            script.remove();
        });
        var outPath = isDir(out) ? resolve(out, util.file.getFileName(src)) : out,
            outContent = prettyPrint(doc.html().replace(/_script/g, 'script'), {indent_size: 2});
        fs.writeFileSync(outPath, '<!DOCTYPE html>\n' + outContent);
    });
};