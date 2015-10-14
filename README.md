# INSTALLATION

npm install

mysql -u _username_ -p

CREATE DATABASE tracking;

CREATE TABLE IF NOT EXISTS list (id varchar(10) NOT NULL, secret varchar(20) NOT NULL, url text NOT NULL, PRIMARY KEY(id));

CREATE TABLE IF NOT EXISTS counter ( _id int NOT NULL AUTO_INCREMENT, id varchar(10) NOT NULL ,ip varchar(31) NOT NULL,useragent varchar(255) NOT NULL, user varchar(31) NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(_id));

change database config in index.js

# USAGE

node index.js

# Purpose

this is a url shortening service built with nodejs and mysql it tracks the visitors and expose their ip and user-agent via a secret key only avavailable to the link owner

# LICENSE

MIT
