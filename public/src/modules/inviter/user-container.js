import '../../../vendor/jquery-comments'

export const USER_CONTAINER = 'div.photoWrapper';

export class UserContainer {

    static getUserAvatarByContainer(userContainer){
        let userAvatar = $($(userContainer).find('img')[0]);
        if (!userAvatar) {
            userAvatar = $($(userContainer).find(".onbigavcont")[0]);
        }
        return userAvatar;
    }

    constructor(userContainerElem) {

        if (!userContainerElem) console.error(`userContainerElem argument should be passed`);

        this.jqElem = $(userContainerElem);
        this.avatar = UserContainer.getUserAvatarByContainer(userContainerElem);
    }

    paintIn(color, borderWidth = '10px') {
        $(this.avatar).css({border: `solid ${borderWidth} ${color}`});
    }

    isStub() {
        return this.jqElem.find('.stub-img').length > 0;
    }

    removeFromDOM() {
        return this.jqElem.remove();
    }

    getUserInfo() {

        return JSON.parse(this.jqElem.find('.hookData').comments().html());

    }

    scrollTo() {
        $(window).scrollTop($(this.jqElem).offset().top - 150);
    }

}