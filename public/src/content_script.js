import paintPosts from './post-hunter/parsers/ok-ru'

console.log(`content_script`);

chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    console.log(`clicked!`);
    paintPosts();
});

$(document).ready(function(){
	if(document.location.href.indexOf('ok.ru/online')>-1){
		$('head').append('<script src="'+chrome.extension.getURL('page_script.build.js')+'"></script>');
	}
});
