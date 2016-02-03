import {
    RUN_POST_HUNTER, RUN_TRAGOMETR
} from './action-names'


import paintPosts from './post-hunter/parsers/ok-ru'
import assignTragocentsToPosts from './tragometr/tragometr'

console.log(`content_script`);

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    const action = message.action;
    if (action == RUN_POST_HUNTER) {
        paintPosts();
    } else if (action == RUN_TRAGOMETR) {
        assignTragocentsToPosts();
    }
});

$(document).ready(function(){

    const pageIs = {
        online: document.location.href.indexOf('ok.ru/online') > -1,
        statTopics: document.location.href.indexOf('ok.ru/institutebb/stat/topics') > -1
    };

    if (pageIs.online) {
		$('head').append('<script src="'+chrome.extension.getURL('inviter.build.js')+'"></script>');
    }
});
