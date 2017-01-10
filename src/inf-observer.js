require('babel-core/register');
require('babel-polyfill');


const async = require('async');
const observer = require('./observer');

async.forever(
    function(next) {

        console.log('\t', new Date().toString(), '\t');

        observer.writeInfoAboutUnfilledUsers()
            .then(() => {
                console.log(`Users was successfully filled`);

                setTimeout(() => {

                    next();

                }, 30 * 1000);
            })
            .catch((err) => {
                console.error(`Error in filling users: `, err);
                next(err);
            });

    },
    function(err) {
        console.error(err);
    }
);


async.forever(
    function(next) {

        console.log('\t', new Date().toString(), '\t');

        observer.writeNewMembersToDB()
            .then(() => {
                console.log(`Members was successfully fetched`);

                setTimeout(() => {

                    next();

                }, 10 * 60 * 1000);

            })
            .catch((err) => {
                console.error(`Error in fetching members: `, err);
                next(err);
            });
    },
    function(err) {
        console.error(err);
    }
);