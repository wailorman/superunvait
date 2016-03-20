"use strict";

const _ = require('lodash');
const md5 = require("md5");

/**
 * Convert object `{a:1,b:2}` to `"a=1b=2"` or `"a=1&b=2"` sorted string
 *
 * @param {object} obj
 * @param {boolean} [separateNecessity] If true, `&` will separate object cells. Otherwise cells won't be separate
 * @returns {string}
 */
const objectToAscSortedString = function (obj, separateNecessity) {

    if (!separateNecessity) separateNecessity = false;

    const arrayOfKeyValuePairs = _.toPairs(obj).sort();
    const separator = separateNecessity ? '&' : '';

    let sortedParams = '';

    _.each(arrayOfKeyValuePairs, (pair, index)=> {
        const key = _.first(pair);
        const value = _.last(pair);
        const isLast = index == arrayOfKeyValuePairs.length - 1;
        sortedParams += `${key}=${value}${isLast ? '' : separator}`;
    });

    return sortedParams;

};


/**
 * Calculating signature by query object and credentials
 *
 * @param {object} queryObject
 * @param {object} credentials
 * @throws {string} `[credentials part] missing`
 * @returns {*}
 */
const calculateSignature = function (queryObject, credentials) {

    if (!credentials)
        throw 'credentials object missing';

    if (!credentials.accessToken)
        throw 'accessToken missing';

    if (!credentials.applicationKey)
        throw 'applicationKey missing';

    if (!credentials.applicationSecretKey)
        throw 'applicationSecretKey missing';


    const accessToken = credentials.accessToken,
          applicationSecretKey = credentials.applicationSecretKey;

    queryObject['application_key'] = credentials.applicationKey;

    const sortedParams = objectToAscSortedString(queryObject);
    const secret = md5(accessToken + applicationSecretKey);

    return md5(sortedParams + secret);
};

module.exports = {objectToAscSortedString, calculateSignature};