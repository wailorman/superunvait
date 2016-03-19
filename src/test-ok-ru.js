const pullUsersData = require('./modules/ok-api/get-users-info');
const nock = require('nock');

//nock('http://api.odnoklassniki.ru')
//    .filteringPath(()=>'/fb.do')
//    .get('/fb.do')
//    .reply(200, 'OK');

pullUsersData.pullUsersInfo(['571769013138, 558123591415']);

/*
uid
name
age
allows_anonym_access
allows_messaging_only_for_friends
birthday
gender
last_online
location.city = city
location.countryName = country
photo_id
has_service_invisible
private

uid
name
age
allows_anonym_access
allows_messaging_only_for_friends
birthday
gender
last_online
location.city
location.countryName
photo_id
has_service_invisible
private

*/