FROM node:alpine as build

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /usr/app
COPY . /usr/app

# install latest npm
RUN ["npm", "i", "npm", "-g"]
# install dependencies
RUN ["npm", "i"]

# start the bot
ENTRYPOINT [ "npm", "run", "prod" ]