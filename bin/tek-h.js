#!/usr/bin/env node

var argv = process['argv'],
    lib = require(__dirname + '/../lib'),
    command = argv[1];


if (!command) {
    console.log('no command found');
    process.exit(1);
}

switch (command) {
    case 'compact':
        var src = argv[2],
            out = argv[3];
        lib.compact(src, out);
        break;
}
console.log('argv', argv);