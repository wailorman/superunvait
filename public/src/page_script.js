import '../vendor/jquery-comments'

let isInvitingProceed = false;
let invitedCounter = 0;

let userContainerIndex = 0;
let invitingInterval = null;

const toggleInvitingSelector = '#sk_auto';


setInterval(() => {

    const controlPanelSelector = '#inviterControlPanel';

    if ($(controlPanelSelector).length == 0) {

        // inject control panel
        $('#hook_Form_OnSiteNowUsersRBFormForm').append('<div id="inviterControlPanel"><center><button id="gotoBabyli">Перейти к бабулям ----(^.^)</button></center><br><center><button id="sk_auto">НАЧАТЬ UHBAUTUNG!</button><br><br><span>Пригласили: <span id="invitedDiv">0</span></span></center></div>');

        $('#gotoBabyli').click(() => {
            // set filter to target audience (grannies)
            $('#field_ageTo').val(90).change();
            $('#field_ageFrom').val(50).change();
            $('#field_male').attr('checked', false).change();
        });

        $(toggleInvitingSelector).click(() => {
            if (isInvitingProceed == false) {
                startInviting();
            } else {
                stopInviting();
            }
        });

        let controlPanelWidth = $(controlPanelSelector).width();
        $(controlPanelSelector).css({background: 'rgb(240, 240, 240)', padding: '20px 0px', width: controlPanelWidth});
        $(window).scroll(()=>{
            let viewPortTopPointPositionOnDocument = $(window).scrollTop();
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

    invitingInterval = setInterval(() => {

        // photoWrapper is div class name of the user avatar in search list

        let userContainer = $($(userContainerSelector)[userContainerIndex]);
        let userId;
        if (userContainer.find('img').length > 0 || userContainer.find('.onbigavcont').length > 0) {

            let getUserAvatarByWrapper = function (photoWrapper) {
                let userAvatar = photoWrapper.find('img');
                if (userAvatar.length == 0) {
                    userAvatar = photoWrapper.find(".onbigavcont");
                }

                return userAvatar;
            };

            let userDataFromComments = JSON.parse( userContainer.find('.hookData').comments().html() );

            let userAvatar = getUserAvatarByWrapper(userContainer);

            userId = userDataFromComments.userId;
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
                beforeSend: xhr => {
                    xhr.setRequestHeader('TKN', OK.tkn.get());
                }
            }).success(data => {

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
                    $.post('http://beverly.wailorman.ru:8050/invites', {
                        invite: {
                            userId: userId,
                            city: city
                        }
                    }, {dataType: 'json'})
                    .done((data)=> {
                        console.log(`Success`);
                        console.log(data);
                    })
                    .fail((data)=> {
                        console.log(`FAIL`);
                        console.log(data);
                    });

                    incrementInvitedCounter();
                }
            });
        }

        let userContainersAmount = $(userContainerSelector).length;
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
    $(toggleInvitingSelector).text("НАЧАТЬ UHBAUTUNG!");
}


function incrementInvitedCounter() {
    invitedCounter++;
    $('#invitedDiv').text(invitedCounter);
}



