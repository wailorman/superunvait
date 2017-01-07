const getGroupMembers = require('../modules/ok-api/get-group-members');
const getUsersInfo = require('../modules/ok-api/get-users-info');

const models = require('../models/index');
const User = models.user;
const Member = models.member;

const refreshMembersData = function() {

    getGroupMembers.getLastMembersUids(53396058603765, 999999999)
        .then((membersList) => {

            getUsersInfo.bulkUpsert(Member, membersList.map((id) => ({ id: id })))
                .then(() =>
                    getUsersInfo.getAllUsersInfoFromOK(membersList)
                )
                .then((rawUsersData) =>
                    Promise.all(
                        rawUsersData.map(userData => getUsersInfo.adoptReceivedData(userData))
                    )
                )
                .then((adoptedData) =>
                    getUsersInfo.bulkUpsert(User, adoptedData)
                );


        })
        .catch((err) => {
            // debugger;
            console.error(err);
        });

};

module.exports = {
    refreshMembersData
};