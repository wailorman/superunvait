import { assignThisScriptToUrl } from '../../lib/spa-url-observer'

const MODULE_NAME = 'auction clicker';
const REFRESH_BUTTON = '.auction_infoPanel .button-pro';
let clickingInterval = null;

export function startClicking() {

    clickingInterval = setInterval(()=> {
        $(REFRESH_BUTTON).click();
        logger.log(__filename, `click!`);
    }, 200);

}

export const loadInterface = {
    matchUrl(url){
        return url.indexOf('/auctions') > -1;
    },
    onPageVisited(){
        logger.log(__filename, 'target page visited');
        startClicking();
    },
    onPageLeft(){
        logger.log(__filename, 'target page left');
        clearInterval(clickingInterval);
    }
};