export function inWhichRangeIsNumber(numOfLikes, ranges) {

    for (let i = 0; i < ranges.length; i++) {

        let range = ranges[i];

        if (range[0] <= numOfLikes && range[1] >= numOfLikes) {
            return i;
        }

    }

    return null;

}


export function splitArray(array, numberOfParts) {
    var len = array.length,
        out = [],
        i = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / numberOfParts--);
        out.push(array.slice(i, i += size));
    }
    return out;
}


export function splitArrayToNRanges(array, numberOfRanges) {

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

export function getScoreByLikesAmountAndRanges ( likesAmount, ranges ) {

    const rangesAmount = ranges.length;
    const likesPart = inWhichRangeIsNumber(likesAmount, ranges)+1;

    return likesPart / rangesAmount;

}
