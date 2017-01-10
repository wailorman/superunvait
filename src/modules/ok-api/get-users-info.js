"use strict";

const okApi = require('./ok-api-facade');
const models = require('../../../models/index');
const User = models.user;
const sequelize = require('../../../models/index').sequelize;
const Q = require('q');
const okApiHelpers = require('./helpers');

const fieldsRequiredForUsersGetInfo = [
    'uid',
    'name',
    'age',
    'allows_anonym_access',
    'allows_messaging_only_for_friends',
    'birthday',
    'gender',
    'last_online',
    'registered_date',
    'location',
    'photo_id',
    'pic_5',
    'pic_full',
    'has_service_invisible',
    'private'
    // '*'
];
const requiredFieldsStr = fieldsRequiredForUsersGetInfo.join(',');

const adoptReceivedData = function (dataFromApi) {

    const camelized = okApiHelpers.camelizeKeys(dataFromApi);
    const adoptedLocation = okApiHelpers.adoptLocation(camelized);

    return okApiHelpers.adoptGender(adoptedLocation);

};

const getAdoptedUsersInfo = function(uids) {

    return getAllUsersInfoFromOK(uids)
        .then((rawUsersData) =>
            rawUsersData.map(userData => adoptReceivedData(userData))
        )

};

const getAllUsersInfoFromOK = function (userIds) {

    const parts = Math.floor( userIds.length / 100 ) + 1;

    const splittedUserIds = chunkify(userIds, parts, true);

    return Promise.all(
        splittedUserIds.map((userIdsBlock) =>
            getUsersInfoFromOK(userIdsBlock)
        )
    ).then((result) => {
        return [].concat.apply([], result)
    });

};

const getUsersInfoFromOK = function (userIds) {

    return new Promise((resolve, reject) => {

        if (userIds.length == 0) return resolve([]);

        let requestParameters = {
            method: 'users.getInfo',
            uids: userIds.join(',') || userIds,
            fields: requiredFieldsStr
        };

        return okApi.get(requestParameters)
            .then(resolve)
            .catch(reject);

    });

};

const bulkUpsert = function (model, dataArray, validationNecessity) {

    if (validationNecessity === undefined)
        validationNecessity = true;

    return sequelize.transaction((t1)=> {

        let transactionQueries = [];

        dataArray.forEach((data)=> {

            transactionQueries.push(
                model.upsert(
                    data,
                    {
                        transaction: t1,
                        validate: validationNecessity
                    }
                )
            );

        });

        return Q.all([transactionQueries]);

    });

};

const saveUsersInfo = function (userIds) {

    return getUsersInfoFromOK(userIds)
        .then((receivedData)=> {

            let adoptedData = [];

            receivedData.forEach((data)=> {
                adoptedData.push(adoptReceivedData(data));
            });

            return bulkUpsert(User, adoptedData);

        });

};

function chunkify(a, n, balanced) {

    if (n < 2)
        return [a];

    let len = a.length,
        out = [],
        i = 0,
        size;

    if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
            out.push(a.slice(i, i += size));
        }
    }

    else if (balanced) {
        while (i < len) {
            size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i += size));
        }
    }

    else {

        n--;
        size = Math.floor(len / n);
        if (len % size === 0)
            size--;
        while (i < size * n) {
            out.push(a.slice(i, i += size));
        }
        out.push(a.slice(size * n));

    }

    return out;
}

module.exports = {
    saveUsersInfo,
    getAllUsersInfoFromOK,
    getUsersInfoFromOK,
    adoptReceivedData,
    requiredFieldsStr,
    bulkUpsert,
    getAdoptedUsersInfo
};