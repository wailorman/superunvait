"use strict";

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const sequelize = require('./models').sequelize;
const _ = require('lodash');
const Q = require('q');

const models = require('./models/');

const app = express();

//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,HEAD');
    res.header('Access-Control-Allow-Headers', '*');

    next();
};

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const Invite = models.invite;
const Member = models.member;

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

    let whereStatements = {};

    let limit = parseInt(req.query.limit) || 100,
        offset = parseInt(req.query.offset) || 0;

    if ( req.query.userId ) whereStatements.userId = req.query.userId;

    Invite.findAll({where: whereStatements, offset, limit })
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

/////////////////////////////////////////////////////////////////////

app.get('/members', (req, res)=> {

    let limit = parseInt(req.query.limit) || 100,
        offset = parseInt(req.query.offset) || 0;

    Member.findAll({offset, limit})
        .then((result)=> {
            res.json({members: result});
        })
        .catch((err)=> {
            res.status(500).json(err);
        });


});

app.get('/members/:userId', (req, res)=> {

    let userId = req.params.userId;

    Member.findOne({where: {id: userId}})
        .then((result)=> {
            if (result) res.json({member: result});
            else res.status(404).json({message: "Not found"});
        })
        .catch((err)=> {
            res.status(500).json(err);
        });

});

app.put('/members', (req, res)=> {

    let members = req.body.members;

    sequelize.transaction((t1)=> {

            let transactionQueries = [];

            members.forEach((member)=> {

                transactionQueries.push(
                    Member.upsert(
                        member,
                        {
                            transaction: t1,
                            validate: true
                        }
                    )
                );

            });

            return Q.all([transactionQueries]);

        })
        .then((result)=> {
            res.json({members: members, transactionResults: result[0]});
        })
        .catch((err)=> {
            res.status(500).json(err);
        });

});


app.listen(8050, function () {
    console.log(`server started`);
    console.log(`production: ${process.env.NODE_ENV ? 'yes' : 'no'}`);
});