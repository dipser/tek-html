#!/bin/bash

CURRENT=$(cd "$(dirname $0)" && pwd)

SRC_FILE=${CURRENT}/src/index.html
OUT_FILE=${CURRENT}/out/compact.html
tk_h=${CURRENT}/../bin/tek-html.js

${tk_h} compact ${SRC_FILE} ${OUT_FILE} -d
