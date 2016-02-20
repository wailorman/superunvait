import {
    RUN_POST_HUNTER, RUN_TRAGOMETR, RUN_MEMBERS_OBSERVER
} from './action-names'

import {SCRIPT_NAME_STYLE} from '../lib/logger'

import paintPosts from './modules/post-hunter/parsers/ok-ru'
import * as tragometr from './modules/tragometr'
import * as membersObserver from './modules/members-observer'

console.log(`%c content script `, SCRIPT_NAME_STYLE);

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

    $('head').append('<script src="'+chrome.extension.getURL('page_script.build.js')+'"></script>');
});
