"use strict";

const nock = require('nock');

const getGroupMembers = require('../../../../src/modules/ok-api/get-group-members');
const mockApiRequest = require('../../../helpers/ok-api-test-helper').mockApiRequest;
const generateQueryObject = require('../../../helpers/ok-api-test-helper').generateQueryObject;

const fixtures = {
    short1: require('../../../fixtures/group.getMembers - 1 short.json'),
    1: require('../../../fixtures/group.getMembers - 1.json'),
    2: require('../../../fixtures/group.getMembers - 2.json')
};

describe("OK API / get group members", ()=> {


    describe("getLastMembersUids", ()=> {

        //should write 1 member
        //should write 100 members
        //should write 101 members with 2 requests
        //should write 201 members with three requests
        //should not write anything if members amount = 0

        //should request twice if first response return only half
        //should calm down on second request if requested 100, but there are only 50

    });

    describe("doMembersGetRequest", ()=> {

        const doMembersGetRequest = getGroupMembers.doMembersGetRequest;

        const exampleGroupId = '53396058603765';
        const exampleMembersGetQuery = {
            method: 'group.getMembers',
            uid: exampleGroupId,
            count: 100
        };

        let nockedRequest;

        beforeEach(()=> {

            nock.cleanAll();

            nockedRequest = mockApiRequest(
                exampleMembersGetQuery,
                fixtures[1]
            );

        });

        afterEach(()=> {
            nock.cleanAll();
        });


        it(`should make correct request`, () => {

            return doMembersGetRequest(exampleGroupId, 100)
                .then((res)=> {
                    expect(res.anchor).to.eql(fixtures[1].anchor);
                    expect(nockedRequest.isDone()).to.eql(true);
                });

        });

        it(`should response with converted response`, () => {

            return doMembersGetRequest(exampleGroupId, 100)
                .then((res)=> {
                    expect(res.members).to.be.an('array');
                    expect(res.members[0]).to.eql('77215026');
                    expect(res.members[96]).to.eql('106389752971');
                });

        });

        it(`should reject error if response is invalid`, () => {

            let nockedErrorRequest = nock('http://api.odnoklassniki.ru')
                .get('/fb.do')
                .query(generateQueryObject(exampleMembersGetQuery))
                .reply(409, {
                    error_code: 123,
                    error_message: 'some err!'
                });

            return doMembersGetRequest(exampleGroupId, 100)
                .catch((err)=> {

                    expect(nockedErrorRequest.isDone()).to.eql(true);
                    expect(err.error_code).to.eql(123);

                })

        });

    });


});