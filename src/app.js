"use strict";

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const apiRoute = require('./routers/api');
const corsMiddleware = require('./middlewares/cors');

const app = express();

app.use(corsMiddleware);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(apiRoute);


app.listen(8050, function () {
    console.log(`server started`);
    console.log(`production: ${process.env.NODE_ENV ? 'yes' : 'no'}`);
});