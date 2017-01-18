import async from 'async';

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
const p_sId = () => {
    const psid = (OK.NFC.getStateParamString().match(/\d+/) || [''] )[0];
    console.log('psid', psid);
    return psid;
};


const cities = _.shuffle([
    'Москва',
    'Санкт-Петербург',
    'Новосибирск',
    'Екатеринбург',
    'Нижний Новгород',
    'Самара',
    'Омск',
    'Казань',
    'Челябинск',
    'Ростов-на-Дону',
    'Уфа',
    'Волгоград',
    'Пермь',
    'Красноярск',
    'Воронеж',
    'Саратов',
    'Краснодар',
    'Тольятти',
    'Ижевск',
    'Ульяновск',
    'Барнаул',
    'Владивосток',
    'Ярославль',
    'Иркутск',
    'Тюмень',
    'Махачкала',
    'Хабаровск',
    'Новокузнецк',
    'Оренбург',
    'Кемерово',
    'Рязань',
    'Томск',
    'Астрахань',
    'Пенза',
    'Набережные Челны',
    'Липецк',
    'Тула',
    'Киров',
    'Чебоксары',
    'Калининград',
    'Брянск',
    'Курск',
    'Иваново',
    'Магнитогорск',
    'Улан-Удэ',
    'Тверь',
    'Ставрополь',
    'Нижний Тагил',
    'Белгород',
    'Архангельск',
    'Владимир',
    'Симферополь',
    'Сочи',
    'Севастополь',
    'Курган',
    'Смоленск',
    'Калуга',
    'Чита',
    'Орёл',
    'Волжский',
    'Череповец',
    'Владикавказ',
    'Мурманск',
    'Сургут',
    'Вологда',
    'Саранск',
    'Тамбов',
    'Стерлитамак',
    'Грозный',
    'Якутск',
    'Кострома',
    'Комсомольск-на-Амуре',
    'Петрозаводск',
    'Таганрог',
    'Нижневартовск',
    'Йошкар-Ола',
    'Братск',
    'Новороссийск',
    'Дзержинск',
    'Шахты',
    'Нальчик',
    'Орск',
    'Сыктывкар',
    'Нижнекамск',
    'Ангарск',
    'Старый Оскол',
    'Великий Новгород',
    'Балашиха',
    'Благовещенск',
    'Прокопьевск',
    'Бийск',
    'Химки',
    'Псков',
    'Энгельс',
    'Рыбинск',
    'Балаково',
    'Северодвинск',
    'Армавир',
    'Подольск',
    'Королёв',
    'Южно-Сахалинск',
    'Петропавловск-Камчатский',
    'Сызрань',
    'Норильск',
    'Златоуст',
    'Каменск-Уральский',
    'Мытищи',
    'Люберцы',
    'Волгодонск',
    'Новочеркасск',
    'Абакан',
    'Находка',
    'Уссурийск',
    'Керчь',
    'Березники',
    'Салават',
    'Электросталь',
    'Миасс',
    'Рубцовск',
    'Альметьевск',
    'Ковров',
    'Коломна',
    'Майкоп',
    'Пятигорск',
    'Одинцово',
    'Колпино',
    'Копейск',
    'Хасавюрт',
    'Железнодорожный',
    'Новомосковск',
    'Кисловодск',
    'Серпухов',
    'Первоуральск',
    'Новочебоксарск',
    'Нефтеюганск',
    'Димитровград',
    'Нефтекамск',
    'Черкесск',
    'Орехово-Зуево',
    'Дербент',
    'Камышин',
    'Невинномысск',
    'Красногорск',
    'Муром',
    'Батайск',
    'Новошахтинск',
    'Сергиев Посад',
    'Ноябрьск',
    'Щёлково',
    'Кызыл',
    'Октябрьский',
    'Ачинск',
    'Северск',
    'Новокуйбышевск',
    'Елец',
    'Арзамас',
    'Обнинск',
    'Новый Уренгой',
    'Каспийск',
    'Элиста',
    'Пушкино',
    'Жуковский',
    'Артём',
    'Междуреченск',
    'Ленинск-Кузнецкий',
    'Сарапул',
    'Ессентуки',
    'Воткинск',

    'Гомель',
    'Могилёв',
    'Витебск',
    'Гродно',
    'Брест',
    'Бобруйск',
    'Барановичи',
    'Борисов',
    'Пинск',
    'Орша',
    'Мозырь',
    'Солигорск',
    'Новополоцк',
    'Лида',



    'Алма-Аты',
    'Шымкент',
    'Астана',
    'Караганда',
    'Актобе',
    'Тараз',
    'Павлодар',
    'Усть-Каменогорск',
    'Семей',
    'Уральск',
    'Костанай',
    'Кызылорда',
    'Атырау',
    'Петропавловск',
    'Актау',
    'Темиртау',
    'Туркестан',
    'Кокшетау',
    'Талдыкорган',
    'Экибастуз',
    'Рудный',
    'Жанаозен'
]);

const INVITING_RESULT = okApi.INVITING_RESULT;

const CONTROL_PANEL__TOGGLE_INVITING_BTN = '#sk_auto';
const CONTROL_PANEL__SET_FILTER_BTN = '#gotoBabyli';
const CONTROL_PANEL__SCAN_CANDIDATES_BTN = '#scanInviteCandidates';
const CONTROL_PANEL__CHANGE_CITY_BTN = '#changeCity';
const USER_CONTAINER = '.userCard';
const SCANNED_CANDIDATE_CLASS = '__ibb_scanned';
const USER_CONTAINER__CANDIDATE = `.userCard:not(.${SCANNED_CANDIDATE_CLASS})`;
const CONTROL_PANEL = '#inviterControlPanel';
const FILTER_FORM = '#hook_Form_OnSiteNowUsersRBFormForm';
const SHOW_MORE_BUTTON = '.js-show-more.link-show-more';

const TOGGLE_INV_BUTTON_TEXT__CONTINUE = "ПРОДОЛЖИТЬ ИНВАЙТИНГ!";
const TOGGLE_INV_BUTTON_TEXT__STOP = "ОСТАНОВИТЬ ИНВАЙТИНГ!";

const TOGGLE_SCAN_BUTTON_TEXT__CONTINUE = "ВЗГЛЯНУТЬ!";
const TOGGLE_SCAN_BUTTON_TEXT__STOP = "ОТВЕРНУТЬСЯ!";

const CONTROL_PANEL_HTML = require('raw!./control-panel-tpl.html');


const WAIT_TIMEOUT = 10 * 1000;

export const controlPanelCtrl = {
    invitedCounter: 0,
    currentCityId: 0,

    totalScanned: 0,

    mount() {

        if ($(CONTROL_PANEL).length == 0) {

            console.debug('Mounting control panel');

            this.injectHTML();

            this.setFilter();

            $(CONTROL_PANEL__SET_FILTER_BTN).click(this.setFilter);

            $(CONTROL_PANEL__TOGGLE_INVITING_BTN).click(this.toggleInviting);
            $(CONTROL_PANEL__SCAN_CANDIDATES_BTN).click(this.toggleScanning);
            $(CONTROL_PANEL__CHANGE_CITY_BTN).click(this.changeCity.bind(this));

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

    getCity(index){
        return cities[index] || this.getCity(index - cities.length);
    },

    getNextCity(){
        this.currentCityId++;

        return this.getCity(this.currentCityId);
    },

    changeCity(callback){

        const getCity = (index)=>( cities[index] || getCity( index - cities.length ) );

        const city = getCity(this.currentCityId);

        $('#onSiteNowCityLink').click();
        $('.portlet_h_title').find('input').focus();
        $('.portlet_h_title').find('input').val(city).change();
        $('.portlet_h_title').find('input').focus();
        setTimeout(()=>{
            $($('.sug_it-div')[0]).click();

            setTimeout(() => {
                if (typeof callback == 'function') callback();
            }, 1000);
        }, 1000);

        this.currentCityId++;
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

    toggleScanning(){

        if (scanningCtrl) {
            if (scanningCtrl.isScanningProceed == false) {
                scanningCtrl.startScanCandidates();
            } else {
                scanningCtrl.stopScanCandidates();
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

    incrementScannedCounter(amount = 1){
        this.totalScanned += amount;
        $('#scannedCounter').text(this.totalScanned);
    },


    updateInvitingToggleButtonText(newText) {
        $(CONTROL_PANEL__TOGGLE_INVITING_BTN).text(newText);
    },

    updateScanningToggleButtonText(newText) {
        $(CONTROL_PANEL__SCAN_CANDIDATES_BTN).text(newText);
    },

};


export const scanningCtrl = {

    isScanningProceed: false,

    letsScan() {

        const NEXT_CITY_PLZ = 'next_city_plz';

        async.whilst(
            () => this.isScanningProceed,
            (callback1) => {

                const city = controlPanelCtrl.getNextCity();

                const USERS_PER_CITY_LIMIT = 10000;

                let previousUids = [],
                    page,
                    loaderId;

                async.whilst(
                    ()=> previousUids.length < USERS_PER_CITY_LIMIT && this.isScanningProceed,
                    (callback2) => {

                        okApi.usersOnline.getByCity({
                            city,
                            loaderId,
                            previousUids,
                            page
                        })
                            .then((uids, newLoaderId) => {

                                loaderId = newLoaderId;

                                previousUids = previousUids.concat(uids);

                                if (!page)
                                    page = 2;
                                else
                                    page++;

                                if (uids.length == 0){
                                    return callback2(NEXT_CITY_PLZ)
                                }

                                uids.map(() => {
                                    console.log(city);
                                });
                                // console.debug(uids.join(', '));

                                return ibbApi.inviteCandidates.bulkTell(uids)
                                    .then(() => {
                                        controlPanelCtrl.incrementScannedCounter(uids.length);
                                        callback2();
                                    });

                            })
                            .catch((err) => {
                                callback2(err);
                            });

                    },
                    (err) => {
                        if (err !== NEXT_CITY_PLZ && err !== null) return callback1(err);
                        return callback1();
                    }
                );

            },
            (err) => {
                debugger;
                console.error(err);
            }
        );

    },

    startScanCandidates() {

        controlPanelCtrl.updateScanningToggleButtonText(TOGGLE_SCAN_BUTTON_TEXT__STOP);

        this.isScanningProceed = true;

        this.letsScan();

    },
    stopScanCandidates() {

        controlPanelCtrl.updateScanningToggleButtonText(TOGGLE_SCAN_BUTTON_TEXT__CONTINUE);

        this.isScanningProceed = false;

    }

};


export const invitingCtrl = {

    isInvitingProceed: false,
    invitingInterval: null,
    userContainerIndex: 0,

    ////    helpers:

    sendInvitationToOkApi(userId) {

        return okApi.invites.send(userId, gwtHash, token, true, p_sId());

    },

    //////////////////////////////////////////////////////

    startInviting() {

        controlPanelCtrl.updateInvitingToggleButtonText(TOGGLE_INV_BUTTON_TEXT__STOP);

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

        this.sendInvitationToOkApi(userId)
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
                        // this.stopInviting();
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
        controlPanelCtrl.updateInvitingToggleButtonText(TOGGLE_INV_BUTTON_TEXT__CONTINUE);
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