import {
    RUN_POST_HUNTER, RUN_TRAGOMETR, RUN_MEMBERS_OBSERVER
} from './action-names'


import paintPosts from './post-hunter/parsers/ok-ru'
import * as tragometr from './tragometr/tragometr'
import * as membersObserver from './members-observer/members-observer'

console.log(`content_script`);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    const action = message.action;
    if (action == RUN_POST_HUNTER) {
        paintPosts();
    } else if (action == RUN_TRAGOMETR && tragometr.matchUrl()) {
        tragometr.assignTragocentsToPosts();
    } else if (action == RUN_MEMBERS_OBSERVER) {
        membersObserver.membersObserver.startObserving();
    }
});

$(document).ready(function(){

    const pageIs = {
        online: document.location.href.indexOf('ok.ru/online') > -1,
        statTopics: document.location.href.indexOf('ok.ru/institutebb/stat/topics') > -1,
        auctions: document.location.href.indexOf('ok.ru/auctions') > -1
    };

    if (pageIs.online) {
		$('head').append('<script src="'+chrome.extension.getURL('inviter.build.js')+'"></script>');
    } else if (pageIs.auctions) {
        $('head').append('<script src="'+chrome.extension.getURL('auction_clicker.build.js')+'"></script>');
    }
});
