import * as ibbApi from '../ibb-api/ibb-api'

export const INVITING_RESULT = {
    SUCCESS: 'SUCCESS',
    NOT_RECEIVING: 'NOT_RECEIVING',
    TOO_OFTEN: 'TOO_OFTEN',
    UNEXPECTED_RESPONSE: 'UNEXPECTED_RESPONSE',
    ALREADY_INVITED: 'ALREADY_INVITED'
};

export const invites = {

    getResultOfInvitation(data) {

        let resultOfInvitation;

        if (!data)
            resultOfInvitation = INVITING_RESULT.TOO_OFTEN;
        else if (data.indexOf('не принимает приглашения в группы') > -1)
            resultOfInvitation = INVITING_RESULT.NOT_RECEIVING;
        else if (data.indexOf('отправлено') > -1)
            resultOfInvitation = INVITING_RESULT.SUCCESS;

        return resultOfInvitation;

    },

    checkPersistentInInvitees(userId){

        return ibbApi.invites.find({userId})
            .then((results)=> {
                return results.invites.length > 0; // if >0 -- user was already invited
            })
            .catch((err)=> {
                console.error(err);
                return err;
            });

    },

    send(userId, gwtHash, token, checkIsAlreadyInvited) {
        const deferred = Q.defer();

        if (checkIsAlreadyInvited) {
            this.checkPersistentInInvitees(userId)
                .then((wasUserAlreadyInvited)=> {
                    if (!wasUserAlreadyInvited) {
                        sendInviteToOk();
                    } else {
                        deferred.reject(INVITING_RESULT.ALREADY_INVITED);
                    }
                });
        } else {
            sendInviteToOk();
        }

        const sendInviteToOk = ()=> {
            $.ajax({
                    url: 'https://ok.ru/online?cmd=PopLayer&st.cmd=userFriendLive&st.layer.cmd=InviteUserToGroup2&st.layer.friendId=' + userId + '&st.layer.groupId=53396058603765&st.vpl.mini=false&st.layer._bh=596&st.layer._bw=1920&gwt.requested=' + gwtHash + '&p_sId=759701885561766480',
                    data: {
                        'gwt.requested': gwtHash,
                        'st.layer.posted': 'set',
                        'selid': '53396058603765',
                        'button_invite': 'clickOverGWT'
                    },
                    type: "POST",
                    beforeSend: xhr => {
                        xhr.setRequestHeader('TKN', token);
                    }
                })
                .success((data)=> {

                    let invitationResult = this.getResultOfInvitation(data);

                    switch (invitationResult) {
                        case INVITING_RESULT.TOO_OFTEN:
                        case INVITING_RESULT.NOT_RECEIVING:
                            deferred.resolve(invitationResult);
                            break;

                        case INVITING_RESULT.SUCCESS:
                            deferred.resolve(invitationResult);
                            break;

                        default:
                            console.log(new Error(`Unexpected invitation result: ${data}`));
                            deferred.reject(INVITING_RESULT.UNEXPECTED_RESPONSE);
                            break;
                    }

                })
                .fail((err)=> {
                    console.log(err);
                    deferred.reject(INVITING_RESULT.UNEXPECTED_RESPONSE, err);
                });
        };


        return deferred.promise;
    }

};