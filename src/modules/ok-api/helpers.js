const humps = require('humps');

const camelizeKeys = function (receivedData) {

    const resultData = {};

    _.each(receivedData, (value, index)=>{
        resultData[humps.camelize(index)] = value;
    });

    return resultData;

};

const adoptLocation = function (receivedData) {

    const resultData = _.cloneDeep(receivedData);

    resultData.city = receivedData.location.city;
    resultData.country = receivedData.location.countryName;

    delete resultData.location;

    return resultData;

};

const adoptGender = function (receivedData) {

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


module.exports = {camelizeKeys, adoptLocation, adoptGender, getCredentialsByStr};