import '../../vendor/jquery-put-delete'

export let API_URL = 'http://localhost:8050';

export const invites = {

    tell(userId, city) {

        const INVITES_RESOURCE_URL = `${API_URL}/invites`;

        return $.post(INVITES_RESOURCE_URL, {
            invite: {
                userId: userId,
                city: city
            }
        }, {dataType: 'json'});

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