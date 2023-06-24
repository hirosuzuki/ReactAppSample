#!/bin/bash

test -f .env || ln -s .env.template .env
npm ci
