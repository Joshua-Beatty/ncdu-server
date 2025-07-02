FROM node:24-alpine

RUN apk add --no-cache curl

RUN curl -L https://dev.yorhel.nl/download/ncdu-2.8.1-linux-x86_64.tar.gz | tar -xz -C /usr/local/bin

RUN chmod +x /usr/local/bin/ncdu

RUN ncdu --version

WORKDIR /usr/src/app

COPY package*.json .
COPY backend/package*.json .
COPY frontend/package*.json .

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "start"]