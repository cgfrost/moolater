#!/bin/bash
echo "Build zip"
web-ext --overwrite-dest -s src -a target build
cp target/skipjaq_recorder-*.zip target/recorda@skipjaq.xpi
