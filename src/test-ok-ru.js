require('babel-core/register');
require('babel-polyfill');


const getGroupMembers = require('./modules/ok-api/get-group-members');
const getUsersInfo = require('./modules/ok-api/get-users-info');

const observer = require('./observer');

const models = require('../models/index');
const sequelize = require('../models/index').sequelize;
const User = models.user;
const Member = models.member;
const Invite = models.invite;

const refreshMembersData = function() {

    getGroupMembers.getLastMembersUids(53396058603765, 200)
        .then((membersList) => {
            // debugger;

            getUsersInfo.bulkUpsert(Member, membersList.map((id) => ({ id: id })))
                .then(() => {
                    return getUsersInfo.getAllUsersInfoFromOK(membersList);
                })
                .then((rawUsersData) =>

                        Promise.all(
                            rawUsersData.map(userData => getUsersInfo.adoptReceivedData(userData))
                        )
                    // rawUsersData

                )
                .then((adoptedData) => {
                    // debugger;

                    return getUsersInfo.bulkUpsert(User, adoptedData);

                })
                .then((insertResult) => {

                    debugger;

                });


        })
        .catch((err) => {
            // debugger;
            console.error(err);
        });

};

const pullMembersInfo = () => {

    getGroupMembers.getLastMembersUids(53396058603765)
        .then((membersList) => {

            getUsersInfo.bulkUpsert(Member, membersList.map((id) => ({ id: id })));
            return membersList;

        })
        .then((membersList) =>
            getUsersInfo.getAdoptedUsersInfo(membersList)
        )
        .then((adoptedData) =>
            getUsersInfo.bulkUpsert(User, adoptedData)
        )
        .catch((err) => {
            // debugger;
            console.error(err);
        });

};

const pullInfoAboutInvites = () => {

    Invite.findAll({ limit: 100, order: 'id DESC', raw: true }).then((data) => {
        return data.map((invite) => invite.userId);
    })
        .then((invitesUserIds) => {
            return getUsersInfo.getAllUsersInfoFromOK(invitesUserIds);
        })
        .then((rawUsersData) =>

                Promise.all(
                    rawUsersData.map(userData => getUsersInfo.adoptReceivedData(userData))
                )
            // rawUsersData

        )
        .then((adoptedData) => {
            // debugger;

            return getUsersInfo.bulkUpsert(User, adoptedData);

        })

};

sequelize.query(
    "SELECT uid FROM users ORDER BY updatedAt ASC LIMIT 50000",
    {
        type: sequelize.QueryTypes.SELECT,
        raw: true
    }
)
    .then((res) => {

        const uids = res.map((candidate) => {
            return candidate.uid;
        });

        debugger;

        getUsersInfo.getAllUsersInfoFromOK(uids, ['last_online'])
            .then((apiRes) => {

                const data = apiRes.map((user) => {
                    return {
                        uid: user.uid,
                        lastOnline: user.last_online
                    };
                });

                debugger;



                // return getUsersInfo.bulkUpsertParallel(User, data, true);

                return User.bulkCreate(
                    data,
                    {
                        updateOnDuplicate: ['lastOnline', 'updatedAt']
                    }
                );

                //
                // return Promise.all(apiRes.map((user) => {
                //
                //    return sequelize.query(
                //        `
                //         UPDATE LOW_PRIORITY
                //             users
                //         SET lastOnline='${user.last_online}'
                //         WHERE uid = '${user.uid}';
                //         `,
                //        {type: sequelize.QueryTypes.UPDATE, raw: true}
                //    )
                //
                // }));

            })
            .then((updRes) => {
                debugger;
                // console.log(updRes);
                process.exit(0);
            })
            .catch((err) => {
                debugger;
                console.error(err);
                process.exit(1);
            })

    })
    .catch((err) => {
        debugger;
        console.error(err);
        process.exit(1);
    });



// pullMembersInfo();
//
// const fetchHtml = require('./modules/ok-api/fetch-html-data');
//
// User.findAll({ limit: 1000, offset: 11000, order: 'createdAt DESC', raw: true })
//     .then((data) => {
//         debugger;
//         return data.map(user => user.uid);
//     })
//     .then((uids) => {
//         return fetchHtml.multipleFetchHtmlUserData(uids)
//     })
//     .then((data) => {
//
//         debugger;
//         return getUsersInfo.bulkUpsert(User, data, true)
//             .then((res) => {
//                 debugger;
//             });
//
//     })
//     .catch((err) => {
//         debugger;
//     });


/*
 uid
 name
 age
 allows_anonym_access
 allows_messaging_only_for_friends
 birthday
 gender
 last_online
 location.city = city
 location.countryName = country
 photo_id
 has_service_invisible
 private

 uid
 name
 age
 allows_anonym_access
 allows_messaging_only_for_friends
 birthday
 gender
 last_online
 location.city
 location.countryName
 photo_id
 has_service_invisible
 private

 */