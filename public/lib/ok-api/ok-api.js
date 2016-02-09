export const INVITING_RESULT = {
    SUCCESS: 'SUCCESS',
        NOT_RECEIVING: 'NOT_RECEIVING',
        TOO_OFTEN: 'TOO_OFTEN',
        UNEXPECTED_RESPONSE: 'UNEXPECTED_RESPONSE'
};

export const invites = {

    getResultOfInvitation(data) {

        let resultOfInvitation;

        if (data.indexOf('слишком часто') > -1)
            resultOfInvitation = INVITING_RESULT.TOO_OFTEN;
        else if (data.indexOf('не принимает приглашения') > -1)
            resultOfInvitation = INVITING_RESULT.NOT_RECEIVING;
        else
            resultOfInvitation = INVITING_RESULT.SUCCESS;

        return resultOfInvitation;

    },

    send(userId, gwtHash, token) {
        const deferred = Q.defer();

        $.ajax({
            url: 'http://ok.ru/dk?st.cmd=userFriendLive&cmd=InviteUserToGroups&st.layer.cmd=InviteUserToGroupsOuter&st.layer.friendId=' + userId + '&gwt.requested=' + gwtHash + '&p_sId=0',
            data: {
                'gwt.requested': pageCtx.gwtHash,
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
                        deferred.reject(invitationResult);
                        break;

                    case INVITING_RESULT.SUCCESS:
                        deferred.resolve(data);
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

        return deferred.promise;
    }

};