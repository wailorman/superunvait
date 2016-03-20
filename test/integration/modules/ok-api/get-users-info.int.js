"use strict";

const nock = require('nock');

const models = require('../../../../models/index');
const sequelize = models.sequelize;
const User = models.user;

const okApiHelpers = require('../../../../src/modules/ok-api/helpers');
const getUsersInfo = require('../../../../src/modules/ok-api/get-users-info');
const signatureCalculator = require('../../../../src/modules/ok-api/signature-calculator');

describe("ok api / get users info", ()=> {

    before(()=> {
        return sequelize.sync({force: true});
    });

    describe("Users", ()=> {

        it(`should insert record`, () => {

            return User.create({uid: "123456"})
                .then((result)=> {
                    return User.find({uid: '123456'});
                })
                .then((user)=> {
                    expect(user.uid).to.eql('123456');
                });

        });

    });

    describe("getUsersInfoFromOK", ()=> {

        const credentials = okApiHelpers.getCredentialsByStr(process.env.OK_CREDENTIALS);

        const getUsersInfoFromOK = getUsersInfo.getUsersInfoFromOK;

        it(`should make correct request`, () => {

            let query = {
                method: "users.getInfo",
                fields: "uid,name,age,allows_anonym_access,allows_messaging_only_for_friends,birthday,gender,last_online,location,photo_id,has_service_invisible,private",
                uids: "123",

                application_key: credentials.applicationKey
            };

            query.sig = signatureCalculator.calculateSignature(query,  credentials);
            query.access_token = credentials.accessToken;

            const usersGetInfoMock = nock('http://api.odnoklassniki.ru')
                .get('/fb.do')
                .query(query)
                .reply(200, 'OK');

            return getUsersInfoFromOK(['123'])
                .then((result)=> {
                    debugger;
                    expect(usersGetInfoMock.isDone()).to.eql(true);
                });

            /*
             * /fb.do?
             * access_token=tkn1oo5SIydA3IenjcH5b0______MrPCC0DT0MiUbVDvD4&
             * application_key=CBAG______ABABA&
             * fields=uid,name,age,allows_anonym_access,allows_messaging_only_for_friends,birthday,gender,last_online,location,photo_id,has_service_invisible,private&
             * method=users.getInfo&
             * sig=def3f8______eb12a4e73568b8a67c&
             * uids=123&
             *
             * */

        });

    });


});

