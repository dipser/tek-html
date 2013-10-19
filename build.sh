#!/bin/bash

HERE=$(cd "$(dirname $0)" && pwd)

SRC_DIR=${HERE}/lib/src

cd ${SRC_DIR} && node build-src.js

