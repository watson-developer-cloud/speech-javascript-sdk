#/bin/bash

# move to root directory
cd ../

# build the static code with dev changes
npm run build

# move static code to bower components for examples
cp ./dist/watson-speech* ./examples/static/scripts/watson-speech/dist
