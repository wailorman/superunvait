#!/bin/bash

docker build -t wailorman/ibb-api:${1:-latest} ../
docker push wailorman/ibb-api:${1:-latest}