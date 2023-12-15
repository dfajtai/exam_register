function statusToStorage(name, value){
    localStorage.setItem(name,JSON.stringify(value));
}

function statusFromStorage(name){
    return JSON.parse(localStorage.getItem(name) || "null");
}

function statusInStorage(name){
    return localStorage.getItem(name) != null;
}

function clearStatusFromStorage(name){
    localStorage.removeItem(name);
}

function statusToUrl(name, value){
    if ('URLSearchParams' in window) {
        var searchParams = new URLSearchParams(window.location.search);
        searchParams.set(name,value);
        var newRelativePathQuery = window.location.pathname +'?' + searchParams.toString();
        history.pushState(null, '', newRelativePathQuery);
    }
}

function statusInUrl(name){
    return statusFromUrl(name) != null;
}

function statusFromUrl(name){
    var status = new URL(location.href).searchParams.get(name);
    return status
}

function clearStatusFromUrl(name){
    if ('URLSearchParams' in window) {
        var searchParams = new URLSearchParams(window.location.search);
        searchParams.delete(name);

        var newRelativePathQuery = window.location.pathname +'?' + searchParams.toString();
        history.pushState(null, '', newRelativePathQuery);
    }
}

function clearAllStatusFromUrl(){
    if ('URLSearchParams' in window) {
        var newRelativePathQuery = window.location.pathname;
        history.pushState(null, '', newRelativePathQuery);
    }
}

function statusToUrlAndStorage(name,value){
    statusToUrl(name,value);
    statusToStorage(name,value);
}

function syncStatusFromUrlToStorage(name){
    statusToStorage(name,statusFromUrl(name));
}

function syncStatusFromStorageToUrl(name){
    statusToUrl(name,statusFromStorage(name));
}