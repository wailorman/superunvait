"use strict";

const _ = require('lodash');
const Q = require('q');
const async = require('async');
const okApi = require('./ok-api-facade');

/*

getLastMembersUids ( groupId, count=100 )

    let usersRemaining = count (clone)

    let lastAnchor,
        members = [];

    func stop(){   usersRemaining = 0   }

    func decreaseUsersCounter(amount) { ... }

    func addNewMembers(arr) { ... }
    func updateAnchor(newAnchor) { ... }


    async.whilst
        ()=> usersRemaining > 0

        ( errorHappened, next )=>{

            usersToGet = usersRemaining >= 100 ? 100 : usersRemaining

            doMembersGetRequest( groupId, usersToGet, lastAnchor )
                .THEN ( result{ members, anchor } ) {

                    if (enough members){
                        decreaseUsersCounter(members.length);
                        addNewMembers(members);
                    }else{
                        stop();
                    }

                    updateAnchor(anchor);

                    next();

                }
                .CATCH {
                    errorHappened()
                }
        }
        (err, res)=>{ ... }



verifyMembers ( membersUidsArray )
    array normal, filled -> resolve ( success ) -->> next plz
    array empty -> resolve ( NO_MEMBERS_ANY_MORE )
    array == undefined -> reject ( ARRAY_MISSING )



verifyAnchor ( anchor )
    anchor normal -> resolve( success )
    no anchor -> reject( ANCHOR_MISSING )



doMembersGetRequest ( groupId, [count=100], [lastAnchor] )

    return >
    okApi.get
        method: group.getMembers    <- constant
        uid: groupId  <-
        count  <-
        anchor  <-  lastAnchor
        .THEN (result)
            <- return parseResponse(result)

validateResponse ( response )
    try
        verifyMembers( response.members )
        verifyAnchor( response.anchor )
        return true;
    catch (e)
        throw e;
        return false

parseResponse ( response )
    // response: { members[ {userId} ], anchor }

    result = members.map { (memberObj)
        return memberObj.userId
    }
    >>> result now [ uid, uid, uid ]

    return format: { membersUids[], anchor }

    return result;

*/

const SUCCESS = true;
const NO_MEMBERS_ANY_MORE = -1;

const resultCodes = {SUCCESS, NO_MEMBERS_ANY_MORE};


//getLastMembersUids ( groupId, count=Infinity )
const getLastMembersUids = function (groupId, count) {
    let deferred = Q.defer();

    count = count || Infinity;

    let usersRemaining = _.clone(count);


    let lastAnchor,
        members = [];

    //func stop(){   usersRemaining = 0   }
    const stop = function () {
        usersRemaining = 0;
    };


    //func decreaseUsersCounter(amount) { ... }
    const decreaseUsersCounter = function (amount) {
        usersRemaining = usersRemaining - amount;
    };

    //func addNewMembers(arr) { ... }
    const addNewMembers = function (newMembersArray) {
        members = _.concat(members, newMembersArray);
    };

    //func updateAnchor(newAnchor) { ... }
    const updateAnchor = function (newAnchor) {
        lastAnchor = newAnchor;
    };


    async.whilst(
        ()=> usersRemaining > 0,

        (next)=> {

            const usersToGet = usersRemaining >= 100 ? 100 : usersRemaining;

            doMembersGetRequest(groupId, usersToGet, lastAnchor)
                .then((res)=> {

                    const members = res.members; // .length == usersToGet
                    const anchor = res.anchor;
                    const has_more = res.has_more;

                    if (members.length > 0) {
                        decreaseUsersCounter(members.length);
                        addNewMembers(_.take(members, usersToGet));
                    } else {
                        stop();
                    }

                    if (has_more === false) {
                        stop();
                    }


                    updateAnchor(anchor);

                    next();

                })
                .catch((err)=> {
                    next(err);
                });

        },

        (err)=> {
            if (err) deferred.reject(err);
            else deferred.resolve(members);
        }
    );


    return deferred.promise;
};


////////////////////////////////////////////////////////////////////////////////////////


const collectionToPlainArray = function (membersCollection, fieldToPick) {

    return _
        .chain(membersCollection)
        .map((memberObject)=> {
            return _.get(memberObject, fieldToPick, null);
        })
        .compact() // remove all `null`s
        .value();

};

const convertResponse = function (payload) {

    const result = _.cloneDeep(payload);

    result.members = collectionToPlainArray(payload.members, 'userId');

    return result;

};

const doMembersGetRequest = function (groupId, count, lastAnchor) {

    count = count || 100;

    return okApi.get({
            method: 'group.getMembers', count: count, uid: groupId, anchor: lastAnchor
        })
        .then((response)=> {
            return convertResponse(response);
        });
};

module.exports = {
    getLastMembersUids,
    doMembersGetRequest,
    convertResponse,
    collectionToPlainArray,
    resultCodes
};