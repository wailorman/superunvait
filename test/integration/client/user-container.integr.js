

import { UserContainer, USER_CONTAINER } from '../../../public/src/modules/inviter/user-container'

describe("UserContainer API", ()=> {

    const fixtureContent = require('raw!../../fixtures/online-users-list.html');

    before(()=> {
        $('#test-zone').html(fixtureContent);
    });

    after(()=> {
        $('#test-zone').html("");
    });

    describe("constructor", ()=> {

        it(`should have correct jqElem property`, () => {

            const constructingResult = new UserContainer($(USER_CONTAINER)[0]);
            const firstUserContainerNode = constructingResult.jqElem[0];

            expect(firstUserContainerNode.className).to.eql('photoWrapper');

        });

        it(`should not throw error if no arguments`, () => {

            expect(()=> {

                new UserContainer();

            }).to.not.throw();

        });

        it(`should log error if constructed without arguments`, () => {

            let consoleSpy = sinon.spy(console, "error");

            expect(consoleSpy.called).to.eql(false);

            new UserContainer();

            expect(consoleSpy.called).to.eql(true);

        });

        it(`should have avatar property`, () => {

            const constructingResult = new UserContainer($(USER_CONTAINER)[0]);

            expect(constructingResult.avatar).to.exist;

        });

    });

    describe("paintIn", ()=> {

        let userContainerInstance;

        beforeEach(()=> {

            userContainerInstance = new UserContainer($(USER_CONTAINER)[0]);

        });

        const colorsAndExpectations = [
            [ 'black', '10px solid black' ],
            [ 'red', '10px solid red' ],
            [ 'lightblue', '10px solid lightblue' ]
        ];

        colorsAndExpectations.forEach((expectGroup)=> {

            it(`should paint avatar in ${expectGroup[0]} color`, () => {

                let colorToPaint = expectGroup[0],
                    expectedBorderStyle = expectGroup[1];

                userContainerInstance.paintIn(colorToPaint);

                let avatarBorderStyle = userContainerInstance.avatar[0].style.border;

                expect(avatarBorderStyle).to.eql(expectedBorderStyle);

            });

        });

        const borderWidthsAndExpectations = [
            [ 'black', '1px', '1px solid black' ],
            [ 'red', '5px', '5px solid red' ]
        ];

        borderWidthsAndExpectations.forEach((expectGroup)=> {

            it(`should set border width to ${expectGroup[1]} and ${expectGroup[0]} color`, () => {

                let colorToPaint = expectGroup[0],
                    borderWidth = expectGroup[1],
                    expectedBorderStyle = expectGroup[2];

                userContainerInstance.paintIn(colorToPaint, borderWidth);

                let avatarBorderStyle = userContainerInstance.avatar[0].style.border;

                expect(avatarBorderStyle).to.eql(expectedBorderStyle);

            });

        });

        afterEach(()=> {
            $('#test-zone').html(fixtureContent);
        });

    });

    describe("getUserInfo", ()=> {

        let userContainerInstance;
        let actualInfo;

        const expectations = {
            "userId": "510332572503",
            "fio": "Ольга Хохрякова",
            "userIdDecoded": "510332572503",
            "male": false
        };

        before(()=> {

            userContainerInstance = new UserContainer($(USER_CONTAINER)[0]);
            actualInfo = userContainerInstance.getUserInfo();

        });

        _.forEach(expectations, (value, key)=> {

            it(`${key} should eql ${value}`, () => {

                expect(actualInfo[key]).to.eql(value);

            });

        });

    });

});