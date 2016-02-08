import { assignScriptToUrl } from '../../lib/spa-url-observer'

const REFRESH_BUTTON = '.auction_infoPanel .button-pro';

export function startClicking() {

    setInterval(()=> {
        $(REFRESH_BUTTON).click();
        console.log(`auction click`);
    }, 200);

}

const topicsStat = '/auctions';
export const matchUrl = ()=> {
    return document.location.href.indexOf(topicsStat) > -1;
};

//////////////
// WILL RUN WHEN SCRIPT WILL BE LOADED

assignScriptToUrl(/\/auctions(\/)?$/gm).onVisit(startClicking);

//////////////