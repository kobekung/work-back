#!/bin/bash

rm -rf pms-v2-service

git clone https://git.rtarf.mi.th/buffet/pmsv2-services.git

cd pms-v2-service

git fetch --all
git checkout dev
git pull origin dev

cd ..

docker compose build
docker compose down
docker compose up -d
