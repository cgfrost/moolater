#!/bin/bash
echo "Build zip"
web-ext --overwrite-dest -s src -a target build
extension_version="$(node --print 'require(`./src/manifest.json`).version')"
cp "target/moolater-$extension_version.zip" target/moolater@codewax.xpi
