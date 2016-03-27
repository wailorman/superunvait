"use strict";

const ok = require('ok.ru');
const Q = require('q');
const okApiHelpers = require('./helpers');
const _ = require('lodash');

const okCredentialsStr = process.env.OK_CREDENTIALS;
if (!okCredentialsStr) throw 'OK_CREDENTIALS env var should be passed';

const okCredentials = okApiHelpers.getCredentialsByStr(okCredentialsStr);

const requestOptions = _.pick(okCredentials, ['applicationId', 'applicationKey', 'applicationSecretKey']);

ok.setOptions(requestOptions);
ok.setAccessToken(okCredentials.accessToken);

const universalFunction = function (method, requestParameters) {
    let nodefiedRequest;

    if (method.toUpperCase() == 'GET') {
        nodefiedRequest = Q.denodeify(ok.get);
    }else if (method.toUpperCase() == 'POST') {
        nodefiedRequest = Q.denodeify(ok.post);
    }else{
        throw 'Accepting only POST or GET methods';
    }

    return nodefiedRequest(requestParameters)
        .then((data)=> {
            return data[0];
        });
};

const getCredentialsStr = function () {
    return okCredentialsStr;
};

const getCredentials = function () {
    return okCredentials;
};

const okFacade = {
    get: universalFunction.bind(this, 'GET'),
    post: universalFunction.bind(this, 'POST'),

    getCredentials,
    getCredentialsStr
};

module.exports = okFacade;