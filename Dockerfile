FROM arm32v7/node:8-slim

RUN apt-get update

RUN apt-get install python -y

RUN apt-get install build-essential -y

RUN apt-get install git -y

WORKDIR /app/

COPY package*.json ./

RUN npm install --production

COPY app.js ./

USER root

CMD ["app.js"]