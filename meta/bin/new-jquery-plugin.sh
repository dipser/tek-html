#!/bin/sh

HERE=$(cd "$(dirname $0)" && pwd)
TMPL_DIR=${HERE}/../tmpl/jquery-plugin
scaffold=${HERE}/../lib/scaffold.js

from=__pluginName__

#TODO ask in prompt
to=sunShine

${scaffold} ${TMPL_DIR} ${from} ${to}

