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


    const exampleGroupId = '53396058603765';


    describe("getLastMembersUids", ()=> {

        const getLastMembersUids = getGroupMembers.getLastMembersUids;

        beforeEach(()=> {
            nock.cleanAll();
        });

        afterEach(()=> {
            nock.cleanAll();
        });


        it(`should get 1 member`, () => {

            let cuttedFixture1 = _.cloneDeep(fixtures[1]);
            cuttedFixture1.members = _.take(fixtures[1].members, 1);

            const nockedRequest = mockApiRequest(
                {
                    method: 'group.getMembers',
                    uid: exampleGroupId,
                    count: 1
                },
                cuttedFixture1
            );

            return getLastMembersUids(exampleGroupId, 1)
                .then((res)=> {
                    expect(nockedRequest.isDone()).to.eql(true);
                    expect(res.length).to.eql(1);
                    expect(res[0]).to.eql(cuttedFixture1.members[0].userId);
                });

        });

        it(`should get 97 members`, () => {

            const nockedRequest = mockApiRequest(
                {
                    method: 'group.getMembers',
                    uid: exampleGroupId,
                    count: 97
                },
                fixtures[1]
            );

            return getLastMembersUids(exampleGroupId, 97)
                .then((res)=> {
                    expect(nockedRequest.isDone()).to.eql(true);
                    expect(res.length).to.eql(97);
                    expect(res[0]).to.eql(fixtures[1].members[0].userId);
                    expect(res[96]).to.eql(fixtures[1].members[96].userId);
                });

        });

        it(`should get 101 members with 2 requests`, () => {

            const nockedRequest1 = mockApiRequest(
                {
                    method: 'group.getMembers',
                    uid: exampleGroupId,
                    count: 100
                },
                fixtures[1]
            );

            let cuttedFixture2 = _.cloneDeep(fixtures[2]);
            cuttedFixture2.members = _.take(fixtures[2].members, 4);

            const nockedRequest2 = mockApiRequest(
                {
                    method: 'group.getMembers',
                    uid: exampleGroupId,
                    count: 4,
                    anchor: fixtures[1].anchor
                },
                cuttedFixture2
            );

            return getLastMembersUids(exampleGroupId, 101)
                .then((res)=> {
                    expect(nockedRequest1.isDone()).to.eql(true);
                    expect(nockedRequest2.isDone()).to.eql(true);

                    expect(res.length).to.eql(101);

                    expect(res[0]).to.eql(_.first(fixtures[1].members).userId);
                    expect(res[96]).to.eql(_.last(fixtures[1].members).userId);

                    expect(res[97]).to.eql(_.first(fixtures[2].members).userId);
                    expect(res[100]).to.eql(fixtures[2].members[3].userId);
                });

        });

        it(`should ignore overhead`, () => {

            const nockedRequest1 = mockApiRequest(
                {
                    method: 'group.getMembers',
                    uid: exampleGroupId,
                    count: 100
                },
                fixtures[1]
            );

            const nockedRequest2 = mockApiRequest(
                {
                    method: 'group.getMembers',
                    uid: exampleGroupId,
                    count: 4,
                    anchor: fixtures[1].anchor
                },
                fixtures[2]
            );

            return getLastMembersUids(exampleGroupId, 101)
                .then((res)=> {
                    expect(nockedRequest1.isDone()).to.eql(true);
                    expect(nockedRequest2.isDone()).to.eql(true);

                    expect(res.length).to.eql(101);

                    expect(res[0]).to.eql(_.first(fixtures[1].members).userId);
                    expect(res[96]).to.eql(_.last(fixtures[1].members).userId);

                    expect(res[97]).to.eql(_.first(fixtures[2].members).userId);
                    expect(res[100]).to.eql(fixtures[2].members[3].userId);
                });

        });

        // should get 201 members with three requests
        // should not get anything if members amount = 0

        // should request twice if first response return only half
        // should calm down on second request if requested 100, but there are only 50
        // should calm down on second request if requested Infinity, but there are only 50

        // + has_more using

    });

    describe("doMembersGetRequest", ()=> {

        const doMembersGetRequest = getGroupMembers.doMembersGetRequest;

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