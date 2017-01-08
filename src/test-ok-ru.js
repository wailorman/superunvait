require('babel-core/register');
require('babel-polyfill');


const getGroupMembers = require('./modules/ok-api/get-group-members');
const getUsersInfo = require('./modules/ok-api/get-users-info');

const models = require('../models/index');
const User = models.user;
const Member = models.member;
const Invite = models.invite;

const refreshMembersData = function() {

    getGroupMembers.getLastMembersUids(53396058603765, 20)
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

    getGroupMembers.getLastMembersUids(53396058603765, 100)
        .then((membersList) => {

            getUsersInfo.bulkUpsert(Member, membersList.map((id) => ({ id: id })));
            return membersList;

        })
        .then((membersList) =>
            getUsersInfo.getAllUsersInfoFromOK(membersList)
        )
        .then((rawUsersData) =>

            Promise.all(
                rawUsersData.map(userData => getUsersInfo.adoptReceivedData(userData))
            )
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

    Invite.findAll({ limit: 1000, order: 'id DESC', raw: true }).then((data) => {
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


const fetchHtml = require('./modules/ok-api/fetch-html-data');

User.findAll({ limit: 1000, offset: 11000, order: 'createdAt DESC', raw: true })
    .then((data) => {
        debugger;
        return data.map(user => user.uid);
    })
    .then((uids) => {
        return fetchHtml.multipleFetchHtmlUserData(uids)
    })
    .then((data) => {

        debugger;
        return getUsersInfo.bulkUpsert(User, data, true)
            .then((res) => {
                debugger;
            });

    })
    .catch((err) => {
        debugger;
    });


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