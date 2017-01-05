import '../../vendor/jquery-put-delete'
import { serialize } from '../url-query-serialize'

//export let API_URL = 'http://localhost:8050';
export let API_URL = 'https://ibb-api.herokuapp.com';
const INVITES_RESOURCE_URL = `${API_URL}/invites`;

export const invites = {

    tell(userId, city, senderId) {

        return $.post(INVITES_RESOURCE_URL, {
            invite: {
                userId: userId,
                city: city,
                senderId: senderId
            }
        }, {dataType: 'json'});

    },

    find(query) {

        return Q($.get(`${INVITES_RESOURCE_URL}?${serialize(query)}`));

    }

};

export const members = {

    bulkTell(userDataArray) {

        const MEMBERS_RESOURCE_URL = `${API_URL}/members`;

        return $.put(MEMBERS_RESOURCE_URL, {
            members: userDataArray
        }, {dataType: 'json'});

    }

};