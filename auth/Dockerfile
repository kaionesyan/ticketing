FROM node:alpine

WORKDIR /app
COPY package.json .
RUN yarn --production=true
COPY . .
RUN yarn build

CMD ["yarn", "start"]