import '../../vendor/jquery-comments'
import { assignScriptToUrl } from '../../lib/spa-url-observer'
import * as okApi from '../../lib/ok-api/ok-api'
import * as ibbApi from '../../lib/ibb-api/ibb-api'
import {
    getUserInfoByHisContainer,
    getUserAvatarByHisContainer
} from '../../lib/ok-ui-parsers/user-container'

let isInvitingProceed = false;

let userContainerIndex = 0;
let invitingInterval = null;

const gwtHash = pageCtx.gwtHash;
const token = OK.tkn.get();

const INVITING_RESULT = {
    SUCCESS: 'SUCCESS',
    NOT_RECEIVING: 'NOT_RECEIVING',
    TOO_OFTEN: 'TOO_OFTEN'
};

const CONTROL_PANEL__TOGGLE_INVITING = '#sk_auto';
const USER_CONTAINER = 'div.photoWrapper';
const CONTROL_PANEL = '#inviterControlPanel';

const CONTROL_PANEL_HTML = `<div id="inviterControlPanel">
            <center>
                <button id="gotoBabyli">Перейти к бабулям (^.^)</button>
                </center><br><center>
                <button id="sk_auto">НАЧАТЬ ИНВАЙТИНГ!</button>
                <br><br>
                <span>Пригласили: <span id="invitedDiv">0</span></span>
            </center>
        </div>`;

export const controlPanel = {
    invitedCounter: 0,

    mount() {

        if ($(CONTROL_PANEL).length == 0) {

            console.log(`MOUNTING!!!`);

            // inject control panel
            $('#hook_Form_OnSiteNowUsersRBFormForm').append(CONTROL_PANEL_HTML);

            $('#gotoBabyli').click(() => {
                // set filter to target audience (grannies)
                $('#field_ageTo').val(90).change();
                $('#field_ageFrom').val(50).change();
                $('#field_male').attr('checked', false).change();
            });

            $(CONTROL_PANEL__TOGGLE_INVITING).click(() => {
                if (isInvitingProceed == false) {
                    inviting.startInviting();
                } else {
                    inviting.stopInviting();
                }
            });

            let controlPanelWidth = $(CONTROL_PANEL).width();
            $(CONTROL_PANEL).css({background: 'rgb(240, 240, 240)', padding: '20px 0px', width: controlPanelWidth});
            $(window).scroll(()=> {
                let viewPortTopPointPosition = $(window).scrollTop();
                if (viewPortTopPointPosition > 310) {
                    // keep control panel visible when scroll
                    $(CONTROL_PANEL).css({position: 'fixed', top: 110});
                } else {
                    $(CONTROL_PANEL).css({position: 'relative', top: 0});
                }
            });

        }

    },

    incrementInvitedCounter() {
        this.invitedCounter++;
        $('#invitedDiv').text(this.invitedCounter);
    }

};


export const inviting = {

    ////    helpers:

    sendInvitationToOkApi(userId, gwtHash, token) {

        return okApi.invites.send(userId, gwtHash, token);

    },

    tellApiAboutInvitation(userId, city) {

        return ibbApi.invites.tell(userId, city)
            .done((data)=> {
                console.log(`Success`);
                console.log(data);
            })
            .fail((data)=> {
                console.log(`FAIL`);
                console.log(data);
            });

    },

    scrollToInvitee(userContainer) {
        $(window).scrollTop(userContainer.offset().top - 150);
    },

    paintAvatar(userAvatar, resultOfInvitation) {

        if ( resultOfInvitation === INVITING_RESULT.TOO_OFTEN ){
            userAvatar.invitingApi.paintAs.tooMuchInvites();
        } else if ( resultOfInvitation === INVITING_RESULT.NOT_RECEIVING ) {
            userAvatar.invitingApi.paintAs.notReceivingInvites();
        } else if ( resultOfInvitation === INVITING_RESULT.SUCCESS ) {
            userAvatar.invitingApi.paintAs.invited();
        } else {
            console.error(`Invalid invitation result`);
        }


    },

    getResultOfInvitation(data) {

        let resultOfInvitation;

        if (data.indexOf('слишком часто') > -1)
            resultOfInvitation = INVITING_RESULT.TOO_OFTEN;
        else if (data.indexOf('не принимает приглашения') > -1)
            resultOfInvitation = INVITING_RESULT.NOT_RECEIVING;
        else
            resultOfInvitation = INVITING_RESULT.SUCCESS;

        return resultOfInvitation;

    },

    //////////////////////////////////////////////////////

    startInviting() {

        isInvitingProceed = true;
        $(CONTROL_PANEL__TOGGLE_INVITING).text("ОСТАНОВИТЬ ИНВАЙТИНГ!");

        invitingInterval = setInterval(() => {

            let userContainer = $($(USER_CONTAINER)[userContainerIndex]);

            this.doInvite(userContainer);

            let userContainersAmount = $(USER_CONTAINER).length;
            let noMoreUsers = userContainerIndex >= userContainersAmount;

            userContainerIndex += 1;

            if (noMoreUsers) {
                this.stopInviting();
            }

        }, 1000);
    },

    doInvite(userContainer) {

        let userAvatar = getUserAvatarByHisContainer(userContainer);
        let userInfo = getUserInfoByHisContainer(userContainer);
        let userId = userInfo.userId;
        const city = $('#oSNCN').html();

        this.scrollToInvitee(userContainer);

        this.sendInvitationToOkApi(userId, gwtHash, token)
            .success(data => {

                let resultOfInvitation = this.getResultOfInvitation(data);

                this.paintAvatar(userAvatar, resultOfInvitation);

                switch (resultOfInvitation) {
                    case INVITING_RESULT.TOO_OFTEN:
                        stopInviting();
                        break;

                    case INVITING_RESULT.SUCCESS:
                        this.tellApiAboutInvitation(userId, city);
                        controlPanel.incrementInvitedCounter();
                        break;

                    default:
                        console.error(`Unexpected invitation result:`);
                        console.log(data);
                        break;
                }

            });

    },

    stopInviting() {
        clearInterval(invitingInterval);
        isInvitingProceed = false;
        $(CONTROL_PANEL__TOGGLE_INVITING).text("НАЧАТЬ UHBAUTUNG!");
    }

};

//////////////
// WILL RUN WHEN SCRIPT WILL BE LOADED

assignScriptToUrl(/\/online(\/)?$/gm).onVisit(controlPanel.mount);

//////////////