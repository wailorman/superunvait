"use strict";

const okApi = require('./ok-api-facade');
const models = require('../../../models/index');
const User = models.user;
const _ = require('lodash');
const sequelize = require('../../../models/index').sequelize;
const Q = require('q');
const humps = require('humps');
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
const joinedFields = fieldsRequiredForUsersGetInfo.join(',');

const adoptPulledDataToDbFormat = function (dataFromApi) {

    let dataForDB = {};

    dataForDB.allowsAnonymAccess = dataFromApi.allows_anonym_access;
    dataForDB.allowsMessagingOnlyForFriends = dataFromApi.allows_messaging_only_for_friends;
    dataForDB.lastOnline = dataFromApi.last_online;
    dataForDB.photoId = dataFromApi.photo_id;
    dataForDB.hasServiceInvisible = dataFromApi.has_service_invisible;

    switch (dataFromApi.gender) {
        case 'male':
            dataForDB.gender = 'M';
            break;
        case 'female':
            dataForDB.gender = 'F';
            break;
    }

    if (dataFromApi.location) {
        dataForDB.city = dataFromApi.location.city;
        dataForDB.countryName = dataFromApi.location.countryName;
    }

    const fieldsToPickFromApiResponse = _.without(
        fieldsRequiredForUsersGetInfo, 'gender', 'location',
        'allows_anonym_access', 'allows_messaging_only_for_friends', 'last_online', 'photo_id', 'has_service_invisible'
    );

    const cuttedDataFromApi = _.pick(dataFromApi, fieldsToPickFromApiResponse);

    return _.merge(cuttedDataFromApi, dataForDB);

};

const pullUsersInfo = function (userIds) {

    let requestParameters = {
        method: 'users.getInfo',
        uids: userIds.join(',') || userIds,
        fields: joinedFields
    };

    okApi.get(requestParameters)
        .then((data)=> {

            sequelize.transaction((t1)=> {

                let transactionQueries = [];

                data.forEach((user)=> {

                    const adoptedUser = adoptPulledDataToDbFormat(user);

                    transactionQueries.push(
                        User.upsert(
                            adoptedUser,
                            {
                                transaction: t1,
                                validate: true
                            }
                        )
                    );

                });

                return Q.all([transactionQueries]);

            });
        })
        .catch((err)=> {
            debugger;
            return err;
        });

};

module.exports = {pullUsersInfo, adoptReceivedData};