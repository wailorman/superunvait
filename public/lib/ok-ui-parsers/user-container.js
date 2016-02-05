import '../../vendor/jquery-comments'

export function getUserInfoByHisContainer(userContainerElem) {

    return JSON.parse(userContainerElem.find('.hookData').comments().html());

}

export function getUserAvatarByHisContainer(userContainer) {
    let userAvatar = userContainer.find('img');
    if (userAvatar.length == 0) {
        userAvatar = userContainer.find(".onbigavcont");
    }

    return userAvatar;
}