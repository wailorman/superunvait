"use strict";

const _ = require('lodash');

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

const collectionToPlainArray = function (membersCollection, fieldToPick) {

    return _
        .chain(membersCollection)
        .map((memberObject)=> {
            return _.get(memberObject, fieldToPick, null);
        })
        .compact() // remove all `null`s
        .value();

};

module.exports = {collectionToPlainArray, resultCodes};