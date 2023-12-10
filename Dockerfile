FROM node:17-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080
# required for docker desktop port mapping

CMD ["npm", "start"]