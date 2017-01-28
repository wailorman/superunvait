require('babel-core/register');
require('babel-polyfill');


const async = require('async');
const observer = require('./observer');

const format = require('date-fns/format');


const FETCH_UNFILLED_INTERVAL = 10 * 1000;
const FETCH_FRESH_INTERVAL = 60 * 1000;
const FETCH_MEMBERS_INTERVAL = 10 * 60 * 1000;
const FETCH_CANDIDATES_INTERVAL = 0;


console.log(
    `Users observer started`
);

async.forever(
    function(next) {

        // console.log(format(new Date(), 'DD MMM YYYY  HH:mm'));

        observer.writeInfoAboutUnfilledUsers()
            .then((newUserIds) => {
                console.log(
                    `Users was successfully filled`
                );

                setTimeout(() => {

                    next();

                }, FETCH_UNFILLED_INTERVAL);
            })
            .catch((err) => {
                next(err);
            });

    },
    function(err) {
        console.error(`Error in filling users: `, err);
        process.exit(1);
    }
);


async.forever(
    function(next) {

        observer.writeNewCandidates()
            .then(() => {

                console.log(
                    `New candidates from friends successfully fetched`
                );

                setTimeout(() => {

                    next();

                }, FETCH_CANDIDATES_INTERVAL);
            })
            .catch((err) => {
                next(err);
            });

    },
    function(err) {
        console.error(`Error in fetching new candidates from friends: `, err);
        process.exit(1);
    }
);


// async.forever(
//     function(next) {
//
//         // console.log('\t', new Date().toString(), '\t');
//
//         observer.writeFreshUsersInfo()
//             .then(() => {
//
//                 console.log(
//                     format(new Date(), 'DD MMM YYYY  HH:mm'),
//                     `Users was successfully refreshed`
//                 );
//
//                 setTimeout(() => {
//
//                     next();
//
//                 }, FETCH_FRESH_INTERVAL);
//             })
//             .catch((err) => {
//                 next(err);
//             });
//
//     },
//     function(err) {
//         console.error(`Error in refreshing users: `, err);
//         process.exit(1);
//     }
// );




async.forever(
    function(next) {

        // console.log('\t', new Date().toString(), '\t');

        observer.writeNewMembersToDB()
            .then(() => {

                console.log(
                    format(new Date(), 'DD MMM YYYY  HH:mm'),
                    `Members was successfully fetched`
                );

                setTimeout(() => {

                    next();

                }, FETCH_MEMBERS_INTERVAL);

            })
            .catch((err) => {
                next(err);
            });
    },
    function(err) {
        console.error(`Error in fetching members: `, err);
        process.exit(1);
    }
);