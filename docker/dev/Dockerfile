FROM node:10-alpine

LABEL author Jakub Mularski <jakubmularski723@gmail.com>

ENV NODE_ENV=dev
ENV PORT=3000
ENV MONGO_SERVICE_HOST=localhost

WORKDIR /usr/src/eventine

RUN apk add python make g++ --no-cache
RUN npm set strict-ssl false
RUN npm install -g yarn

COPY package*.json ./
RUN yarn install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
