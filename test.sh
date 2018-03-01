#!/bin/bash
echo "Testing Loda Recorda"
echo ""
echo "Linting JS files"
echo "================"
echo ""
./node_modules/.bin/eslint --config ./.eslintrc.json  src/background/*.js src/popup/*.js spec/*.js spec/**/*.js
echo "Linting the extension"
echo "====================="
./node_modules/.bin/web-ext lint --source-dir src
echo "Running unit tests"
echo "=================="
./node_modules/.bin/jasmine
echo "Testing Finished"