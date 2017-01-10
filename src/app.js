require('babel-core/register');
require('babel-polyfill');

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const apiRoute = require('./routers/api');
const corsMiddleware = require('./middlewares/cors');

const app = express();

const BODY_LIMIT = '20mb';

app.use(corsMiddleware);
app.use(bodyParser.urlencoded({extended: true, limit: BODY_LIMIT}));
app.use(bodyParser.json({limit: BODY_LIMIT}));

app.use(apiRoute);

app.listen(process.env.PORT || 8050, function () {
    console.log(`server started on port ${process.env.PORT}`);
    console.log(`production: ${process.env.NODE_ENV ? 'yes' : 'no'}`);
});