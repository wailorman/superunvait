import '../../vendor/jquery-comments'

const CURRENT_USER_HOOK_ELEM = '#hook_Cfg_CurrentUser';

export function getCurrentUserInfo() {

    return JSON.parse($(CURRENT_USER_HOOK_ELEM).comments().html())

}