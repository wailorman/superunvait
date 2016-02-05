export const invites = {

    send(userId, gwtHash, token) {

        return $.ajax({
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
        });

    }

};