import initLoader from '../lib/page-script-loader/page-script-loader'

console.log(`src page script loader`);

let loadInterface = {
    matchUrl(url) {
        console.log(`matching ${url} url`);
        return true;
    },
    onPageVisited(pageVisitedCb) {
        console.log(`ON PAGE VISITED`);
    },
    onPageLeft(pageLeftCb) {
        console.log(`ON PAGE LEFT`);
    }
};

initLoader([loadInterface]);