FROM node:20

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE ${PORT}

CMD ["yarn", "start:prod"]
