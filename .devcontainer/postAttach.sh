#!/bin/bash

test -f .env || ln -s .env.template .env
npm ci
docker compose pull
docker compose up -d
npx prisma migrate -f
