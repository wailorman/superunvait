import {SCRIPT_NAME_STYLE} from '../lib/logger'
import initLoader from '../lib/page-script-loader/page-script-loader'
import * as inviter from './modules/inviter/inviter'
import * as auctionClicker from './modules/auction-clicker'

console.log(`%c page script `, SCRIPT_NAME_STYLE);

let loadInterfaces = [
    {
        matchUrl(url) {
            logger.log(__filename, `matching ${url} url`);
            return true;
        },
        onPageVisited(url) {
            logger.log(__filename, `ON PAGE VISITED: ${url}`);
        },
        onPageLeft(url) {
            logger.log(__filename, `ON PAGE LEFT ${url}`);
        }
    },
    inviter.loadInterface,
    auctionClicker.loadInterface
];

initLoader(loadInterfaces);