"use strict";

const okApi = require('../../../../src/modules/ok-api/ok-api-facade');

describe("ok api facade", ()=> {

    it(`should pull some user info`, () => {

        let requestParameters = {
            method: 'users.getInfo',
            uids: '571769013138',
            fields: '*'
        };

        return okApi.get(requestParameters)
            .then((data)=> {
                expect(data[0].uid).to.eql('571769013138');
            });

    });

});