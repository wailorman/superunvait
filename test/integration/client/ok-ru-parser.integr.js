import {
    getArrayOfLikes,
    paintPostsWithRanges,
    getLikesRanges,
    paintPosts,

    POSTS_SELECTOR
} from '../../../public/src/modules/post-hunter/parsers/ok-ru'

const _POSTS_SELECTOR = POSTS_SELECTOR;

import {
    splitArrayToNRanges,
    getScoreByLikesAmountAndRanges
} from '../../../public/src/modules/post-hunter/sorting'

describe("post hunter / parsers / ok-ru", ()=> {

    const arrayOfLikes = [53, 1, 12, 62, 23, 20, 23, 23, 12, 18, 13, 38, 45, 26, 8, 9, 45, 23, 46, 43, 43,
        55, 77, 31, 18, 39, 12, 116, 44, 62, 82, 35, 15, 39, 15];

    const likesRanges = [[1, 12], [12, 15], [15, 20], [23, 23], [26, 38], [39, 43], [43, 45], [45, 53],
        [55, 62], [77, 116]];

    const expectedScores = [0.8, 0.1, 0.1, 0.9, 0.4, 0.3, 0.4, null, 0.4, 0.1, 0.3, 0.2, 0.5,
        0.7, 0.5, 0.1, 0.1, null, 0.7, 0.4, 0.8, 0.6, 0.6, 0.9, 1, 0.5, null, 0.3, 0.6, 0.1, 1,
        0.7, 0.9, 1, 0.5, null, 0.2, 0.6, 0.2];

    before(()=> {
        const fixtureContent = require('raw!../../fixtures/ibb-feed.html');
        $('#test-zone').html(fixtureContent);
    });

    after(()=> {
        $('#test-zone').html("");
    });

    describe("getLikesRanges && getArrayOfLikes", ()=> {

        beforeEach(()=> {
            const fixtureContent = require('raw!../../fixtures/ibb-feed.html');
            $('#test-zone').html(fixtureContent);
        });

        it(`should return expected ranges`, () => {

            const expectedRanges = likesRanges;
            const actual = getLikesRanges();

            expect(actual).to.eql(expectedRanges);

        });

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

        describe("color checking", ()=> {

            before(()=> {
                paintPosts();

            });

            expectedScores.forEach((expectedScore, i)=> {
                if ( expectedScore === null ) return;

                it(`should paint post #${i} with right color`, () => {

                    let smallestExpectedScore = expectedScore - 0.1,
                        greatestExpectedScore = expectedScore + 0.1,

                        thisPost = $(_POSTS_SELECTOR)[i],
                        thisPostBackgroundColor = $(thisPost)[0].style.backgroundColor,

                        // If score == 1, css of post will be rgba(255, 0, 0),
                        // not rgba(255,0,0,1)! That's why ... || [1]
                        thisPostScoreMatch = thisPostBackgroundColor.match(/\d\.\d/) || [1],
                        thisPostScore = thisPostScoreMatch[0];

                    expect(thisPostScore).to.be.within(smallestExpectedScore, greatestExpectedScore);

                });

            });

        });

    });

});