#!/bin/bash


CURRENT=$(cd "$(dirname $0)" && pwd)
tk_h=${CURRENT}/../bin/tek-html.js

${tk_h} publish tek.js,tek.view.js ${CURRENT}/out