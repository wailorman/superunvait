
$(document).ready(function(){
	if(document.location.href.indexOf('ok.ru/online')>-1){
		$('head').append('<script src="'+chrome.extension.getURL('pagescript.js')+'"></script>');
	}
});
