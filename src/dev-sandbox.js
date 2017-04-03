require('babel-core/register');
require('babel-polyfill');


const getGroupMembers = require('./modules/ok-api/get-group-members');
const getUsersInfo = require('./modules/ok-api/get-users-info');

const _ = require('lodash');
const async = require('async');

const observer = require('./observer');

const models = require('../models/index');
const sequelize = require('../models/index').sequelize;
const User = models.user;
const Member = models.member;
const Invite = models.invite;
const InviteCandidate = models['invite-candidate'];

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


// const request = require('request');
//
// request({
//     method: 'POST',
//     uri: 'https://ok.ru/online?cmd=OnSiteNowUsersRB&gwt.requested=c3aaad6c&st.cmd=userFriendLive',
//     formData: {
//         'st.ageFrom': '50',
//         'st.ageTo': '90',
//         'st.female': '2',
//         'st.city': 'Улан-Удэ',
//         'fetch': 'false',
//         'nsshownIds': '',
//     },
//     headers: {
//         'TKN': 'uTRFL7inGNUC596DraHgL6PqmCalX-nq',
//         'Cookie': 'AUTHCODE=kjBNgaupmscSPSL3RRcbx565DqHC8bdnX_qr38aQAxY93hxjSEXqB6KmYtNyaSFdp9X22b3IR_c3I__fPczPF61-fopvnYweaN41INDUKI0_2; JSESSIONID=bba428a8dcc826d35e909fd1bec64cf834e84f96daa1c6f2.eb26449c;',
//         'X-Requested-With': 'XMLHttpRequest'
//     }
// }, (err, res, body) => {
//     debugger;
// });


/*observer.writeNewCandidates()
    .then((insertResult) => {
        debugger;
    })
    .catch((err) => {
        debugger;
    });*/





/*promiseMapLimit(
    1,
    uids.map((uid) => {
        return getUsersInfo.getAppropFriendsUids(uid)
            .catch((err) => {
                console.log(uid);
                console.error(err);
                return err;
            });
    }),
    {
        concat: true,
        errorHandler: (err, resolve, reject) => {

            if (err.error_code == 300) {
                resolve(NOT_FOUND);
            } else if (err.error_data == "FRIENDS_VISIBILITY") {
                resolve(RESTRICTED)
            } else {
                reject(err);
            }

        },
        mapResults: (results) => {

        }
    }
)
    .then((uids) => {
        // debugger;
        const uniqueUids = _.uniq(uids);
        // debugger;

        const data = uniqueUids.map((uid) => {
            return { userId: uid };
        });

        return InviteCandidate.bulkCreate(data, { validate: true, ignoreDuplicates: true })

    })
    .then((insertResult) => {
        debugger;
    })
    .catch((err) => {
        debugger;
    });*/

// getUsersInfo.getAppropFriendsUids('291695408150')
//     .then((uids) => {
//         debugger;
//
//         const data = uids.map((uid) => {
//             return {
//                 userId: uid
//             };
//         });
//
//         return InviteCandidate.bulkCreate(data, {validate: true, ignoreDuplicates: true})
//
//     })
//     .then((insertResult) => {
//         debugger;
//     })
//     .catch((err) => {
//         debugger;
//     });


// const okApi = require('./modules/ok-api/ok-api-facade');
//
// okApi.get({
//     method: 'friends.get',
//     fid: '291695408150'
// })
//     .then((uids) => {
//         return getUsersInfo.getAdoptedUsersInfo(uids, ['age', 'gender', 'last_online']);
//     })
//     .then((data) => {
//         return data.filter((user) => {
//
//             // 864000000
//
//             const onlineDiff = new Date().getTime() - new Date(user.lastOnline).getTime();
//
//             return ( user.age > 50 && user.gender == 'F' && onlineDiff < 3 * 24 * 60 * 60 * 1000 );
//         });
//     })
//     .then((data2) => {
//         debugger;
//     })
//     .catch((err) => {
//         debugger;
//     });


// sequelize.query(
//     "SELECT uid FROM users ORDER BY updatedAt ASC LIMIT 50000",
//     {
//         type: sequelize.QueryTypes.SELECT,
//         raw: true
//     }
// )
//     .then((res) => {
//
//         const uids = res.map((candidate) => {
//             return candidate.uid;
//         });
//
//         debugger;
//
//         getUsersInfo.getAllUsersInfoFromOK(uids, ['last_online'])
//             .then((apiRes) => {
//
//                 const data = apiRes.map((user) => {
//                     return {
//                         uid: user.uid,
//                         lastOnline: user.last_online
//                     };
//                 });
//
//                 debugger;
//
//
//
//                 // return getUsersInfo.bulkUpsertParallel(User, data, true);
//
//                 return User.bulkCreate(
//                     data,
//                     {
//                         updateOnDuplicate: ['lastOnline', 'updatedAt']
//                     }
//                 );
//
//                 //
//                 // return Promise.all(apiRes.map((user) => {
//                 //
//                 //    return sequelize.query(
//                 //        `
//                 //         UPDATE LOW_PRIORITY
//                 //             users
//                 //         SET lastOnline='${user.last_online}'
//                 //         WHERE uid = '${user.uid}';
//                 //         `,
//                 //        {type: sequelize.QueryTypes.UPDATE, raw: true}
//                 //    )
//                 //
//                 // }));
//
//             })
//             .then((updRes) => {
//                 debugger;
//                 // console.log(updRes);
//                 process.exit(0);
//             })
//             .catch((err) => {
//                 debugger;
//                 console.error(err);
//                 process.exit(1);
//             })
//
//     })
//     .catch((err) => {
//         debugger;
//         console.error(err);
//         process.exit(1);
//     });



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