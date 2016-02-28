#!/usr/bin/env bash

echo "Specify mysql credentials in bin/db-config.sh!"
exit # And comment this line

MYSQL_ROOT_PASSWORD=1 #root password
MYSQL_HOST=mysql
MYSQL_DATABASE=test #database name
MYSQL_USER=test #user name
MYSQL_PASSWORD=123 #user pass

IBB_MYSQL_CONNECTION_STRING=${IBB_MYSQL_CONNECTION_STRING:="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}/${MYSQL_DATABASE}"}