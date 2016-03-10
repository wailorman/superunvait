import '../../../vendor/jquery-comments'
import { assignThisScriptToUrl } from '../../../lib/spa-url-observer'
import * as okApi from '../../../lib/ok-api/ok-api'
import * as ibbApi from '../../../lib/ibb-api/ibb-api'
import {
    getUserInfoByHisContainer,
    getUserAvatarByHisContainer
} from '../../../lib/ok-ui-parsers/user-container'
import { waitElemAppears } from '../../../lib/page-script-loader/page-script-loader'
import './inviting-style.css'

const gwtHash = pageCtx.gwtHash;
const token = OK.tkn.get();

const INVITING_RESULT = okApi.INVITING_RESULT;

const CONTROL_PANEL__TOGGLE_INVITING_BTN = '#sk_auto';
const CONTROL_PANEL__SET_FILTER_BTN = '#gotoBabyli';
const USER_CONTAINER = 'div.photoWrapper';
const CONTROL_PANEL = '#inviterControlPanel';
const FILTER_FORM = '#hook_Form_OnSiteNowUsersRBFormForm';

const TOGGLE_BUTTON_TEXT__CONTINUE = "ПРОДОЛЖИТЬ ИНВАЙТИНГ!";
const TOGGLE_BUTTON_TEXT__STOP = "ОСТАНОВИТЬ ИНВАЙТИНГ!";

const CONTROL_PANEL_HTML = require('raw!./control-panel-tpl.html');

export const controlPanelCtrl = {
    invitedCounter: 0,

    mount() {

        if ($(CONTROL_PANEL).length == 0) {

            console.debug('Mounting control panel');

            this.injectHTML();

            $(CONTROL_PANEL__SET_FILTER_BTN).click(this.setFilter);

            $(CONTROL_PANEL__TOGGLE_INVITING_BTN).click(this.toggleInviting);

            $(window).scroll(this.moveControlPanel);

            $(CONTROL_PANEL).addClass('ibb-tools inviting-control-panel');

        }else{
            console.debug(`Control panel already exists`);
        }

    },

    injectHTML(){
        $(FILTER_FORM).append(CONTROL_PANEL_HTML);
    },

    setFilter() {
        // set filter to target audience (grannies)
        $('#field_ageTo').val(90).change();
        $('#field_ageFrom').val(50).change();
        $('#field_male').attr('checked', false).change();
    },

    toggleInviting(){
        if (invitingCtrl) {
            if (invitingCtrl.isInvitingProceed == false) {
                invitingCtrl.startInviting();
                //noinspection JSUnusedAssignment
                controlPanelCtrl.updateToggleButtonText(TOGGLE_BUTTON_TEXT__STOP)
            } else {
                invitingCtrl.stopInviting();
                //noinspection JSUnusedAssignment
                controlPanelCtrl.updateToggleButtonText(TOGGLE_BUTTON_TEXT__CONTINUE);
            }
        }else{
            console.error(`toggleInviting(): Inviting Controller hasn't yet initialized`);
        }
    },

    moveControlPanel() {
        let viewPortTopPointPosition = $(window).scrollTop();
        if (viewPortTopPointPosition > 310) {
            // keep control panel visible when scroll
            $(CONTROL_PANEL).css({position: 'fixed', top: 110});
        } else {
            $(CONTROL_PANEL).css({position: 'relative', top: 0});
        }
    },

    incrementInvitedCounter() {
        this.invitedCounter++;
        $('#invitedDiv').text(this.invitedCounter);
    },

    updateToggleButtonText(newText) {
        $(CONTROL_PANEL__TOGGLE_INVITING_BTN).text(newText);
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

        this.invitingInterval = setInterval(() => {

            let userContainer = $($(USER_CONTAINER)[this.userContainerIndex]);

            this.doInvite(userContainer);

            let userContainersAmount = $(USER_CONTAINER).length;
            let noMoreUsers = this.userContainerIndex >= userContainersAmount;

            this.userContainerIndex += 1;

            if (noMoreUsers) {
                this.stopInviting();
                controlPanelCtrl.toggleInviting();
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