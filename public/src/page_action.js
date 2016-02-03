$('#start-post-hunter').click(()=> {

    console.log('clicked in page action');
    chrome.tabs.query(
        {active: true, currentWindow: true},
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "text"}, function (response) {
                //If you need a response, do stuff with it here
            });
        });

});