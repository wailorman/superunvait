import '../../vendor/jquery-comments'
import { assignScriptToUrl } from '../../lib/spa-url-observer'
import * as okApi from '../../lib/ok-api/ok-api'
import * as ibbApi from '../../lib/ibb-api/ibb-api'

let isInvitingProceed = false;

let userContainerIndex = 0;
let invitingInterval = null;

const TOGGLE_INVITING = '#sk_auto';
const USER_CONTAINER = 'div.photoWrapper';
const CONTROL_PANEL = '#inviterControlPanel';

const CONTROL_PANEL_HTML = `
        <div id="inviterControlPanel">
            <center>
                <button id="gotoBabyli">Перейти к бабулям (^.^)</button>
                </center><br><center>
                <button id="sk_auto">НАЧАТЬ ИНВАЙТИНГ!</button>
                <br><br>
                <span>Пригласили: <span id="invitedDiv">0</span></span>
            </center>
        </div>
        `;

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

export function startInviting() {
    
    isInvitingProceed = true;
    $(TOGGLE_INVITING).text("ОСТАНОВИТЬ ИНВАЙТИНГ!");

    invitingInterval = setInterval(() => {

        // photoWrapper is div class name of the user avatar in search list

        let userContainer = $($(USER_CONTAINER)[userContainerIndex]);
        let userId;
        if (userContainer.find('img').length > 0 || userContainer.find('.onbigavcont').length > 0) {

            let getUserAvatarByWrapper = function (photoWrapper) {
                let userAvatar = photoWrapper.find('img');
                if (userAvatar.length == 0) {
                    userAvatar = photoWrapper.find(".onbigavcont");
                }

                return userAvatar;
            };

            let userDataFromComments = JSON.parse(userContainer.find('.hookData').comments().html());

            let userAvatar = getUserAvatarByWrapper(userContainer);

            userId = userDataFromComments.userId;
            $(window).scrollTop(userContainer.offset().top - 150); // scroll to inviting target

            const gwtHash = pageCtx.gwtHash;
            const token = OK.tkn.get();

            sendInvitationToOkApi(userId, gwtHash, token)
                .success(data => {

                    let tooOften = data.indexOf('слишком часто') > -1;
                    let userNotReceiveInvites = data.indexOf('не принимает приглашения') > -1;

                    if (tooOften) {
                        console.log('ТАКИ НАС ОБНАРУЖИЛИ!!');
                        console.log('ЯКОБЫ СЛИШКОМ ЧАСТО!!');
                        console.log('СДЕРАЕМ ОБОИ И ПЕРЕИЗЖАЕМ!!');
                        console.log('БЕРИТЕ С СОБОЙ РАБИНОВИЧА!!');
                        userAvatar.css({border: "solid 10px black"});
                        stopInviting();
                    } else if (userNotReceiveInvites) {
                        console.log('Не принимает.');
                        userAvatar.css({border: "solid 10px red"});
                    } else {
                        userAvatar.css({border: "solid 10px blue"});

                        const city = $('#oSNCN').html();

                        console.log(`User invited. Sending data to analytics server...`);
                        tellApiAboutInvitation(userId, city);

                        controlPanel.incrementInvitedCounter();
                    }
                });
        }

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

assignScriptToUrl(/\/online(\/)?$/gm).onVisit(controlPanel.mount);

//////////////

export default startInviting;