import { getScoreByLikesAmountAndRanges, splitArrayToNRanges } from '../sorting'

export const LIKES_COUNTER = '.controls-list_lk .widget_count';
export const LIKES_ELEM_SELECTOR = `.feed.h-mod ${LIKES_COUNTER}`;
export const POSTS_SELECTOR = '.feed.h-mod';
export const NUMBER_OF_RANGES_TO_SPLIT = 10;

let likesArray,
    likesAmount;

export function pluckNumberFromStr(str) {

    if ( typeof str == 'number' ) return `${str}`;
    if ( typeof str !== 'string' ) throw new TypeError(`Only Numbers and Strings can be plucked. ${typeof str} was passed`);

    let pluckedNumbers = str.match(/\d/g);

    if (!pluckedNumbers) return "0";

    return pluckedNumbers.join('');

}

export function getArrayOfLikes() {

    likesArray = [];

    $(LIKES_ELEM_SELECTOR).each(function (i, elem) {

        // Promo posts doesn't have likes amount
        // But they have the same classes with normal posts
        try {

            likesAmount = parseInt(pluckNumberFromStr($(elem).html()));

        } catch (e) { return; }

        likesArray.push(likesAmount);

    });

    return likesArray;
}

export function getLikesRanges() {

    const dirtyArrayOfLikes = getArrayOfLikes();
    const sortedArrayOfLikes = _.sortBy(dirtyArrayOfLikes);

    return splitArrayToNRanges(sortedArrayOfLikes, NUMBER_OF_RANGES_TO_SPLIT);

}

export function paintPostsWithRanges(likesRanges) {

    let likesAmount, postScore, bgColor;

    let scores = [];

    $(POSTS_SELECTOR).each(function(i, elem){
        try {

            let likesCounterElem = $(elem).find(LIKES_COUNTER)[0];
            likesAmount = parseInt(pluckNumberFromStr($(likesCounterElem).html()));

        } catch (e) {

            logger.debug(__filename, `Seems post #${i} is promo`);

            // if this is promo post, it shouldn't have a score
            scores.push(null);
            return;

        }

        postScore = getScoreByLikesAmountAndRanges(likesAmount, likesRanges);

        scores.push(postScore);

        bgColor = `rgba(255,0,0,${postScore})`;

        $(elem).css({'background-color': bgColor});
    });

    console.debug(scores);

}

export function paintPosts() {

    paintPostsWithRanges(getLikesRanges());

}

// ok ibb likes: [4,1,7,15,5,29,10,4,4,11,9,8,12,20,9,11,11,3,11,15,4,48,31,17,4,5,38,10,3,25,29,17,12,8,8,8,17,5,36,18,9,35,21,68,19,27,6,7,6,3,1,2,2,1,55,44,53,60,60,49,37,40,31,56,58,65,66,37,29,35,21,59,105,15,131,63,12,67,87,39,105,29,26,11,47,14,54,58,37,27,15,15,27,155,28,43,46,20,46,86,18,19,48,15,66,27,8,22,13,35,59,52,13,39,20,32,47,23,45,56,70,54,26,17,24,69,18,20,32,37,42,13,52,13,7,23,16,27,18,26]

export default paintPosts;