import '../../../vendor/jquery-comments'
import { assignThisScriptToUrl } from '../../../lib/spa-url-observer'
import * as okApi from '../../../lib/ok-api/ok-api'
import * as ibbApi from '../../../lib/ibb-api/ibb-api'
import { getUserInfoByHisContainer, getUserAvatarByHisContainer } from '../../../lib/ok-ui-parsers/user-container'
import { getCurrentUserInfo } from '../../../lib/ok-ui-parsers/user-data'
import { waitElemAppears } from '../../../lib/page-script-loader/page-script-loader'
import { UserContainer } from './user-container'
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

        }else{
            console.debug(`Control panel already exists`);
        }

    },

    injectHTML(){
        $(FILTER_FORM).append(CONTROL_PANEL_HTML);
        $(CONTROL_PANEL).addClass('ibb-tools inviting-control-panel');
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
            } else {
                invitingCtrl.stopInviting();
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

    //////////////////////////////////////////////////////

    startInviting() {

        controlPanelCtrl.updateToggleButtonText(TOGGLE_BUTTON_TEXT__STOP);

        this.isInvitingProceed = true;

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

    doInvite(userContainerElem) {

        let userContainer = new UserContainer(userContainerElem);
        let userInfo = userContainer.getUserInfo();
        let userId = userInfo.userId;
        const city = $('#oSNCN').html();
        const senderId = getCurrentUserInfo().uid;

        userContainer.scrollTo();

        userContainer.paintIn('gray', '5px');

        this.sendInvitationToOkApi(userId, gwtHash, token)
            .then((invitationResult)=> {

                switch (invitationResult) {
                    case INVITING_RESULT.SUCCESS:
                        userContainer.paintIn('blue', '5px');
                        ibbApi.invites.tell(userId, city, senderId).then(()=> {
                            userContainer.paintIn('blue');
                        });
                        controlPanelCtrl.incrementInvitedCounter();
                        break;

                    case INVITING_RESULT.TOO_OFTEN:
                        userContainer.paintIn('black');
                        this.stopInviting();
                        break;

                    case INVITING_RESULT.NOT_RECEIVING:
                        userContainer.paintIn('red');
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
        controlPanelCtrl.updateToggleButtonText(TOGGLE_BUTTON_TEXT__CONTINUE);
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

        setTimeout(()=> {
            controlPanelCtrl.mount();
        }, 700);

    },
    onPageLeft() {

        logger.log(__filename, `/online left`);

        invitingCtrl.stopInviting();
    }
};

//////////////

/*

Скрипт на просмотр классов

 $.ajax({

 url: 'https://ok.ru/institutebb?cmd=ShowLikers&gwt.requested=' + pageCtx.gwtHash + '&st.cmd=altGroupMain&st.groupId=53396058603765&',

 data: {

 'st.layer.cmd': 'ShowLikers',
 'st.layer.rt': '4',
 'st.layer.t': '0',
 'st.layer.sid': '64936667616757',
 'fetch': 'false',
 'st.lpage': '3'
 },
 type: "POST",
 beforeSend: xhr => {
 xhr.setRequestHeader('TKN', OK.tkn.get());
 }
 })
 .success(function (data){ console.log(data) })
 .error(function (err){ console.error(err) });

*/