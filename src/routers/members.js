"use strict";

const express = require('express');
const models = require('../../models/');

const Member = models.member;
const membersRouter = express.Router();

membersRouter.get('/members', (req, res)=> {

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

membersRouter.get('/members/:userId', (req, res)=> {

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

membersRouter.put('/members', (req, res)=> {

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

module.exports = membersRouter;