const getUsersInfoHelpers = require('../../../../src/modules/ok-api/helpers');

const fixtures = require('../../../fixtures/users.getInfo.json');

const nock = require('nock');

describe("OK API / get users info", ()=> {

    describe("helpers", ()=> {

        describe("camelizeKeys", ()=> {

            const camelizeKeys = getUsersInfoHelpers.camelizeKeys;

            it(`should convert under_scored to underScored and remove old attr`, () => {

                const result = camelizeKeys({under_scored: 123});
                const resultKeys = _.keys(result);

                expect(result.under_scored).to.not.exist;

                expect(resultKeys[0]).to.eql('underScored');


            });
            
            it(`should not create redundant attributes`, () => {

                const result = camelizeKeys({under_scored: 123});
                const resultKeys = _.keys(result);

                expect(resultKeys.length).to.eql(1);

            });

            it(`should have 'underScored' field eql to 123`, () => {

                const result = camelizeKeys({under_scored: 123});

                expect(result.underScored).to.eql(123);

            });

        });

        describe("adoptLocation", ()=> {

            const adoptLocation = getUsersInfoHelpers.adoptLocation;

            it(`have correct city & country fields`, () => {

                const result = adoptLocation(fixtures[0]);

                const expectedCity = fixtures[0].location.city;
                const expectedCountry = fixtures[0].location.countryName;

                expect(result.city).to.eql(expectedCity);
                expect(result.country).to.eql(expectedCountry);

            });

            it(`.location doesn't exist`, () => {

                const result = adoptLocation(fixtures[0]);

                expect(result.location).to.not.exist;

            });

        });

        describe("adoptGender", ()=> {

            const adoptGender = getUsersInfoHelpers.adoptGender;

            it(`male -> M`, () => {

                const result = adoptGender(fixtures[2]);

                expect(result.gender).to.eql('M');

            });

            it(`female -> F`, () => {

                const result = adoptGender(fixtures[0]);

                expect(result.gender).to.eql('F');

            });

            it(`should have other fields`, () => {

                const result = adoptGender(fixtures[0]);

                expect(result.uid).to.exist;
                expect(result.age).to.exist;
                expect(result.name).to.exist;

            });

            it(`throw if gender = 'trans'`, () => {

                const clonedFixture = _.cloneDeep(fixtures[0]);
                clonedFixture.gender = 'trans';

                expect(adoptGender.bind(null, clonedFixture)).to.throw(/unexpected gender/i);

            });

        });

        describe("getCredentialsByStr", ()=> {

            const getCredentialsByStr = getUsersInfoHelpers.getCredentialsByStr;
            const credentialsStr = 'id576;publicABA;secretA827F;tknAD4';

            it(`.applicationId`, () => {

                const result = getCredentialsByStr(credentialsStr);

                expect(result.applicationId).to.exist;
                expect(result.applicationId).to.eql('id576');

            });

            it(`.applicationKey`, () => {

                const result = getCredentialsByStr(credentialsStr);

                expect(result.applicationKey).to.exist;
                expect(result.applicationKey).to.eql('publicABA');

            });

            it(`.applicationSecretKey`, () => {

                const result = getCredentialsByStr(credentialsStr);

                expect(result.applicationSecretKey).to.exist;
                expect(result.applicationSecretKey).to.eql('secretA827F');

            });

            it(`.accessToken`, () => {

                const result = getCredentialsByStr(credentialsStr);

                expect(result.accessToken).to.exist;
                expect(result.accessToken).to.eql('tknAD4');

            });

        });

    });
});