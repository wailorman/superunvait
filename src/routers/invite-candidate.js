const express = require('express');
const models = require('../../models/');
const sequelize = require('../../models/index').sequelize;
const Q = require('q');
const _ = require('lodash');

const InviteCandidate = models['invite-candidate'];
const InviteCandidateRouter = express.Router();

InviteCandidateRouter.post('/invite-candidates', (req, res) => {

    if (
        !req.body.inviteCandidate ||
        !req.body.inviteCandidate.userId
    ) {
        return res.status(400).json({message: 'Invalid format. You should pass {inviteCandidate:{userId: "..."}} to POST body'});
    }

    InviteCandidate.create(req.body.inviteCandidate)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(500).json(err);
        })

});

module.exports = InviteCandidateRouter;