FROM node:15 as build

ENV NPM_CONFIG_LOGLEVEL warn

# install dependencies
RUN ["npm"]

# build the package
RUN ["npm", "run", "build"]

# start the bot
ENTRYPOINT [ "npm", "run", "start:prod" ]