"use strict";

const getGroupMembers = require('../../../../src/modules/ok-api/get-group-members');

describe("OK API / get group members", ()=> {

    describe("convertResponse", ()=> {

        const convertResponse = getGroupMembers.convertResponse;

        const examplePayload = require('../../../fixtures/group.getMembers - 1 short.json');

        const expectedMembersArray = [
            '106770658161',
            '107269796331',
            '107974487920',
            '107986528211',
            '110155316285',
            '110594416400',
            '110852134928',
            '111377293060',
            '111421099655',
            '111562086379',
            '112888033984'
        ];

        it(`should convert members to flat array`, () => {

            const result = convertResponse(examplePayload);

            expect(result.members).to.eql(expectedMembersArray);

        });

        it(`should keep anchor, has_more, totalCount props`, () => {

            const result = convertResponse(examplePayload);

            expect(result).to.have.property('totalCount', 4637);
            expect(result).to.have.property('anchor', "LTEwNTk3ODExMjA4MTotMTU3MTI1MDQ3NTAw");
            expect(result).to.have.property('has_more', true);

        });


        // members array if empty -> members:[]
        // anchor didn't resolved -> throw ANCHOR_MISSING
        // in some of objects disappeared userId field

        // should remove members duplicates

    });

    describe("collectionToPlainArray", ()=> {

        const collectionToPlainArray = getGroupMembers.collectionToPlainArray;

        const exampleMembersCollection = [
            {userId: '123456'},
            {userId: '239780'},
            {userId: '443544'},
            {userId: '992348'},
            {userId: '554165'}
        ];

        const exampleMembersArray = [
            '123456',
            '239780',
            '443544',
            '992348',
            '554165'
        ];

        it(`should return flat converted array`, () => {

            const returnedValue = collectionToPlainArray(exampleMembersCollection, 'userId');

            expect(returnedValue).to.eql(exampleMembersArray);

        });


        it(`ignore if some of users aren't correct`, () => {

            const incorrectUsersCollection = [
                {userId: '123456'},
                {userId: '239780'},
                {userId: null},
                {},
                undefined,
                {userId: '992348'},
                {userId: '554165'}
            ];

            const expectedArray = [
                '123456',
                '239780',
                '992348',
                '554165'
            ];

            const result = collectionToPlainArray(incorrectUsersCollection, 'userId');

            expect(result).to.eql(expectedArray);

        });

        it(`throw ARRAY_MISSING if members array isn't defined`, () => {

            const result = collectionToPlainArray(null, 'userId');

            expect(result).to.eql([]);

        });

        it(`should pick any field`, () => {

            const exampleCollection = [
                {hey: 123, some: 555},
                {hey: 5678},
                null,
                {hey: 3404, any: '234'}
            ];

            const expectedResult = [
                123,
                5678,
                3404
            ];

            const result = collectionToPlainArray(exampleCollection, 'hey');

            expect(result).to.eql(expectedResult);

        });

        it(`should return [] if collection is empty`, () => {

            const result = collectionToPlainArray([], 'userId');

            expect(result).to.eql([]);

        });

        it(`should return [] if fieldToPick not passed`, () => {

            const result = collectionToPlainArray(exampleMembersCollection);

            expect(result).to.eql([]);

        });

        // NO_MEMBERS_ANY_MORE if members array is empty
        // NO_MEMBERS_ANY_MORE if non array passed

    });

    describe("validateResponse", ()=> {

        // should return 1 if all OK
        // should return 0 if response not valid

    });

    describe("doMembersGetRequest", ()=> {

        // should make correct request
        // should reject error if response is invalid

    });


});