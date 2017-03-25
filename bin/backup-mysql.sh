#!/bin/bash

CUR_DATE = "$(date +"%Y-%m-%d_%H-%M")"
MYSQL_DATA_DIR = "/root/db/data"
BACKUP_DIR = "/root/backups/$DATE"

xtrabackup --backup --datadir="$MYSQL_DATA_DIR" --target-dir="$BACKUP_DIR" --host=127.0.0.1 --port=3306 --user=root
xtrabackup --prepare --target-dir="$BACKUP_DIR"
