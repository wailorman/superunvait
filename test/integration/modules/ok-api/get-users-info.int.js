"use strict";

const nock = require('nock');

const fixtures = require('../../../fixtures/users.getInfo.json');

const models = require('../../../../models/index');
const sequelize = models.sequelize;
const User = models.user;

const okApiHelpers = require('../../../../src/modules/ok-api/helpers');
const getUsersInfo = require('../../../../src/modules/ok-api/get-users-info');
const signatureCalculator = require('../../../../src/modules/ok-api/signature-calculator');

const credentials = okApiHelpers.getCredentialsByStr(process.env.OK_CREDENTIALS);

describe("ok api / get users info", ()=> {

    const cleanDB = ()=> {
        return sequelize.sync({force: true});
    };

    before(cleanDB);

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

        const getUsersInfoFromOK = getUsersInfo.getUsersInfoFromOK;

        it(`should make correct request`, () => {

            const query = {
                method: "users.getInfo",
                fields: "uid,name,age,allows_anonym_access,allows_messaging_only_for_friends,birthday,gender,last_online,location,photo_id,has_service_invisible,private",
                uids: "558123591415"
            };

            const expectedQuery = signatureCalculator._generateQueryObjectWithSig(query, credentials);

            const usersGetInfoMock = nock('http://api.odnoklassniki.ru')
                .get('/fb.do')
                .query(expectedQuery)
                .reply(200, [fixtures[0]]);

            return getUsersInfoFromOK(['558123591415'])
                .then((result)=> {
                    expect(result[0].uid).to.eql(fixtures[0].uid);
                    expect(result[0].name).to.eql(fixtures[0].name);

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

    describe("bulkUpsert", ()=> {

        beforeEach(cleanDB);

        it(`should bulk write to DB`, () => {

            const dataArray = [
                {uid: '1234'},
                {uid: '5678'}
            ];

            return getUsersInfo.bulkUpsert(User, dataArray, true)
                .then(()=> {
                    return User.find({where: {uid: '1234'}});
                })
                .then((res1)=> {
                    expect(res1.uid).to.eql('1234');
                    return User.find({where: {uid: '5678'}});
                })
                .then((res2)=> {
                    expect(res2.uid).to.eql('5678');
                });

        });

    });

    describe("saveUsersInfo", ()=> {

        const saveUsersInfo = getUsersInfo.saveUsersInfo;

        beforeEach(cleanDB);

        it(`should write user data to db`, () => {

            const query = {
                method: "users.getInfo",
                fields: "uid,name,age,allows_anonym_access,allows_messaging_only_for_friends,birthday,gender,last_online,location,photo_id,has_service_invisible,private",
                uids: "558123591415,571769013138"
            };

            const expectedQuery = signatureCalculator._generateQueryObjectWithSig(query, credentials);

            const usersGetInfoMock = nock('http://api.odnoklassniki.ru')
                .get('/fb.do')
                .query(expectedQuery)
                .reply(200, [fixtures[0], fixtures[1]]);

            return saveUsersInfo([fixtures[0].uid, fixtures[1].uid])
                .then(()=> {
                    expect(usersGetInfoMock.isDone()).to.eql(true);

                    return Q.all([
                        User.find({
                            where: {
                                uid: fixtures[0].uid
                            }
                        }),
                        User.find({
                            where: {
                                uid: fixtures[1].uid
                            }
                        })
                    ]);

                })
                .then((res)=> {

                    expect(res[0].uid).to.eql(fixtures[0].uid);
                    expect(res[1].uid).to.eql(fixtures[1].uid);

                });

        });

    });

});

