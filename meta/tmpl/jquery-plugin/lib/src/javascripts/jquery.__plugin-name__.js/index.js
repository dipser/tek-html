/**
 * Created by okunishitaka on 10/19/13.
 */
var fs = require('fs'),
    resolve = require('path')['resolve'],
    EOL = require('os')['EOL'],
    TAB = '\t';

function indent(string) {
    return TAB + string.replace(new RegExp(EOL, 'mg'), EOL + TAB);
}
var modules = fs.readdirSync(__dirname)
    .filter(function (filename) {
        return filename !== 'index.js'
    }).map(function (filename) {
        var filepath = resolve(__dirname, filename),
            namespace = (function (names) {
                names.shift(); //remove numeric prefix
                names.pop(); //remove extension
                return names.join('.');
            })(filename.split('.'));
        return [
            "",
            "/** jquery.__plugin-name__ for " + namespace + " **/",
            "(function (global, undefined) {",
            "",
            indent(fs.readFileSync(filepath).toString().replace(/exports/g, namespace)
            ),
            "})(dependencies, undefined);"
        ].join(EOL);
    });
exports.toString = function () {
    return indent(modules.join(EOL));
};