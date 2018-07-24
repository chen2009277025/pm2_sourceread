#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo 'change node version'
nvm use v8.6.0
echo 'check node version'
node --version
echo 'change work path'
cd /Users/jianchen/workspace/react-webstorm/helloka2
npm start