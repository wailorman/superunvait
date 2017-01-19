const express = require('express');
const models = require('../../models/');
const sequelize = require('../../models/index').sequelize;
const Q = require('q');
const _ = require('lodash');
const keepRetry = require('../lib/sequelize-retry').keepRetry;

const InviteCandidate = models['invite-candidate'];
const router = express.Router();

router.get('/invite-candidates', (req, res, next) => {

    const limit = parseInt(req.query.limit) || 500;

    keepRetry(sequelize.query.bind(sequelize))(
        `SELECT * FROM inv_candidates_scored LIMIT ${limit}`,
        { type: sequelize.QueryTypes.SELECT }
    )
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            next(err);
        });

});

router.post('/invite-candidates', (req, res, next) => {

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

    InviteCandidate.bulkCreate(data, {validate: true, ignoreDuplicates: true})
        .then((result)=> {
            res.json({inviteCandidates: inviteCandidates});
        })
        .catch((err)=> {
            console.error(err);
            res.status(500).send({message: err.message});
        });

});

module.exports = router;