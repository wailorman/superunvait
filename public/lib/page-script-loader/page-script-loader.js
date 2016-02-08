console.log(`lib page script loader`);

let modules = [];

export function initLoader(modulesLoadInterfaces) {

    modulesLoadInterfaces.forEach((loadInterface)=> {

        modules.push({
            isModuleLoaded: false,
            loadInterface: loadInterface
        });

    });

    handleUrlUpdate(document.location.href);
    onUrlChange(handleUrlUpdate);

}

export function onUrlChange(callback) {

    let lastUrl = document.location.href;
    let currentUrl;

    return setInterval(()=> {

        currentUrl = document.location.href;
        if (lastUrl != currentUrl) {
            callback(currentUrl);
            lastUrl = currentUrl;
        }

    }, 250);

}

function handleUrlUpdate(url) {
    modules.forEach((module)=> {

        if (module.isModuleLoaded) {
            if (module.loadInterface.onPageLeft) {
                module.loadInterface.onPageLeft(url);
                module.isModuleLoaded = false;
            }
        }

        if (module.loadInterface.matchUrl(url)) {

            if (module.loadInterface.onPageVisited) {
                module.loadInterface.onPageVisited(url);
                module.isModuleLoaded = true;
            }

        }

    });
}

export default initLoader;