"use strict";

const okApi = require('./ok-api-facade');
const models = require('../../../models/index');
const User = models.user;
const sequelize = require('../../../models/index').sequelize;
const Q = require('q');
const okApiHelpers = require('./helpers');
const async = require('async');
const _ = require('lodash');

const PARALLEL_HTTP_REQUESTS = process.env.PARALLEL_HTTP_REQUESTS || 3;

const okApiFields = [
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
const requiredFieldsStr = okApiFields.join(',');

const adoptReceivedData = _.flow([
    okApiHelpers.camelizeKeys,
    okApiHelpers.adoptLocation,
    okApiHelpers.adoptGender,
    okApiHelpers.adoptLastOnline
]);

const getAdoptedUsersInfo = function(uids, fields) {

    return getAllUsersInfoFromOK(uids, fields)
        .then((rawUsersData) =>
            rawUsersData.map(userData => adoptReceivedData(userData))
        )

};

const getAppropFriendsUids = (uid) => {
    return getFriendsUids(uid)
        .then((uids) => {
            return getAdoptedUsersInfo(uids, ['age', 'gender', 'last_online']);
        })
        .then((friendsInfo) => {
            return filterGrannies(friendsInfo)
        })
        .then((filteredFriends) => {
            return filteredFriends.map((user) => {
                return user.uid;
            });
        });
};

const filterGrannies = (users) => {
    return users.filter((user) => {

        const LAST_ONLINE_DAYS_MIN = 10;

        const onlineDiff = new Date().getTime() - new Date(user.lastOnline).getTime();

        return (
            user.age > 50 && user.age < 90 &&
            user.gender == 'F' &&
            onlineDiff < LAST_ONLINE_DAYS_MIN * 24 * 60 * 60 * 1000
        );
    });
};

const getFriendsUids = (uid) => {
    return okApi.get({
        method: 'friends.get',
        fid: uid
    });
};

const getAllUsersInfoFromOK = function (userIds, fields) {

    return new Promise((resolve, reject) => {

        const parts = Math.floor( userIds.length / 100 ) + 1;

        const splittedUserIds = chunkify(userIds, parts, true);

        async.mapLimit(
            splittedUserIds,
            PARALLEL_HTTP_REQUESTS,
            (uidsBlock, callback) => {

                getUsersInfoFromOK(uidsBlock, fields)
                    .then((result) => {
                        callback(null, result);
                    })
                    .catch((err) => {
                        callback(err);
                    })

            },
            (err, results) => {
                if (err) return reject(err);
                return resolve( [].concat.apply([], results) );
            }
        );

    });

};

const getUsersInfoFromOK = function (userIds, fields = okApiFields) {

    return new Promise((resolve, reject) => {

        if (userIds.length == 0) return resolve([]);

        let requestParameters = {
            method: 'users.getInfo',
            uids: userIds.join(',') || userIds,
            fields: fields.join(',')
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

const bulkUpsertParallel = function(model, dataArray, validationNecessity) {

    if (validationNecessity === undefined)
        validationNecessity = true;


    return new Promise((resolve, reject) => {

        async.eachLimit(
            dataArray,
            10,
            (data, callback) => {

                model.upsert(
                    data,
                    {
                        validate: validationNecessity
                    }
                ).then(() => {
                    callback();
                }).catch((err) => {
                    callback(err);
                });

            }, (err) => {

                if (err) return reject(err);
                resolve();

            });

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
    getAdoptedUsersInfo,
    bulkUpsertParallel,
    getAppropFriendsUids,
    filterGrannies,
    getFriendsUids
};