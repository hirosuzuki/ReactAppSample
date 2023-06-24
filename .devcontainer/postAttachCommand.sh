#!/bin/bash

docker compose up -d

echo "Waiting for MySQL to start on 127.0.0.1:3306 ..."
while ! /usr/bin/mysqladmin ping -h 127.0.0.1 -uroot -pmysql --silent ; do
    sleep 1
done

npx prisma migrate dev
