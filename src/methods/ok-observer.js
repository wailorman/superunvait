const getGroupMembers = require('../modules/ok-api/get-group-members');
const getUsersInfo = require('../modules/ok-api/get-users-info');

const models = require('../../models/index');
const User = models.user;
const Member = models.member;
const Invite = models.invite;

const refreshMembersData = () => {

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

const getLastMembersIds = async (amount) => {

    const membersList = await getGroupMembers.getLastMembersUids(53396058603765, amount);
    console.log(`Members list fetched (last ${amount})`);
    return membersList;

};

const writeMembersIdsToDB = async (ids) => {

    const res = await getUsersInfo.bulkUpsert(Member, ids);
    console.log('Members list written to DB');
    return res;

};

const fetchUsersInfo = async (ids) => {

    const rawUsersData = await getUsersInfo.getAllUsersInfoFromOK(ids);

    console.log(`Members info fetched. Length: ${rawUsersData.length} `
        + `Last member id: ${rawUsersData[0].uid} `);

    return rawUsersData;

};

const writeFetchedUsersData = async (rawData) => {

    const adoptedData = rawData.map(
        userData => getUsersInfo.adoptReceivedData(userData)
    );

    const usersInsertRes = await getUsersInfo.bulkUpsert(User, adoptedData);
    console.log(`Members info written to DB`);

    return usersInsertRes;

};

const pullMembersInfo = async () => {

    const membersAmount = 500;

    console.log(``);

    try {

        const membersIdsList = await getLastMembersIds(membersAmount);

        const membersIds = membersIdsList.map((member) => ({id: member}));

        writeMembersIdsToDB(membersIds);

        const rawUsersData = await fetchUsersInfo(membersIdsList);

        return await writeFetchedUsersData(rawUsersData);

    } catch (e) {
        console.error(e);
    }

    console.log(``);

};

const pullInfoAboutInvites = async () => {

    console.log(``);

    try {

        const data = await Invite.findAll({ limit: 3000, order: 'id DESC', raw: true });

        const invitesUserIds = data.map((invite) => invite.userId);

        const rawUsersData = await getUsersInfo.getAllUsersInfoFromOK(invitesUserIds);

        const adoptedData = rawUsersData.map(userData => getUsersInfo.adoptReceivedData(userData));

        return await getUsersInfo.bulkUpsert(User, adoptedData);

    } catch (e) {
        console.error(e);
    }

    console.log(``);

};

module.exports = {
    refreshMembersData,
    pullInfoAboutInvites,
    pullMembersInfo
};