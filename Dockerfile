FROM node:15-alpine
RUN apk --no-cache upgrade && apk add --no-cache chromium
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node app.js
EXPOSE 5000
