const async = require('async');
const observer = require('./observer');

const FETCH_MEMBERS_INTERVAL = process.env.FETCH_MEMBERS_INTERVAL || 10 * 60 * 1000;


console.log('FETCH_MEMBERS_INTERVAL', FETCH_MEMBERS_INTERVAL);


console.log(`Members observer started`);


async.forever(
    (next) => {

        observer.writeNewMembersToDB()
            .then(() => {
                console.log(`Members was successfully fetched`);
                setTimeout(next, FETCH_MEMBERS_INTERVAL);
            })
            .catch((err) => {
                console.error(`Error in fetching new members:`, err);
                setTimeout(next, FETCH_MEMBERS_INTERVAL);
            });
    },
    (err) => {
        console.error(`New members fetcher exited`, err);
        process.exit(1);
    }
);
