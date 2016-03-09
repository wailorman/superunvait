import '../../vendor/jquery-comments'
import { assignThisScriptToUrl } from '../../lib/spa-url-observer'
import * as okApi from '../../lib/ok-api/ok-api'
import * as ibbApi from '../../lib/ibb-api/ibb-api'
import {
    getUserInfoByHisContainer,
    getUserAvatarByHisContainer
} from '../../lib/ok-ui-parsers/user-container'
import { waitElemAppears } from '../../lib/page-script-loader/page-script-loader'


const gwtHash = pageCtx.gwtHash;
const token = OK.tkn.get();

const INVITING_RESULT = okApi.INVITING_RESULT;

const CONTROL_PANEL__TOGGLE_INVITING = '#sk_auto';
const USER_CONTAINER = 'div.photoWrapper';
const CONTROL_PANEL = '#inviterControlPanel';
const FILTER_FORM = '#hook_Form_OnSiteNowUsersRBFormForm';

const CONTROL_PANEL_HTML = `<div id="inviterControlPanel">
            <center>
                <button id="gotoBabyli">Перейти к бабулям (^.^)</button>
                </center><br><center>
                <button id="sk_auto">НАЧАТЬ ИНВАЙТИНГ!</button>
                <br><br>
                <span>Пригласили: <span id="invitedDiv">0</span></span>
            </center>
        </div>`;

export const controlPanelCtrl = {
    invitedCounter: 0,

    mount() {

        if ($(CONTROL_PANEL).length == 0) {

            logger.log(__filename, `Control panel doesn't exist`);
            logger.log(__filename, 'Mounting control panel');

            // inject control panel
            $(FILTER_FORM).append(CONTROL_PANEL_HTML);

            $('#gotoBabyli').click(() => {
                // set filter to target audience (grannies)
                $('#field_ageTo').val(90).change();
                $('#field_ageFrom').val(50).change();
                $('#field_male').attr('checked', false).change();
            });

            $(CONTROL_PANEL__TOGGLE_INVITING).click(() => {
                if (invitingCtrl.isInvitingProceed == false) {
                    invitingCtrl.startInviting();
                } else {
                    invitingCtrl.stopInviting();
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

        }else{
            logger.log(__filename, `Control panel already exists`);
        }

    },

    incrementInvitedCounter() {
        this.invitedCounter++;
        $('#invitedDiv').text(this.invitedCounter);
    }

};


export const invitingCtrl = {

    isInvitingProceed: false,
    invitingInterval: null,
    userContainerIndex: 0,

    ////    helpers:

    sendInvitationToOkApi(userId, gwtHash, token) {

        return okApi.invites.send(userId, gwtHash, token, true);

    },

    tellApiAboutInvitation(userId, city) {

        return ibbApi.invites.tell(userId, city)
            .done(()=> {
                // todo: Invitation ID
                logger.log(__filename, `Told API about invitation`);
            })
            .fail(()=> {
                logger.error(__filename, `IBB API /invites error`);
            });

    },

    scrollToInvitee(userContainer) {
        $(window).scrollTop(userContainer.offset().top - 150);
    },

    paintAvatar(userAvatar, invitationPromise) {

        invitationPromise
            .then((data)=> {
                userAvatar.paintIn('blue');

                return data;
            })
            .catch((err)=> {

                switch (err) {
                    case INVITING_RESULT.TOO_OFTEN:
                        userAvatar.paintIn('black');
                        break;

                    case INVITING_RESULT.NOT_RECEIVING:
                        userAvatar.paintIn('red');
                        break;

                    case INVITING_RESULT.ALREADY_INVITED:
                        userAvatar.paintIn('lightblue');
                        break;
                }

                return err;
            });

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

        this.isInvitingProceed = true;
        $(CONTROL_PANEL__TOGGLE_INVITING).text("ОСТАНОВИТЬ ИНВАЙТИНГ!");

        this.invitingInterval = setInterval(() => {

            let userContainer = $($(USER_CONTAINER)[this.userContainerIndex]);

            this.doInvite(userContainer);

            let userContainersAmount = $(USER_CONTAINER).length;
            let noMoreUsers = this.userContainerIndex >= userContainersAmount;

            this.userContainerIndex += 1;

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

        let invitationRequest = this.sendInvitationToOkApi(userId, gwtHash, token);

        this.paintAvatar(userAvatar, invitationRequest);

        invitationRequest
            .then((invitationResult)=> {

                this.tellApiAboutInvitation(userId, city);
                controlPanelCtrl.incrementInvitedCounter();

                return invitationResult;

            })
            .catch((invitationErr)=> {

                switch (invitationErr) {
                    case INVITING_RESULT.TOO_OFTEN:
                        this.stopInviting();
                        break;

                    case INVITING_RESULT.NOT_RECEIVING:
                        break;

                    default:
                        logger.error(__filename, `Unexpected invitation result`);
                        break;
                }

                return invitationErr;

            });

    },

    stopInviting() {
        clearInterval(this.invitingInterval);
        this.isInvitingProceed = false;
        $(CONTROL_PANEL__TOGGLE_INVITING).text("НАЧАТЬ UHBAUTUNG!");
    }

};

//////////////
// WILL RUN WHEN SCRIPT WILL BE LOADED

export const loadInterface = {
    matchUrl(url) {
        return url.match(/\/online(\/)?$/gm);
    },
    onPageVisited() {

        logger.log(__filename, `/online visited`);

        waitElemAppears($(FILTER_FORM))
            .then(()=> {
                $(document).ready(()=> {
                    controlPanelCtrl.mount();
                });
            })
            .catch((err)=> {
                logger.error(__filename, err);
            });

    },
    onPageLeft() {

        logger.log(__filename, `/online left`);

        invitingCtrl.stopInviting();
    }
};

//////////////