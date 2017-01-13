"use strict";

const _ = require('lodash');

const camelizeKeys = function (receivedData) {

    const resultData = {};

    _.each(receivedData, (value, index)=>{
        resultData[_.camelCase(index)] = value;
    });

    return resultData;

};

const adoptLocation = function (receivedData) {

    if (!receivedData.location) return receivedData;

    const resultData = _.cloneDeep(receivedData);

    resultData.city = receivedData.location.city;
    resultData.country = receivedData.location.countryName;

    delete resultData.location;

    return resultData;

};

const adoptGender = function (receivedData) {

    if (!receivedData.gender) return receivedData;

    const resultData = _.cloneDeep(receivedData);

    switch (receivedData.gender) {
        case 'male':
            resultData.gender = 'M';
            break;
        case 'female':
            resultData.gender = 'F';
            break;
        default:
            throw `Unexpected gender: ${receivedData.gender}`;
            break;
    }

    return resultData;

};

//todo: verify credentials str

const getCredentialsByStr = function (str) {

    const splited = str.split(';');

    return {
        applicationId: splited[0],
        applicationKey: splited[1],
        applicationSecretKey: splited[2],
        accessToken: splited[3]
    };

};

const removeEmptyFieldsFromObject = function (obj) {

    let fieldsToRemove = [];
    let objClone = _.cloneDeep(obj);

    _.forIn(objClone, (value, key)=> {

        if (!value) fieldsToRemove.push(key);

    });

    return _.omit(objClone, fieldsToRemove);

};

module.exports = {
    removeEmptyFieldsFromObject,
    camelizeKeys,
    adoptLocation,
    adoptGender,
    getCredentialsByStr
};