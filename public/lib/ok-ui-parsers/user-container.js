import '../../vendor/jquery-comments'

export function getUserInfoByHisContainer(userContainerElem) {

    return JSON.parse(userContainerElem.find('.hookData').comments().html());

}

export function getUserAvatarByHisContainer(userContainer) {
    let userAvatar = userContainer.find('img');
    if (userAvatar.length == 0) {
        userAvatar = userContainer.find(".onbigavcont");
    }

    userAvatar.invitingApi = {

        paintAs: {

            invited() {
                userAvatar.css({border: "solid 10px blue"});
            },

            notReceivingInvites() {
                userAvatar.css({border: "solid 10px red"});
            },

            tooMuchInvites() {
                userAvatar.css({border: "solid 10px black"});
            }

        }

    };

    return userAvatar;
}