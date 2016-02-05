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

const TOGGLE_INVITING = '#sk_auto';
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

            $(TOGGLE_INVITING).click(() => {
                if (isInvitingProceed == false) {
                    startInviting();
                } else {
                    stopInviting();
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

export function sendInvitationToOkApi(userId, gwtHash, token) {

    return okApi.invites.send(userId, gwtHash, token);

}

export function tellApiAboutInvitation(userId, city) {

    return ibbApi.invites.tell(userId, city)
        .done((data)=> {
            console.log(`Success`);
            console.log(data);
        })
        .fail((data)=> {
            console.log(`FAIL`);
            console.log(data);
        });

}

function scrollToInvitee(userContainer) {
    $(window).scrollTop(userContainer.offset().top - 150);
}

export function startInviting() {

    isInvitingProceed = true;
    $(TOGGLE_INVITING).text("ОСТАНОВИТЬ ИНВАЙТИНГ!");

    invitingInterval = setInterval(() => {

        let userContainer = $($(USER_CONTAINER)[userContainerIndex]);

        let userAvatar = getUserAvatarByHisContainer(userContainer);
        let userInfo = getUserInfoByHisContainer(userContainer);
        let userId = userInfo.userId;

        scrollToInvitee(userContainer);

        sendInvitationToOkApi(userId, gwtHash, token)
            .success(data => {

                let tooOften = data.indexOf('слишком часто') > -1;
                let userNotReceiveInvites = data.indexOf('не принимает приглашения') > -1;

                if (tooOften) {

                    userAvatar.invitingApi.paintAs.tooMuchInvites();
                    stopInviting();

                } else if (userNotReceiveInvites) {

                    userAvatar.invitingApi.paintAs.notReceivingInvites();

                } else {

                    userAvatar.invitingApi.paintAs.invited();

                    const city = $('#oSNCN').html();

                    console.log(`User invited. Sending data to analytics server...`);
                    tellApiAboutInvitation(userId, city);

                    controlPanel.incrementInvitedCounter();
                }
            });


        let userContainersAmount = $(USER_CONTAINER).length;
        let noMoreUsers = userContainerIndex == userContainersAmount;

        if (noMoreUsers) {
            stopInviting();
        } else {
            userContainerIndex += 1;
        }

    }, 1000);
}


function stopInviting() {
    clearInterval(invitingInterval);
    isInvitingProceed = false;
    $(TOGGLE_INVITING).text("НАЧАТЬ UHBAUTUNG!");
}

//////////////
// WILL RUN WHEN SCRIPT WILL BE LOADED

assignScriptToUrl(/\/online(\/)?$/gm).onVisit(controlPanel.mount);

//////////////

export default startInviting;