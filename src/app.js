require('babel-core/register');
require('babel-polyfill');

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');

const apiRoute = require('./routers/api');
const corsMiddleware = require('./middlewares/cors');

const app = express();

const BODY_LIMIT = '20mb';

app.use(corsMiddleware);
app.use(bodyParser.urlencoded({extended: true, limit: BODY_LIMIT}));
app.use(bodyParser.json({limit: BODY_LIMIT}));

app.use(apiRoute);

https.createServer({
    key: fs.readFileSync( 'ssl/privkey.pem' ),
    cert: fs.readFileSync( 'ssl/cert.pem' )
}, app).listen(3000, function () {
    console.log(`server started on port 3000`);
    console.log(`production: ${process.env.NODE_ENV ? 'yes' : 'no'}`);
});