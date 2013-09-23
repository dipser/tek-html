#!/usr/bin/env node

var program = require('commander'),
    argv = process['argv'],
    version = require('../package.json')['version'],
    lib = require(__dirname + '/../lib');


program
    .version(version);


program
    .command('compact <src_file> <out_file>')
    .description('compact html,css,js file int a single html file')
    .action(function (src, out) {
        lib.compact(src, out);
    });

program.parse(argv);