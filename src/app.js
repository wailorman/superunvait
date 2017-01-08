require('babel-core/register');
require('babel-polyfill');

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const apiRoute = require('./routers/api');
const corsMiddleware = require('./middlewares/cors');

const app = express();

const okObserver = require('./modules/ok-observer');

app.use(corsMiddleware);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(apiRoute);

const observe = () => {
    console.log(`Running members & invites observer`);
    okObserver.pullInfoAboutInvites();
    setTimeout(() => {
        okObserver.pullMembersInfo();
    }, 60000);
};

app.listen(process.env.PORT || 8050, function () {
    console.log(`server started on port ${process.env.PORT}`);
    console.log(`production: ${process.env.NODE_ENV ? 'yes' : 'no'}`);

    // observe();
    //
    // setInterval(() => {
        // observe();
    // }, 300000);

});