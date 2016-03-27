"use strict";

const nock = require('nock');

const okApi = require('../../../../src/modules/ok-api/ok-api-facade');
const okApiHelpers = require('../../../../src/modules/ok-api/helpers');
const okApiTestHelpers = require('../../../helpers/ok-api-test-helper');
const signatureCalculator = require('../../../../src/modules/ok-api/signature-calculator');
const fixtures = require('../../../fixtures/users.getInfo.json');
const groupFixtures = require('../../../fixtures/group.getMembers - 1.json');

const credentials = okApiHelpers.getCredentialsByStr(process.env.OK_CREDENTIALS);

describe("ok api facade", ()=> {

    it(`should pull some user info`, () => {

        let query = {
            method: "users.getInfo",
            fields: "*",
            uids: "571769013138",

            application_key: credentials.applicationKey
        };

        query.sig = signatureCalculator.calculateSignature(query,  credentials);
        query.access_token = credentials.accessToken;

        const usersGetInfoMock = nock('http://api.odnoklassniki.ru')
            .get('/fb.do')
            .query(query)
            .reply(200, [fixtures[1]]);

        let requestParameters = {
            method: 'users.getInfo',
            uids: '571769013138',
            fields: '*'
        };

        return okApi.get(requestParameters)
            .then((data)=> {
                expect(data[0].uid).to.eql('571769013138');
                return data;
            })
            .finally(()=> {
                expect(usersGetInfoMock.isDone()).to.eql(true);
            });

    });

    it(`should not use empty query fields in query string`, () => {

        const nockedRequest = okApiTestHelpers.mockApiRequest(
            {
                method: 'group.getMembers',
                count: 100,
                uid: 123
            },
            groupFixtures
        );

        const queryParameters = {
            method: 'group.getMembers', count: 100, uid: 123, anchor: null
        };

        return okApi.get(queryParameters)
            .then((res)=> {
                expect(nockedRequest.isDone()).to.eql(true);
            });

    });

});