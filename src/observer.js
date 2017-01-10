const fs = require('fs-promise');
const sequelize = require('../models/index').sequelize;
const models = require('../models/index');

const getGroupMembers = require('./modules/ok-api/get-group-members');
const getUsersInfo = require('./modules/ok-api/get-users-info');
const unfilledUids = require('./modules/get-unfilled-uids');
const fetchHtml = require('./modules/ok-api/fetch-html-data');

const Member = models.member;
const User = models.user;


// ИББ -- 53396058603765
const GROUP_ID = 53396058603765;


///////// WRITING DATA TO DB ///////////////

const writeInfoAboutUnfilledUsers = () => {

    let newUserIds = [];

    return getUnfilledUserIds()
        .then((unfilledUids) => {

            newUserIds = unfilledUids;
            return getFullUsersInfo(unfilledUids);

        })
        .then((fullUsersInfo) => {

            return getUsersInfo.bulkUpsert(User, fullUsersInfo);

        })
        .then(() => {

            return newUserIds;

        });

};

const writeFreshUsersInfo = () => {

    return getUnfilledUserIds()
        .then((rottenUids) => {
            return getUsersInfo.getAdoptedUsersInfo(rottenUids);
        })
        .then((apiResponse) => {
            return getUsersInfo.bulkUpsert(User, apiResponse);
        });

};


const writeNewMembersToDB = () => {

    return getAllMembersIds()
        .then((membersUids) => {

            const membersUidsCollection = membersUids.map((id) => ({ id: id }));

            return getUsersInfo.bulkUpsert(Member, membersUidsCollection);

        });

};


///////// GETTING DATA FROM DB /////////////

// from all resources
const getUnfilledUserIds = () => {

    return fs.readFile(__dirname + '/../queries/unfilled-users.sql', 'utf8')
        .then((sqlQuery) => {

            return sequelize.query(sqlQuery, { type: sequelize.QueryTypes.SELECT });

        })
        .then((res) => {

            return res.map(res => res.id);

        });

};

const getRottenUserIds = () => {

    return fs.readFile(__dirname + '/../queries/rotten-users.sql', 'utf8')
        .then((sqlQuery) => {

            return sequelize.query(sqlQuery, { type: sequelize.QueryTypes.SELECT });

        })
        .then((res) => {

            return res.map(res => res.id);

        });

};


///////// GETTING DATA FROM APIs ////////////

const getAllMembersIds = () => {

    return getGroupMembers.getLastMembersUids(GROUP_ID);

};

const getFullUsersInfo = function(uids) {

    let apiData;

    return getUsersInfo.getAdoptedUsersInfo(uids)
        .then((apiResponse) => {

            apiData = apiResponse;
            return fetchHtml.multipleFetchHtmlUserData(uids);

        })
        .then((htmlData) => {

            return uids.map((uid) => {

                const ownApiData = apiData.filter(data => data.uid == uid)[0];
                const ownHtmlData = htmlData.filter(data => data.uid == uid)[0];

                return Object.assign(
                    {},
                    ownApiData,
                    ownHtmlData
                )

            });

        })
};

module.exports = {
    getAllMembersIds,
    getFullUsersInfo,
    getUnfilledUserIds,
    writeNewMembersToDB,
    writeInfoAboutUnfilledUsers,
    getRottenUserIds,
    writeFreshUsersInfo
};