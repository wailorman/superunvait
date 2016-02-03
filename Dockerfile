FROM node:latest
MAINTAINER Sergey Popov <wailorman@gmail.com>

RUN mkdir /ibb
ADD ./package.json /ibb/package.json
WORKDIR /ibb
RUN npm install --production
ADD . /ibb

#RUN npm run migrate


EXPOSE 8050
EXPOSE 3306

CMD ["npm", "run", "start:docker"]

#docker rm -f mysql
#docker run -p 3306:3306 --name mysql -v /root/ibb/db/data:/var/lib/mysql -v /root/ibb/db:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=yes -d mysql:latest
#sleep 10

#mysql://root:password@mysql_host.com/database_name

#docker run -it -p 8050:8050 --name ibb-api-node --link mysql:mysql -e DB_CONNECTION_STRING=mysql://root:passs@mysql/ibb ibb-api