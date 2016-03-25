"use strict";

describe("OK API / get group members", ()=> {

    describe("parseResponse", ()=> {

        // should convert members to flat array
        // should append anchor to result

        // no members field -> throw MEMBERS_MISSING
        // members array if empty -> members:[]
        // anchor didn't resolved -> throw ANCHOR_MISSING
        // in some of objects disappeared userId field

        // should remove members duplicates

    });

    describe("verifyMembers", ()=> {

        // SUCCESS if all goes normal
        // NO_MEMBERS_ANY_MORE if members array is empty
        // throw INVALID_USER_OBJECT if some of users aren't correct
        // throw ARRAY_MISSING if members array isn't defined

    });

    describe("verifyAnchor", ()=> {

        // SUCCESS if anchor="abc123"
        // throw ANCHOR_MISSING if anchor=""
        // throw ANCHOR_MISSING if anchor=null

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