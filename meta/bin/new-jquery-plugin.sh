#!/bin/sh

HERE=$(cd "$(dirname $0)" && pwd)
TMPL_DIR=${HERE}/../tmpl/jquery-plugin
scaffold=${HERE}/../lib/scaffold.js

from="__PluginName__"

echo -n "enter new jquery plugin name:"
read -e to
${scaffold} ${TMPL_DIR} ${from} $(echo ${to} | sed 's/.js$//' | sed 's/jquery.//')

