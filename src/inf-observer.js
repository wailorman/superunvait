require('babel-core/register');
require('babel-polyfill');


const async = require('async');
const observer = require('./observer');

const format = require('date-fns/format');


// const FETCH_UNFILLED_INTERVAL = 30 * 1000;
const FETCH_UNFILLED_INTERVAL = 0;
const FETCH_FRESH_INTERVAL = 60 * 1000;
const FETCH_MEMBERS_INTERVAL = 10 * 60 * 1000;


console.log(
    format(new Date(), 'DD MMM YYYY  HH:mm'),
    `Users observer started`
);

async.forever(
    function(next) {

        // console.log(format(new Date(), 'DD MMM YYYY  HH:mm'));

        observer.writeInfoAboutUnfilledUsers()
            .then((newUserIds) => {
                // console.log(`Users was successfully filled`);

                newUserIds.map((uid) => {
                    console.log(
                        format(new Date(), 'DD MMM YYYY  HH:mm'),
                        'New user:',
                        uid
                    );
                });

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
    }
);




// async.forever(
//     function(next) {
//
//         // console.log('\t', new Date().toString(), '\t');
//
//         observer.writeFreshUsersInfo()
//             .then(() => {
//                 // console.log(`Users was successfully refreshed`);
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
//     }
// );
//
//
//
//
// async.forever(
//     function(next) {
//
//         // console.log('\t', new Date().toString(), '\t');
//
//         observer.writeNewMembersToDB()
//             .then(() => {
//
//                 // console.log(`Members was successfully fetched`);
//
//                 setTimeout(() => {
//
//                     next();
//
//                 }, FETCH_MEMBERS_INTERVAL);
//
//             })
//             .catch((err) => {
//                 next(err);
//             });
//     },
//     function(err) {
//         console.error(`Error in fetching members: `, err);
//     }
// );