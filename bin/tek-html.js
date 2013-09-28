#!/usr/bin/env node

var program = require('commander'),
    argv = process['argv'],
    version = require('../package.json')['version'],
    lib = require(__dirname + '/../lib'),
    tek = require('tek'),
    JobQueue = tek['JobQueue'];


program
    .version(version);


program
    .command('compact <src_file> <out_file>')
    .description('compact html,css,js file int a single html file')
    .action(function (src, out) {
        lib.compact(src, out, function () {
            console.log('[tek-html] compact done!');
        });
    });

program
    .command('publish <file_name> <out_file>')
    .description('publish tek-html library file')
    .action(function (filename, out) {
        var jobQueue = new JobQueue;
        if (!filename) {
            console.error('filename required');
            return;
        }
        filename.split(',').forEach(function (filename) {
            jobQueue.push(function (next) {
                lib.publish(filename, out, next);
            });
        });
        jobQueue.execute(function () {
            console.log('[tek-html] publish done!');
        });
    });


program.parse(argv);