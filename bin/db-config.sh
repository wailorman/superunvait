#!/usr/bin/env bash

if [ -z "$IBB_MYSQL_CONNECTION_STRING" ]
then
    echo "Specify mysql credentials in bin/db-config.sh!"
    exit
fi


MYSQL_ROOT_PASSWORD=1 #root password
MYSQL_HOST=mysql # not for docker mysql
MYSQL_DATABASE=test #database name
MYSQL_USER=test #user name
MYSQL_PASSWORD=123 #user pass

IBB_MYSQL_CONNECTION_STRING=${IBB_MYSQL_CONNECTION_STRING:?"mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}/${MYSQL_DATABASE}"}