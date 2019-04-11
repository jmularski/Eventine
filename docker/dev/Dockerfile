FROM node:latest

LABEL author Jakub Mularski <jakubmularski723@gmail.com>

ENV NODE_ENV=development
ENV PORT=3000
ENV MONGO_SERVICE_HOST=localhost

WORKDIR /usr/src/eventine

RUN npm set strict-ssl false
RUN npm install -g yarn

COPY package*.json ./
RUN yarn install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
