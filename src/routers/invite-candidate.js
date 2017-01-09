const express = require('express');
const models = require('../../models/');
const sequelize = require('../../models/index').sequelize;
const Q = require('q');
const _ = require('lodash');

const InviteCandidate = models['invite-candidate'];
const InviteCandidateRouter = express.Router();

InviteCandidateRouter.post('/invite-candidates', (req, res) => {

    if (
        !req.body.inviteCandidates ||
        !(req.body.inviteCandidates instanceof Array)
    ) {
        return res.status(400).json({message: `Invalid format. You should pass {inviteCandidates: [ uids, ... ]} to POST body`});
    }


    let inviteCandidates = req.body.inviteCandidates;

    sequelize.transaction((t1)=> {

        let transactionQueries = [];

        inviteCandidates.forEach((candidateId)=> {

            transactionQueries.push(
                InviteCandidate.upsert(
                    {
                        userId: candidateId
                    },
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
            res.json({inviteCandidates: inviteCandidates, transactionResults: result[0]});
        })
        .catch((err)=> {
            res.status(500).json(err);
        });

});

module.exports = InviteCandidateRouter;