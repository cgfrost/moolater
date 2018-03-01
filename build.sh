#!/bin/bash
echo "Build Loda Recorda zip and xpi"
./node_modules/web-ext/bin/web-ext --overwrite-dest -s src -a target build
cp target/skipjaq_recorder-*.zip target/recorda@skipjaq.xpi
