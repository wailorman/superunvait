const request = require('request');
const cheerio = require("cheerio");
const async = require('async');

const PARALLEL_HTTP_REQUESTS = process.env.PARALLEL_HTTP_REQUESTS || 3;

const fetchHtmlUserData = (uid) => {

    return new Promise((resolve, reject) => {

        const reqParams = {
            url: `https://ok.ru/profile/${uid}`,
            timeout: 30 * 1000
        };

        request(reqParams, (err, res, body) => {

            if (err) return reject(err);

            const $ = cheerio.load(body);

            let data = [];

            $('a.mctc_navMenuSec').each((i, elem) => {
                data.push((  $(elem).text().match(/\d+/g) || [] ).join('') || null);
            });

            const numberifyString = (str) => {
                const res = +str;
                if (res) {
                    return res;
                } else if (res === 0) {
                    return 0;
                } else {
                    return null;
                }
            };

            const userInfo = {
                uid: uid,
                friends:    numberifyString( data[1] ),
                photos:     numberifyString( data[2] ),
                groups:     numberifyString( data[3] ),
                games:      numberifyString( data[4] ),
                notes:      numberifyString( data[5] )
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
            PARALLEL_HTTP_REQUESTS,
            (uid, callback) => {
                fetchHtmlUserData(uid)
                    .then((res) => {

                        counter++;
                        console.log(
                            JSON.stringify(counter),
                            '\t',
                            res.uid,
                            '\t',
                            res.friends,
                            res.photos,
                            res.groups,
                            res.games,
                            res.notes
                        );

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