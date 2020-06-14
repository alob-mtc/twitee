# base image
FROM node:12-alpine
# create the working dir
RUN mkdir -p /src/twitee
# set working dir
WORKDIR /src/twitee
#copy the package.json file over
COPY ./package.json /src/twitee
# install dependencies
RUN yarn --production
# copy the app over
COPY . /src/twitee
# expose a port
EXPOSE 3000
# set default cmd
CMD [ "yarn", "start" ]
