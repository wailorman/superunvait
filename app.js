"use strict";

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const _ = require('lodash');

const models = require('./models/');

const app = express();

//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');

    next();
};

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const Invite = models.invite;

app.post('/invites', (req, res) => {

    let invite;

    if (req.body.invite) {
        invite = req.body.invite;
    } else {
        return res.status(400).json({message: 'Invalid format. You should pass {invite:{...}} to POST body'});
    }


    Invite.create(invite)
        .then((result)=> {
            res.json(result);
        })
        .catch((err)=> {
            res.status(500).json(err);
        });

});

app.get('/invites', (req, res)=> {

    Invite.findAll()
        .then((result)=> {
            res.json({invites: result});
        })
        .catch((err)=> {
            res.status(500).json(err);
        });


});

app.get('/invites/:id', (req, res) => {

    let id = req.params.id;

    Invite.findById(id)
        .then((result)=> {
            if (result) res.json(result);
            else res.status(404).json({message: "Not found"});
        }).catch((err)=> {
        res.status(500).json(err);
    });

});

app.listen(8050, function () {
    console.log(`server started`);
    console.log(process.env.NODE_ENV);
});