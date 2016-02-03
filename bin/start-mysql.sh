#!/bin/bash

source ./db-config.sh

docker pull mysql:latest
docker rm -f mysql 2>/dev/null
docker run -p 127.0.0.1:3306:3306 \
--name mysql \
-v $(pwd)/../db/data:/var/lib/mysql \
-v $(pwd)/../db:/etc/mysql/conf.d \
-e MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \
-e MYSQL_DATABASE=${MYSQL_DATABASE} \
-e MYSQL_USER=${MYSQL_USER} \
-e MYSQL_PASSWORD=${MYSQL_PASSWORD} \
-d mysql:latest

sleep 10