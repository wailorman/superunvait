const pullUsersData = require('./modules/ok-api/get-users-info');
const nock = require('nock');
const okApi = require('./modules/ok-api/ok-api-facade');
const getGroupMembers = require('./modules/ok-api/get-group-members');
const getUsersInfo = require('./modules/ok-api/get-users-info');

const models = require('../models/index');
const User = models.user;
const Member = models.member;

const refreshMembersData = function() {

    getGroupMembers.getLastMembersUids(53396058603765, 999999999)
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

refreshMembersData();


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