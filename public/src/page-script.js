import initLoader from '../lib/page-script-loader/page-script-loader'
import * as inviter from './inviter/inviter'

console.log(`src page script loader`);

let loadInterfaces = [
    {
        matchUrl(url) {
            console.log(`matching ${url} url`);
            return true;
        },
        onPageVisited(url) {
            console.log(`ON PAGE VISITED: ${url}`);
        },
        onPageLeft(url) {
            console.log(`ON PAGE LEFT ${url}`);
        }
    },
    inviter.loadInterface
];

initLoader(loadInterfaces);