FROM node:latest

LABEL author Jakub Mularski <jakubmularski723@gmail.com>

ENV NODE_ENV=development
ENV PORT=3000
ENV MONGO_SERVICE_HOST=localhost

COPY . /var/www
WORKDIR /var/www

RUN npm config set registry http://registry.npmjs.org/
RUN npm install

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
