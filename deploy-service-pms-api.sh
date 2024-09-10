#!/bin/bash
cd /home/user/docker-service/pms-v2-docker/pmsv2-services

git pull

docker compose down
docker compose up -d --build
