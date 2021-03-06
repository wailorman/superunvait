require('babel-core/register');
require('babel-polyfill');

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');

const apiRoute = require('./routers/api');
const corsMiddleware = require('./middlewares/cors');

const app = express();

const BODY_LIMIT = '20mb';

app.use(corsMiddleware);
app.use(bodyParser.urlencoded({extended: true, limit: BODY_LIMIT}));
app.use(bodyParser.json({limit: BODY_LIMIT}));

app.use(apiRoute);

const port = process.env.PORT || 3000;

// https.createServer({
//     key: fs.readFileSync( path.resolve(__dirname, '../ssl/privkey.pem') ),
//     cert: fs.readFileSync( path.resolve(__dirname, '../ssl/fullchain.pem') ),
//     ca: fs.readFileSync( path.resolve(__dirname, '../ssl/chain.pem') )
// }, app).listen(port, function () {
app.listen(port, ()=>{
    console.log(`server started on port ${port}`);
    console.log(`production: ${process.env.NODE_ENV ? 'yes' : 'no'}`);
});
