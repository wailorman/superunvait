import { getCurrentUserInfo } from '../../lib/ok-ui-parsers/user-data'

describe("ok ui parsers / user data", ()=> {

    describe("getCurrentUserInfo", ()=> {

        before(()=> {
            const fixtureContent = require('raw!../fixtures/current-user-hook-data.html');
            $('#test-zone').html(fixtureContent);
        });

        after(()=> {
            $('#test-zone').html("");
        });

        it(`should parse elem`, () => {

            let actualResult = getCurrentUserInfo();

            expect(actualResult.uid).to.eql("553372481526");

        });

    });

});