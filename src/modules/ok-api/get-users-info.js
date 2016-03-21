"use strict";

const okApi = require('./ok-api-facade');
const models = require('../../../models/index');
const User = models.user;
const _ = require('lodash');
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
    'location',
    'photo_id',
    'has_service_invisible',
    'private'
];
const requiredFields = fieldsRequiredForUsersGetInfo.join(',');

const adoptReceivedData = function (dataFromApi) {

    const camelized = okApiHelpers.camelizeKeys(dataFromApi);
    const adoptedLocation = okApiHelpers.adoptLocation(camelized);

    return okApiHelpers.adoptGender(adoptedLocation);

};

const getUsersInfoFromOK = function (userIds) {

    let requestParameters = {
        method: 'users.getInfo',
        uids: userIds.join(',') || userIds,
        fields: requiredFields
    };

    return okApi.get(requestParameters);

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

    let requestParameters = {
        method: 'users.getInfo',
        uids: userIds.join(',') || userIds,
        fields: requiredFields
    };

    return okApi.get(requestParameters)
        .then((receivedData)=> {

            let adoptedData = [];

            receivedData.forEach((data)=> {
                adoptedData.push(adoptReceivedData(data));
            });

            return bulkUpsert(User, adoptedData);

        });

};

module.exports = {
    saveUsersInfo,
    getUsersInfoFromOK,
    adoptReceivedData,
    fieldsRequiredForUsersGetInfo,
    bulkUpsert
};