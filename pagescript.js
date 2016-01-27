var isInvitingProceed = false;
var invitedCounter = 0;

var userContainerIndex = 0;
var invitingInterval = null;

const toggleInvitingSelector = '#sk_auto';


setInterval(function () {

    const controlPanelSelector = '#inviterControlPanel';

    if ($(controlPanelSelector).length == 0) {

        // inject control panel
        $('#hook_Form_OnSiteNowUsersRBFormForm').append('<div id="inviterControlPanel"><center><button id="gotoBabyli">Перейти к бабулям (^.^)</button></center><br><center><button id="sk_auto">НАЧАТЬ UHBAUTUNG!</button><br><br><span>Пригласили: <span id="invitedDiv">0</span></span></center></div>');

        $('#gotoBabyli').click(function () {
            // set filter to target audience (grannies)
            $('#field_ageTo').val(90).change();
            $('#field_ageFrom').val(50).change();
            $('#field_male').attr('checked', false).change();
        });

        $(toggleInvitingSelector).click(function () {
            if (isInvitingProceed == false) {
                startInviting();
            } else {
                stopInviting();
            }
        });

        var controlPanelWidth = $(controlPanelSelector).width();
        $(controlPanelSelector).css({background: 'rgb(240, 240, 240)', padding: '20px 0px', width: controlPanelWidth});
        $(window).scroll(function (e) {
            var viewPortTopPointPositionOnDocument = $(window).scrollTop();
            if (viewPortTopPointPositionOnDocument > 310) {
                // keep control panel visible when scroll
                $(controlPanelSelector).css({position: 'fixed', top: 110});
            } else {
                $(controlPanelSelector).css({position: 'relative', top: 0});
            }
        });
    }


    if (document.location.href.indexOf('ok.ru/online') == -1) {
        $(window).unbind();
    }

}, 500);


function startInviting() {

    const userContainerSelector = 'div.photoWrapper';
    
    isInvitingProceed = true;
    $(toggleInvitingSelector).text("ОСТАНОВИТЬ UHBAUTUNG!");

    invitingInterval = setInterval(function () {

        // photoWrapper is div class name of the user avatar in search list

        var userContainer = $($(userContainerSelector)[userContainerIndex]);
        var userId;
        if (userContainer.find('img').length > 0 || userContainer.find('.onbigavcont').length > 0) {

            var getUserAvatarByWrapper = function (photoWrapper) {
                var userAvatar = photoWrapper.find('img');
                if (userAvatar.length == 0) {
                    userAvatar = photoWrapper.find(".onbigavcont");
                }

                return userAvatar;
            };


            var userAvatar = getUserAvatarByWrapper(userContainer);

            userId = userContainer.find('a').attr('href').split('/')[2];
            $(window).scrollTop(userContainer.offset().top - 150); // scroll to inviting target

            $.ajax({
                url: 'http://ok.ru/dk?st.cmd=userFriendLive&cmd=InviteUserToGroups&st.layer.cmd=InviteUserToGroupsOuter&st.layer.friendId=' + userId + '&gwt.requested=' + pageCtx.gwtHash + '&p_sId=0',
                data: {
                    'gwt.requested': pageCtx.gwtHash,
                    'st.layer.posted': 'set',
                    'selid': '53396058603765',
                    'button_invite': 'clickOverGWT'
                },
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('TKN', OK.tkn.get());
                }
            }).success(function (data) {

                var tooOften = data.indexOf('слишком часто') > -1;
                var userNotReceiveInvites = data.indexOf('не принимает приглашения') > -1;

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
                    incrementInvitedCounter();
                }
            });
        }

        var userContainersAmount = $(userContainerSelector).length;
        var noMoreUsers = userContainerIndex == userContainersAmount;

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
    $(toggleInvitingSelector).text("НАЧАТЬ UHBAUTUNG!");
}


function incrementInvitedCounter() {
    invitedCounter++;
    $('#invitedDiv').text(invitedCounter);
}



