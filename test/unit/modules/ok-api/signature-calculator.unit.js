"use strict";

const signatureCalculator = require('../../../../src/modules/ok-api/signature-calculator');

describe("OK API / signature calculator", ()=> {

    describe("objectToAscSortedString", ()=> {

        const objectToAscSortedString = signatureCalculator.objectToAscSortedString;

        it(`without separator`, () => {

            const result = objectToAscSortedString({a: 1, e: 2, c: 3});
            const expected = "a=1c=3e=2";

            expect(result).to.eql(expected);

        });

        it(`with separator`, () => {

            const result = objectToAscSortedString({a: 1, e: 2, c: 3}, true);
            const expected = "a=1&c=3&e=2";

            expect(result).to.eql(expected);

        });

    });

    describe("calculateSignature", ()=> {

        const calculateSignature = signatureCalculator.calculateSignature;
        const credentials = {
            accessToken: 'sd673dd',
            applicationKey: 'SDF786',
            applicationSecretKey: 'AS90D23VD'
        };

        it(`should calculate signature`, () => {

            const result = calculateSignature({uids: '12345'}, credentials);
            const expected = "50bd34071855d0d8b8b797ead2ea317b";

            expect(result).to.eql(expected);

        });

        const expectations = [
            [/credentials object/, null],
            [/accessToken/, {applicationKey: 'SDF786', applicationSecretKey: 'AS90D23VD'}],
            [/applicationKey/, {accessToken: 'sd673dd', applicationSecretKey: 'AS90D23VD'}],
            [/applicationSecretKey/, {accessToken: 'sd673dd', applicationKey: 'SDF786'}]
        ];

        expectations.forEach((expectation)=> {

            it(`throw if no ${expectation[0]}`, () => {

                expect(calculateSignature.bind(null, {}, expectation[1])).to.throw(expectation[0]);

            });

        });

    });

});