import { RUN_POST_HUNTER, RUN_TRAGOMETR } from './action-names'

export function runPostHunter() {

    chrome.tabs.query(
        {active: true, currentWindow: true},
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: RUN_POST_HUNTER}, function (response) {
                //If you need a response, do stuff with it here
            });
        }
    );

}

export function runTragometr() {

    chrome.tabs.query(
        {active: true, currentWindow: true},
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: RUN_TRAGOMETR}, function (response) {
                //If you need a response, do stuff with it here
            });
        }
    );

}