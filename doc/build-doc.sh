#!/bin/bash

HERE=$(cd "$(dirname $0)" && pwd)
DIST_DIR="${HERE}/../dist"
DOC_DIR="${HERE}"


function copy_all
{
    local src_dir=$1
    local dst_dir=$2
    local filenames=$3
    for filename in ${filenames}
    do
        cp ${src_dir}/${filename} ${dst_dir}
    done
}

function generate_styledocco
{
    local stylesheets=$1
    local dir=${DOC_DIR}/html/styledocco
    local doc_name="tek-html"
    local include=${DIST_DIR}/stylesheets/tek-doc.css

    mkdir -p ${dir}

    rm -f ${dir}/*.*
    copy_all "${DIST_DIR}/stylesheets" "${dir}" "${stylesheets}"
    rm -f ${dir}/*.css

    cd ${dir}
    echo ${include}
    styledocco -n "${doc_name}" -o ${dir} --include ${include}
    rm -f ${dir}/*.less
    rm -f ${dir}/*.css
}


echo
echo -- build doc start --

generate_styledocco "tek-mixin.less"


echo build-doc done!