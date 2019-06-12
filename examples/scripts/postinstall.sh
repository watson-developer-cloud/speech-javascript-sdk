#!/bin/bash

mkdir -p static/scripts/fetch/dist && cp -r node_modules/whatwg-fetch/dist/* "$_"
mkdir -p static/scripts/jquery/dist && cp -r node_modules/jquery/dist/* "$_"
mkdir -p static/scripts/watson-speech && cp -r node_modules/watson-speech/dist "$_"
