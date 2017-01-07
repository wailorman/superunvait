const pullUsersData = require('./modules/ok-api/get-users-info');
const nock = require('nock');
const okApi = require('./modules/ok-api/ok-api-facade');
const getGroupMembers = require('./modules/ok-api/get-group-members');
const getUsersInfo = require('./modules/ok-api/get-users-info');

const models = require('../models/index');
const User = models.user;


//nock('http://api.odnoklassniki.ru')
//    .filteringPath(()=>'/fb.do')
//    .get('/fb.do')
//    .reply(200, 'OK');

//okApi.get({
//        method: 'group.getMembers',
//        uid: '53396058603765',
//        count: 100,
//        anchor: 'LTE5NTE3NTU3OTY6LTEwNjEyNjIxOTE3OQ'
//    })
//    .then((res)=> {
//        debugger;
//    })
//    .catch((err)=> {
//        debugger;
//    });

getGroupMembers.getLastMembersUids(53396058603765, 999999999)
.then((membersList)=> {
    // debugger;

    getUsersInfo.getAllUsersInfoFromOK(membersList)
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

        // return Promise.all(
        //     membersList.map((userId) => getUsersInfo.getUsersInfoFromOK([userId])
        //             .then((rawUserData => getUsersInfo.adoptReceivedData(rawUserData) ))
        //     )
        // )
        // .then((adoptedData) => {
        //
        //     debugger;
        //
        // })


})
.catch((err)=> {
    // debugger;
    console.error(err);
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