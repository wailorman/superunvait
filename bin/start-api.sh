#!/bin/bash

source ./db-config.sh

docker pull wailorman/ibb-api:latest
docker rm -f ibb-api-node 2>/dev/null
docker run -p 8050:8050 \
--name ibb-api-node \
--link mysql:mysql \
-e DB_CONNECTION_STRING=mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}/${MYSQL_DATABASE} \
-d wailorman/ibb-api:latest
