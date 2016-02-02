MAINTAINER Sergey Popov <wailorman@gmail.com>
FROM node

RUN mkdir /ibb
ADD . /ibb
WORKDIR /ibb
RUN npm install --production

EXPOSE 8050
EXPOSE 3306:3306

CMD ["npm", "start"]