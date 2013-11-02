#!/usr/bin/env node
var tek = require('tek'),
    Scaffold = tek['meta']['Scaffold'],
    resolve = require('path')['resolve'],
    argv = process['argv'];

var tmplDir = resolve(argv[2]),
    outDir = resolve(__dirname, '../..'),
    from = argv[3],
    to = argv[4];

console.log('start scaffold');
console.log('\ttmplDir:' + tmplDir);
console.log('\toutDir:' + outDir);

var convertRule = new Scaffold.ConvertRule(from).make(to);
console.log('\tconvert rule:');
Object.keys(convertRule).forEach(function (from) {
    var to = convertRule[from];
    console.log('\t\t', from, '=>', to);
});


