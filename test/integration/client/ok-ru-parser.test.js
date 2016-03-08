import {
    getArrayOfLikes,
    paintPostsWithRanges,
    getLikesRanges,
    paintPosts,

    POSTS_SELECTOR
} from '../../../public/src/modules/post-hunter/parsers/ok-ru'

import {
    splitArrayToNRanges,
    getScoreByLikesAmountAndRanges
} from '../../../public/src/modules/post-hunter/sorting'

describe("post hunter / parsers / ok-ru", ()=> {

    const arrayOfLikes = [53, 1, 12, 62, 23, 20, 23, 23, 12, 18, 13, 38, 45, 26, 8, 9, 45, 23, 46, 43, 43,
        55, 77, 31, 18, 39, 12, 116, 44, 62, 82, 35, 15, 39, 15];

    const likesRanges = [[1, 12], [12, 15], [15, 20], [23, 23], [26, 38], [39, 43], [43, 45], [45, 53],
        [55, 62], [77, 116]];

    beforeEach(()=> {
        //document.body.innerHTML = __html__['test/fixtures/ibb-feed.html'];
        const fixtureContent = require('raw!../../fixtures/ibb-feed.html');
        $('#test-zone').html(fixtureContent);
    });

    afterEach(()=> {
        $('#test-zone').html("");
    });

    describe("getLikesRanges", ()=> {

        it(`should return expected ranges`, () => {

            const expectedRanges = likesRanges;
            const actual = getLikesRanges();

            expect(actual).to.eql(expectedRanges);

        });

    });

    describe("getArrayOfLikes", ()=> {

        it(`should return expected array of likes`, () => {

            const expected = arrayOfLikes;
            const actual = getArrayOfLikes();

            expect(actual).to.eql(expected);

        });

    });

    describe("paintPosts", ()=> {

        it(`should not throw any error`, () => {

            expect(()=> {
                paintPosts();
            }).to.not.throw();

        });

    });

});