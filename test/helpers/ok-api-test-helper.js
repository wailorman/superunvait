const signatureCalculator = require('../../src/modules/ok-api/signature-calculator');
const okApiFacade = require('../../src/modules/ok-api/ok-api-facade');
const nock = require('nock');

const credentials = okApiFacade.getCredentials();

const mockApiRequest = function (query, responseObject) {

    const expectedRequestParams = signatureCalculator._generateQueryObjectWithSig(query, credentials);

    return nock('http://api.odnoklassniki.ru')
        .get('/fb.do')
        .query(expectedRequestParams)
        .reply(200, responseObject);
};

module.exports = {mockApiRequest};