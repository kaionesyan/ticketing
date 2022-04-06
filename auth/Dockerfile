FROM node:alpine

WORKDIR /app
COPY . .
RUN yarn --production=true && yarn build

CMD ["yarn", "start"]