#!/bin/bash

# This script is run by `npm version X` after package.json has been updated, but before changes have been committed to git.
# See https://docs.npmjs.com/misc/scripts

# this is primarily useful for bower - because it looks at the git source for the version tag

npm run build
git add dist/watson-speech.js
git add dist/watson-speech.min.js
git add dist/watson-speech.min.js.map
