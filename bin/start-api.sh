#!/bin/bash

source ./db-config.sh

docker pull wailorman/ibb-api:latest
docker rm -f ibb-api-node 2>/dev/null
docker run -p 8050:8050 \
--name ibb-api-node \
-e DB_CONNECTION_STRING=${IBB_MYSQL_CONNECTION_STRING} \
-d wailorman/ibb-api:latest
