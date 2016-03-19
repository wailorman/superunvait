"use strict";

const models = require('../../../../models/index');
const sequelize = models.sequelize;
const User = models.user;

describe("ok api / get users info", ()=> {

    before(()=> {
        return sequelize.sync({force: true});
    });

    it(`test`, () => {
        console.log(`from test!s`);
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

});

