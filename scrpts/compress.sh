#! /bin/bash

PATH_JS=/home/zzy/acapp/game/static/js/
JS_PATH_DIST=${PATH_JS}dist/
JS_PATH_SRC=${PATH_JS}src/

find ${JS_PATH_SRC} -type f -name '*.js' | sort | xargs cat > ${JS_PATH_DIST}game.js