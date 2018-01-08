#!/bin/bash
echo "Build zip"
web-ext --overwrite-dest -s src -a target build
cp target/moolater-2.4.zip target/moolater@codewax.xpi
