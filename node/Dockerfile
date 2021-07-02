# pull the Node.js Docker image
FROM node:14-alpine

# create the directory inside the container
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 5000

CMD ["yarn", "start:production"]