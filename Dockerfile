FROM node:22-alpine3.19
RUN mkdir /home/node/app1
RUN mkdir /home/node/app1/file-storage
WORKDIR /home/node/app1
COPY . .
WORKDIR /home/node/app1/pms-v2-service
RUN npm i
RUN npm run build
ENTRYPOINT [ "node", "./dist/main.js" ]