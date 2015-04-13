#!/bin/bash

if [ "$1" == "prod" ]; then
  NODE_ENV=production forever start -c coffee start.coffee
else
  forever start -c coffee start.coffee
fi
