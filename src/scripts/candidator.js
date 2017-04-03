require('babel-core/register');
require('babel-polyfill');


const async = require('async');
const observer = require('./observer');

const FETCH_CANDIDATES_INTERVAL = process.env.FETCH_CANDIDATES_INTERVAL || 10 * 1000;

console.log('FETCH_CANDIDATES_INTERVAL', FETCH_CANDIDATES_INTERVAL);


console.log(`Scrapper started`);


async.forever(
    (next) => {

        console.log(`Begin fetching new candidates ...`);

        observer.writeNewCandidates()
            .then(() => {
                console.log(`New candidates from friends successfully fetched`);
                setTimeout(next, FETCH_CANDIDATES_INTERVAL);
            })
            .catch((err) => {
                console.error(`Error in fetching new candidates from friends:`, err);
                setTimeout(next, FETCH_CANDIDATES_INTERVAL);
            });

    },
    (err) => {
        console.error(`Candidate fetcher exited`, err);
        process.exit(1);
    }
);
