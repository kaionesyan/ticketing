FROM node:alpine

WORKDIR /app
COPY package.json .
RUN yarn --production=true
COPY . .

CMD ["yarn", "start"]