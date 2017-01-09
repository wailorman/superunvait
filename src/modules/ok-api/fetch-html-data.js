const request = require('request');
const cheerio = require("cheerio");
const async = require('async');

const fetchHtmlUserData = (uid) => {

    return new Promise((resolve, reject) => {

        request(`https://ok.ru/profile/${uid}`, (err, res, body) => {

            if (err) return reject(err);

            const $ = cheerio.load(body);

            let data = [];

            $('a.mctc_navMenuSec').each((i, elem) => {
                data.push(( $(elem).text().match(/\d+/) || ['0'] )[0]);
                // console.log( $(elem).text(), ' - ', ( $(elem).text().match(/\d+/) || ['0'] )[0] )
            });

            const userInfo = {
                uid: uid,
                friends: data[1],
                photos: data[2],
                groups: data[3],
                games: data[4],
                notes: data[5]
            };

            /*
             * друзья 1
             * фото 2
             * группы 3
             * игры 4
             * заметки 5
             *
             * */

            // debugger;

            return resolve(userInfo);
        });

    });

};

const multipleFetchHtmlUserData = async (uidsArray) => {

    let counter = 0;

    return new Promise((resolve, reject) => {

        async.mapLimit(
            uidsArray,
            5,
            (uid, callback) => {
                fetchHtmlUserData(uid)
                    .then((res) => {

                        counter++;
                        console.log(counter);

                        callback(null, res);
                    })
                    .catch((err) => {
                        callback(err);
                    })
            },
            (err, results) => {
                if (err) return reject(err);
                return resolve(results);
            }
        );

    });

};

module.exports = {
    fetchHtmlUserData,
    multipleFetchHtmlUserData
};