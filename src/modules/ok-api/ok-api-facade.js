"use strict";

const ok = require('ok.ru');
const Q = require('q');

const okCredentials = process.env.OK_CREDENTIALS;
if (!okCredentials) throw 'OK_CREDENTIALS env var should be passed';

const splitedCredentials = okCredentials.split(';');

const requestOptions = {
    applicationId: splitedCredentials[0],
    applicationKey: splitedCredentials[1],
    applicationSecretKey: splitedCredentials[2]
};

ok.setOptions(requestOptions);
ok.setAccessToken(splitedCredentials[3]);

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

const okFacade = {
    get: universalFunction.bind(this, 'GET'),
    post: universalFunction.bind(this, 'POST')
};

module.exports = okFacade;