FROM node:alpine

WORKDIR /app
COPY package.json tsconfig.json tsconfig.build.json ./
RUN yarn --production=true && yarn build
COPY . .

CMD ["yarn", "start"]