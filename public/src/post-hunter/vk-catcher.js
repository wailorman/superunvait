'use strict';

function inWhichRangeIsNumber(numOfLikes, ranges) {

    for (let i = 0; i < ranges.length; i++) {

        let range = ranges[i];

        if (range[0] <= numOfLikes && range[1] >= numOfLikes) {
            return i;
        }

    }

    return null;

}


function splitArray(array, numberOfParts) {
    var len = array.length,
        out = [],
        i = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / numberOfParts--);
        out.push(array.slice(i, i += size));
    }
    return out;
}


function splitArrayToNRanges(array, numberOfRanges) {

    let ranges = splitArray(array, numberOfRanges);

    let result = [];

    ranges.forEach((range)=> {

        if (range.length == 0) result.push([0, 0]);
        else if (range.length == 1) result.push([range[0], range[0]]);
        else if (range.length == 2) result.push([range[0], range[1]]);
        else result.push([_.first(range), _.last(range)]);

    });

    return result;

}

function getScoreByLikesAmountAndRanges ( likesAmount, ranges ) {

    const rangesAmount = ranges.length;
    const likesPart = inWhichRangeIsNumber(likesAmount, ranges)+1;

    return likesPart / rangesAmount;

}


var likes = {};

$('.post').each(function(i, elem){
    var id = elem.id;
    var likesAmount = $(elem).find('.post_like_count').html();
    likes[id] = parseInt(likesAmount);
});

var likesArray = _.values(likes);
var sortedLikes = _.sortBy(likesArray);
var splitedLikes = splitArray(sortedLikes, 10);

var likesRanges = splitArrayToNRanges(sortedLikes, 10);

console.log(likesRanges);

$('.post').each(function(i, elem){
    var id = elem.id;
    var likesAmount = $(elem).find('.post_like_count').html();

    var postScore = getScoreByLikesAmountAndRanges( likesAmount, likesRanges );

    // console.log(`${likesAmount}\n
    //              ${postScore}\n
    //              ---------------`);

    $(elem).css({'opacity': `${postScore*0.5})`});
});

// var likesRanges = splitedLikes.map(function(likesRange){
// 	if (likesRange.length == 0) return [0, 0];
// 	else if (likesRange.length == 1) return [likesRange[0], likesRange[0]];
// 	else if (likesRange.length == 2) return [likesRange[0], likesRange[1]];
// 	else return [_.first(likesRange), _.last(likesRange)];
// });

// console.log(likesRanges);

// $('.post').each(function(i, elem){
// 	var id = elem.id;
// 	var likesAmount = $(elem).find('.post_like_count').html();
// 	likes[id] = parseInt(likesAmount);
// });