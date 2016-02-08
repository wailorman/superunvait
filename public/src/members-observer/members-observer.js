import {
    getUserInfoByHisContainer,
    getUserAvatarByHisContainer
} from '../../lib/ok-ui-parsers/user-container'
import * as ibbApi from '../../lib/ibb-api/ibb-api'

const USER_CONTAINER = 'div.photoWrapper';

export const membersObserver = {

    proceedObservation: false,

    paintAvatarByPromise(userAvatar, promise){
        promise
            .done((data)=> {
                if (data.created) {
                    userAvatar.paintIn('blue');
                } else {
                    userAvatar.paintIn('yellow');
                }
                return data;
            })
            .fail((err)=> {
                userAvatar.paintIn('black');
                return err;
            });
    },

    parseUserInfoForApi(userInfo) {

        return {
            id: userInfo.userId,
            fio: userInfo.fio,
            gender: userInfo.male ? 'M' : 'F'
        };

    },

    parseUserInfoArrayForApi(userInfoArray) {

        let result = [];

        userInfoArray.forEach((userInfo)=> {

            result.push({
                id: userInfo.userId,
                fio: userInfo.fio,
                gender: userInfo.male ? 'M' : 'F'
            });

        });

        return result;

    },

    tellApiAboutMembers(userInfoArray) {

        return ibbApi.members.bulkTell(this.parseUserInfoArrayForApi(userInfoArray))
            .done((data)=> {
                console.log(`Told API about member`);
                return data;
            })
            .fail((err)=> {
                console.error(`Can't tell API about member`);
                return err;
            });

    },


    //////////////////////////////////////////

    getMembersFromPage() {
        return $(USER_CONTAINER);
    },

    proceedMember(userContainer) {

        let userInfo = getUserInfoByHisContainer(userContainer);
        let userAvatar = getUserAvatarByHisContainer(userContainer);
        let tellingApiPromise = this.tellApiAboutMember(userInfo);

        this.paintAvatarByPromise(userAvatar, tellingApiPromise);

        return tellingApiPromise;

    },

    paintMembersByTransactionResults(memberContainers = this.getMembersFromPage(),
                                     transactionResults) {

        transactionResults.forEach((transactionResult, i)=> {

            let memberContainer = memberContainers[i];
            let memberAvatar = getUserAvatarByHisContainer(memberContainer);

            let isFinishWithErrors= transactionResult.rejectionReason;
            let isNewMember = transactionResult.fulfillmentValue;

            if (isFinishWithErrors) {
                memberAvatar.paintIn('black')
            } else {

                if (isNewMember) {
                    memberAvatar.paintIn('blue');
                } else {
                    memberAvatar.paintIn('lightblue');
                }
            }

        });

    },

    startObserving() {

        this.proceedObservation = true;
        let memberContainers = this.getMembersFromPage();
        let memberInfoArray = [];

        memberContainers.each((i, memberContainer)=> {
            memberInfoArray.push(getUserInfoByHisContainer(memberContainer));
        });

        this.tellApiAboutMembers(memberInfoArray)
            .done((data)=> {
                let transactionResults = data.transactionResults;

                this.paintMembersByTransactionResults(memberContainers, transactionResults);
            })
            .fail((err)=> {
                console.error(err);
                debugger;
                this.stopObserving();
            });

    },
    stopObserving() {
        this.proceedObservation = false;
    }

};

const membersUrl = '/institutebb/members';
export const matchUrl = ()=> {
    return document.location.href.indexOf(membersUrl) > -1;
};