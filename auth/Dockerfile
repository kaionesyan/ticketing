FROM node:alpine

WORKDIR /app
COPY package.json .
RUN yarn --production=true && yarn build
COPY . .

CMD ["yarn", "start"]