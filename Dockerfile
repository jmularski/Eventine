FROM node:latest

MAINTAINER Jakub Mularski <jakubmularski723@gmail.com>

ENV NODE_ENV=production
ENV port=3000

COPY . /var/www
WORKDIR /var/www

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]