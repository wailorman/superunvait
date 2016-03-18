import {
    pluckNumberFromStr
} from '../../../src/modules/post-hunter/parsers/ok-ru'

describe("post hunter / ok.ru parser", ()=> {

    describe("pluckNumberFromStr()", ()=> {

        const expectations = [
            [21, "21"],
            ["", "0"],
            ["21", "21"],
            ["21 1", "211"],
            ["21  1", "211"],
            ["21 &nbsp; 1", "211"],
            ["21 !!! hey hey &nbsp; 1", "211"]
        ];

        expectations.forEach((expectation)=> {

            let passedString, expectedResult, actualResult;

            passedString = expectation[0];
            expectedResult = expectation[1];
            actualResult = pluckNumberFromStr(passedString);

            it(`should return ${JSON.stringify(expectedResult)} for ${JSON.stringify(passedString)}`, () => {

                expect(actualResult).to.eql(expectedResult);

            });

        });

        it(`should throw error if object passed`, () => {

            expect(()=> {
                pluckNumberFromStr({a: "a"});
            }).to.throw(TypeError);

        });

    });

});