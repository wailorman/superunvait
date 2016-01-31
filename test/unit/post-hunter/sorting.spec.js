import {
    inWhichRangeIsNumber,
    splitArrayToNRanges,
    getScoreByLikesAmountAndRanges
} from '../../../public/src/post-hunter/sorting'


describe("sorting", ()=> {

    describe("inWhichRangeIsNumber", ()=> {

        const inWhich = inWhichRangeIsNumber;

        const expectations = [
            [0, {num: 0, ranges: [[0, 5], [6, 10]]}],
            [0, {num: 3, ranges: [[0, 5], [6, 10]]}],
            [0, {num: 5, ranges: [[0, 5], [6, 10]]}],

            [1, {num: 6, ranges: [[0, 5], [6, 10]]}],
            [1, {num: 8, ranges: [[0, 5], [6, 10]]}],
            [1, {num: 10, ranges: [[0, 5], [6, 10]]}]
        ];

        expectations.forEach((expct)=> {

            let num = expct[1].num;
            let expectedRange = expct[0];
            let ranges = expct[1].ranges;

            it(`should select ${expectedRange} range if passed
                inWhichRangeIsNumber(${num}, ${JSON.stringify(ranges)})`, () => {

                expect(inWhich(num, ranges)).to.eql(expectedRange);

            });

        });

    });

    describe("splitArrayToNRanges", ()=> {

        const split = splitArrayToNRanges;

        const expectations = [
            {result: [[1, 5], [6, 10]], array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], numberOfParts: 2},
            {result: [[1, 3], [4, 6], [7, 9]], array: [1, 2, 3, 4, 5, 6, 7, 8, 9], numberOfParts: 3}
        ];

        expectations.forEach((expct)=> {

            let result = expct.result,
                array = expct.array,
                numberOfParts = expct.numberOfParts;

            it(`should return ${JSON.stringify(result)} with
                splitArrayToNRanges(${JSON.stringify(array)}, ${numberOfParts})`, () => {

                expect(split(array, numberOfParts)).to.eql(result);

            });

        });

    });


    describe("getScoreByLikesAmountAndRanges", ()=> {

        const getScore = getScoreByLikesAmountAndRanges;

        const likeRanges = [
            //  0      1       2        3         4         5         6         7         8        9
            [1, 3], [4, 6], [7, 9], [10, 12], [13, 15], [16, 18], [19, 21], [22, 24], [25, 27], [28, 30]
            //  .1    .2      .3       .4        .5        .6        .7        .8        .9        1
        ];

        const postLikes = [

            // expected score | likesAmount

            [0.1, 1],
            [0.1, 2],
            [0.1, 3],

            [0.6, 16],

            [0.7, 20],

            [0.9, 27],

            [1, 30]
        ];


        postLikes.forEach((expectation)=> {

            let score = expectation[0];
            let likesAmount = expectation[1];

            it(`should return ${score} score if ${likesAmount} likes passed`, () => {

                expect(getScore(likesAmount, likeRanges)).to.eql(score);

            });

        });


    });

});