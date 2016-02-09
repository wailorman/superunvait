import '../../vendor/jquery-put-delete'
import { serialize } from '../url-query-serialize'

export let API_URL = 'http://stool.wailorman.ru:8050';
const INVITES_RESOURCE_URL = `${API_URL}/invites`;

export const invites = {

    tell(userId, city) {

        return $.post(INVITES_RESOURCE_URL, {
            invite: {
                userId: userId,
                city: city
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