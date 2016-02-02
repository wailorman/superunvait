FROM node
MAINTAINER Sergey Popov <wailorman@gmail.com>

RUN mkdir /ibb
ADD . /ibb
WORKDIR /ibb
RUN npm install --production

EXPOSE 8050
EXPOSE 3306:3306

CMD ["npm", "start"]