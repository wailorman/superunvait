"use strict";

const express = require('express');
const models = require('../../models/');
const sequelize = require('../../models/index').sequelize;
const Q = require('q');
const _ = require('lodash');

const Invite = models.invite;
const invitesRouter = express.Router();

invitesRouter.post('/invites', (req, res) => {

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

invitesRouter.get('/invites', (req, res)=> {

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

invitesRouter.get('/invites/:id', (req, res) => {

    let id = req.params.id;

    Invite.findById(id)
        .then((result)=> {
            if (result) res.json(result);
            else res.status(404).json({message: "Not found"});
        }).catch((err)=> {
        res.status(500).json(err);
    });

});

module.exports = invitesRouter;