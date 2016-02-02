import {
    getArrayOfLikes,
    paintPostsWithRanges,
    getLikesRanges,
    paintPosts,

    POSTS_SELECTOR
} from '../../public/src/post-hunter/parsers/ok-ru'

import {
    splitArrayToNRanges,
    getScoreByLikesAmountAndRanges
} from '../../public/src/post-hunter/sorting'

describe("post hunter / parsers / ok-ru", ()=> {

    before(()=> {
        document.body.innerHTML = __html__['test/fixtures/ok-ru-ibb.html'];
    });

    const arrayOfLikes = [2, 5, 14, 3, 8, 5, 11, 13, 31];

    const likesRanges = [[2,2],[3,3],[5,5],[5,5],[8,8],[11,11],[13,13],[14,14],[31,31]];

    describe("getLikesRanges", ()=> {

        it(`should return expected ranges`, () => {

            const expectedRanges = likesRanges;
            const actual = getLikesRanges();

            expect(actual).to.eql(expectedRanges);

        });

    });

    it(`should return expected array of likes`, () => {

        const expected = arrayOfLikes;
        const actual = getArrayOfLikes();

        expect(actual).to.eql(expected);

    });

});