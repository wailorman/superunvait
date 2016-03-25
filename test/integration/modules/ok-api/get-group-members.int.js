"use strict";

describe("OK API / get group members", ()=> {


    describe("getLastMembersUids", ()=> {

        //should write 1 member
        //should write 100 members
        //should write 101 members with 2 requests
        //should write 201 members with three requests
        //should not write anything if members amount = 0
        //
        //should request twice if first response return only half
        //should calm down on second request if requested 100, but there are only 50

    });


});