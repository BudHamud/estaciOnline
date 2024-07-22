FROM node:16-alpine

WORKDIR /src/app

COPY package*.json ./
COPY . .

RUN npm install --omit=dev

CMD [ "npm", "start" ]