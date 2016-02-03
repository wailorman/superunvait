if (chrome.tabs) {
    console.log(`tabs api was found`);
    chrome.tabs.onUpdated.addListener((tabId, data, tab)=> {


        console.log(`its a ibb tools background script (under listener)`);

        const shouldDisplayPageActionButton = tab.url.indexOf('//ok.ru/') > -1;

        if (shouldDisplayPageActionButton) {
            chrome.pageAction.show(tabId);
        }

    });
}else{
    console.error(`tabs api wasn't found`);
}

console.log(`its a ibb tools background script`);