let E = {};

E.getInviteCandidates = function ({ limit }) {

    return keepRetry(sequelize.query.bind(sequelize))(
        `SELECT * FROM inv_candidates_scored LIMIT ${limit}`,
        { type: sequelize.QueryTypes.SELECT }
    );

};

module.exports = E;
