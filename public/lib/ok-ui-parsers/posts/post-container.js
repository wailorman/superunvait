const POSTS_SELECTOR = ".feed.h-mod:not([data-module='LogSeen'])";

class PostContainer {

    // ".feed.h-mod:not([data-module='LogSeen'])"

    static comments (postJqElem) {

        return $(postJqElem)
                .find("li.widget-list_i")
                .find("span[data-module='CommentWidgets']")
                .find('.js-count')
                .html()
                .match(/\d+/g)
                .join('') || null

    }

    static shares (postJqElem) {

        return (

            $(postJqElem)
                .find("li.widget-list_i")
                .find("button[data-module='LikeComponent']").eq(0)
                .find('.widget_count')
                .html()
                .match(/\d+/g)
                .join('') || null

        );

    }

    static likes (postJqElem) {

        return (

            $(postJqElem)
                .find("li.widget-list_i")
                .find("button[data-module='LikeComponent']").eq(1)
                .find('.widget_count')
                .html()
                .match(/\d+/g)
                .join('') || null

        );

    }

    static findAll (html) {

        return $(html).find(POSTS_SELECTOR);

    }

    static findById (html) {



    }

    constructor (jqElem) {

        this.jqElem = $(jqElem);

    }

    getInfo () {

        const feedCnt = $(this.jqElem).find("div.feed_cnt").attr('data-l').split(',');

        const topicId = feedCnt[1];
        const groupId = feedCnt[3];

    }

}


export {
    PostContainer
};

export default PostContainer