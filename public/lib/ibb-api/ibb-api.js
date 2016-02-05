export let API_URL = 'http://stool.wailorman.ru:8050';

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