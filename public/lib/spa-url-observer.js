let interval;

export function onUrlChange(callback) {

    let lastUrl = document.location.href;
    let currentUrl;

    interval = setInterval(()=> {

        currentUrl = document.location.href;
        if (lastUrl != currentUrl) {
            callback(currentUrl);
            lastUrl = currentUrl;
        }

    }, 500);

    return interval;

}

export function stopListeningUrl() {
    clearInterval(interval);
}

export function urlListener(urlRegexp:RegExp) {

    return {
        onVisit(visitCallback){
            if (document.location.href.match(urlRegexp)) {
                visitCallback();
            }
            onUrlChange((url)=> {
                if (url.match(urlRegexp)) {
                    visitCallback();
                }
            });
        },
        onLeave(leaveCallback){
            let urlChangesCounter = 0;

            onUrlChange(()=> {
                if (urlChangesCounter > 0) {
                    leaveCallback();
                }
                urlChangesCounter++;
            });
        }
    };

}

export function assignThisScriptToUrl(urlRegexp) {

    return {
        onVisit(callback){
            if (document.location.href.match(urlRegexp)) {
                callback();
            }
            onUrlChange((url)=> {
                if (url.match(urlRegexp)) {
                    callback();
                }
            });
        }
    };

}