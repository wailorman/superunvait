const fs = require('fs-promise');
const sequelize = require('../models/index').sequelize;
const models = require('../models/index');
const _ = require('lodash');
const async = require('async');

const getGroupMembers = require('./modules/ok-api/get-group-members');
const getUsersInfo = require('./modules/ok-api/get-users-info');
const unfilledUids = require('./modules/get-unfilled-uids');
const fetchHtml = require('./modules/ok-api/fetch-html-data');

const Member = models.member;
const User = models.user;
const InviteCandidate = models['invite-candidate'];

const PARALLEL_HTTP_REQUESTS = process.env.PARALLEL_HTTP_REQUESTS || 3;

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


const writeNewCandidates = () => {
    return whoseFriendsFetch()
        .then((uidsWithFriends) => {
            return newInvCandidatesFromFriends(uidsWithFriends);
        })
        .then(([toCreate, toModify]) => {

            return sequelize.transaction((t1) => {

                return InviteCandidate.bulkCreate(
                    toCreate,
                    {
                        validate: true,
                        ignoreDuplicates: true,
                        transaction: t1
                    })
                    .then(() => {
                        return InviteCandidate.bulkCreate(
                            toModify,
                            {
                                validate: true,
                                updateOnDuplicate: ['updatedAt', 'friendsStatus'],
                                transaction: t1
                            }
                        );
                    });

            });

        })
};


///////// GETTING DATA FROM DB /////////////

const whoseFriendsFetch = () => {
    return sequelize.query(
        fs.readFileSync(__dirname + '/../mysql/queries/whose-friends-fetch.sql', 'utf8'),
        { type: sequelize.QueryTypes.SELECT, raw: true }
    )
        .then((candidatesInstances) => {
            return candidatesInstances.map(({ userId }) => userId);
        })
};

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

const newInvCandidatesFromFriends = (uids) => {

    const RESTRICTED = 'RESTRICTED';
    const NOT_FOUND = 'NOT_FOUND';
    const FETCHED = 'FETCHED';

    return new Promise((resolve, reject) => {

        let own = [];

        async.mapLimit(
            uids,
            PARALLEL_HTTP_REQUESTS,
            (uid, callback) => {

                const mapResponse = (uids, status) => {
                    return uids.map((uid) => {
                        return {
                            userId: uid,
                            friendsStatus: status
                        };
                    });
                };

                getUsersInfo.getAppropFriendsUids(uid)
                    .then((uids) => {
                        own.push(mapResponse([uid], FETCHED)[0]);
                        callback(null, mapResponse(uids));
                    })
                    .catch((err) => {

                        if (err.error_code == 300) {
                            own.push(mapResponse([uid], NOT_FOUND)[0]);
                            callback(null);
                        } else if (err.error_data == "FRIENDS_VISIBILITY" || err.error_code == '455') {
                            own.push(mapResponse([uid], RESTRICTED)[0]);
                            callback(null);
                        } else {
                            callback(err);
                        }
                    })

            },
            (err, results) => {
                if (err) return reject(err);

                const toCreate = _.uniqBy(
                    [].concat.apply([], results),
                    'userId'
                );

                resolve([ toCreate, own ]);

            }
        );

    })

};

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
        .then((fullUsersInfo) => {

            return fullUsersInfo.map((userInfo) => {

                return {
                    ...userInfo,
                    score: (userInfo.groups /100 * 10) + (userInfo.friends / 100)
                };

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
    writeFreshUsersInfo,
    whoseFriendsFetch,
    newInvCandidatesFromFriends,
    writeNewCandidates
};
