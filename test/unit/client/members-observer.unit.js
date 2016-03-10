import { matchUrl } from '../../../public/src/modules/members-observer'

describe("Members observer", ()=> {

    describe("url matcher", ()=> {

        const expectations = [
            ['http://ok.ru/institutebb/members', true],
            ['http://ok.ru/institutebb/memberss', false],
            ['http://ok.ru/instituteb/members', false],
            ['https://ok.ru/institutebb/members', true],
            ['/institutebb/members', true],
            ['institutebb/members', false],
            ['http://ok.ru/group/53396058603765/members', true],
            ['http://ok.ru/group/53396058603760/members', false]
        ];

        expectations.forEach((expectation)=> {

            let passedUrl, expectedResult, actualResult;

            passedUrl = expectation[0];
            expectedResult = expectation[1];
            actualResult = matchUrl(passedUrl);

            it(`should return ${expectedResult} for ${passedUrl}`, () => {

                expect(actualResult).to.eql(expectedResult);

            });

        });

    });

});