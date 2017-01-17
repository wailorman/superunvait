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

            return User.bulkCreate(
                fullUsersInfo,
                {
                    updateOnDuplicate:  [
                        'name',
                        'age',
                        'allowsAnonymAccess',
                        'allowsMessagingOnlyForFriends',
                        'birthday',
                        'gender',
                        'lastOnline',
                        'registeredDate',
                        'city',
                        'country',
                        'photoId',
                        'pic5',
                        'picFull',
                        'hasServiceInvisible',
                        'private',
                        'friends',
                        'photos',
                        'groups',
                        'games',
                        'notes',
                        'updatedAt'
                    ],
                    validate: true
                }
            );

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
            return User.bulkCreate(
                apiResponse,
                {
                    updateOnDuplicate:  [
                        'lastOnline',
                        'updatedAt'
                    ],
                    validate: true
                }
            );
        });

};


const writeNewMembersToDB = () => {

    return getNewMembersIds()
        .then((membersUids) => {

            const membersUidsCollection = membersUids.map((id) => ({ id: id }));

            return Member.bulkCreate(
                membersUidsCollection,
                {
                    validate: true,
                    ignoreDuplicates: true
                }
            )

        });

};


///////// GETTING DATA FROM DB /////////////

// from all resources
const getUnfilledUserIds = () => {

    return fs.readFile(__dirname + '/../mysql/queries/unfilled-users.sql', 'utf8')
        .then((sqlQuery) => {

            return sequelize.query(sqlQuery, { type: sequelize.QueryTypes.SELECT });

        })
        .then((res) => {

            return res.map(res => res.id);

        });

};

const getRottenUserIds = () => {

    return fs.readFile(__dirname + '/../mysql/queries/rotten-users.sql', 'utf8')
        .then((sqlQuery) => {

            return sequelize.query(sqlQuery, { type: sequelize.QueryTypes.SELECT });

        })
        .then((res) => {

            return res.map(res => res.id);

        });

};


///////// GETTING DATA FROM APIs ////////////

const getNewMembersIds = () => {

    return getGroupMembers.getLastMembersUids(GROUP_ID, 300);

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
    getNewMembersIds,
    getFullUsersInfo,
    getUnfilledUserIds,
    writeNewMembersToDB,
    writeInfoAboutUnfilledUsers,
    getRottenUserIds,
    writeFreshUsersInfo
};