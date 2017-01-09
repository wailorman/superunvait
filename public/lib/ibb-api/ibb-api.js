import '../../vendor/jquery-put-delete'
import { serialize } from '../url-query-serialize'
import Q from 'q';

//export let API_URL = 'http://localhost:8050';
export let API_URL = 'https://ibb.wailorman.ru';
const INVITES_RESOURCE_URL = `${API_URL}/invites`;

export const invites = {

    tell(userId, city, senderId) {

        return Q($.post(INVITES_RESOURCE_URL, {
            invite: {
                userId: userId,
                city: city,
                senderId: senderId
            }
        }, { dataType: 'json' }));

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
        }, { dataType: 'json' });

    }

};

export const inviteCandidates = {

    bulkTell(userIds) {

        const INVITE_CANDIDATES_RESOURCE_URL = `${API_URL}/invite-candidates`;

        return $.post(INVITE_CANDIDATES_RESOURCE_URL, {
            inviteCandidates: userIds
        }, { dataType: 'json' });

    }

};