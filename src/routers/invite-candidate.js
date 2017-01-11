const express = require('express');
const models = require('../../models/');
const sequelize = require('../../models/index').sequelize;
const Q = require('q');
const _ = require('lodash');

const InviteCandidate = models['invite-candidate'];
const InviteCandidateRouter = express.Router();

const bulkUpsertParallel = require('../modules/ok-api/get-users-info').bulkUpsertParallel;

InviteCandidateRouter.post('/invite-candidates', (req, res, next) => {

    if (
        !req.body.inviteCandidates ||
        !(req.body.inviteCandidates instanceof Array)
    ) {
        return res.status(400).json({message: `Invalid format. You should pass {inviteCandidates: [ uids, ... ]} to POST body`});
    }


    let inviteCandidates = req.body.inviteCandidates;

    const data = inviteCandidates.map((id) => {
        return {
            userId: id
        };
    });

    bulkUpsertParallel(InviteCandidate, data, true)
        .then((result)=> {
            res.json({inviteCandidates: inviteCandidates});
        })
        .catch((err)=> {
            console.error(err);
            res.status(500).send({message: err.message});
        });

});

module.exports = InviteCandidateRouter;