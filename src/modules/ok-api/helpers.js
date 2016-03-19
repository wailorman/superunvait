const humps = require('humps');

const adoptReceivedData = function (receivedData) {

    const resultData = {};

    _.each(receivedData, (value, index)=>{
        resultData[humps.camelize(index)] = value;
    });

    return resultData;

};

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

    debugger;

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


module.exports = {camelizeKeys, adoptLocation, adoptGender, adoptReceivedData};