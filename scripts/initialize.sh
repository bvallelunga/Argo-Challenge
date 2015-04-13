#!/bin/bash

# Make Log Directory
mkdir -p logs

# Activate Submodules
git submodule init
git submodule update

# Install NPM Libraries
npm install -g forever coffee-script
npm install

# Make Scripts Executable
chmod +x scripts/*;
