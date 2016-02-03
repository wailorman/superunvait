FROM node:latest
MAINTAINER Sergey Popov <wailorman@gmail.com>

RUN mkdir /ibb
ADD . /ibb
WORKDIR /ibb
RUN npm install --production

EXPOSE 8050
EXPOSE 3306

RUN npm run migrate

CMD ["npm", "start:docker"]

#docker rm -f mysql
#docker run -p 3306:3306 --name mysql -v /root/ibb/db/data:/var/lib/mysql -v /root/ibb/db:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=yes -d mysql:latest
#sleep 10