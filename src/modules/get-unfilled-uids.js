const fs = require('fs-promise');
const sequelize = require('../../models/index').sequelize;

// from all resources
const fromAll = () => {

    return fs.readFile(__dirname + '/../../queries/unfilled-users.sql', 'utf8')
        .then((sqlQuery) => {

            return sequelize.query(sqlQuery, { type: sequelize.QueryTypes.SELECT });

        })
        .then((res) => {

            return res.map(res => res.id);

        });

};

module.exports = {
    fromAll
};