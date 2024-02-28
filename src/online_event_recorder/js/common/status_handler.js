var url_status_debug = true;

function set_window_title(content=null){
    if(content===null){
        document.title = main_title;
    }
    else{
        document.title = main_title + " - " + content;
    }
}

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
        var old_val = searchParams.get(name);
        if(!isEqual(old_val,value)){
            searchParams.set(name,value);
            var newRelativePathQuery = window.location.pathname +'?' + searchParams.toString();
            history.pushState(history.state, document.title, newRelativePathQuery);
            if(url_status_debug) console.log([history.state, document.title, newRelativePathQuery]);
        }
    }
}

function statusInUrl(name){
    return statusFromUrl(name) != null;
}

function statusFromUrl(name){
    var status = new URL(location.href).searchParams.get(name);
    return status;
}

function getAllStatusFromURL(){
    var status = new URL(location.href).searchParams;
    return status;
}

function searchParamsToObject(search_params) {
    var entries = search_params.entries();
    const result = {}
    for(const [key, value] of entries) { // each 'entry' is a [key, value] tupple
      result[key] = value;
    }
    return result;
  }

function clearStatusFromUrl(name){

    if ('URLSearchParams' in window) {
        var searchParams = new URLSearchParams(window.location.search);
        if(isArray(name)){
            $.each(name,function(index,_name){
                searchParams.delete(_name);
            })
            
        }else{
            searchParams.delete(name);
        }
        

        var newRelativePathQuery = window.location.pathname +'?' + searchParams.toString();
        history.replaceState(history.state, document.title, newRelativePathQuery);
        if(url_status_debug)  console.log([history.state, document.title, newRelativePathQuery])
    }
}

function clearAllStatusFromUrl(){
    if ('URLSearchParams' in window) {
        var newRelativePathQuery = window.location.pathname;
        history.replaceState(history.state, document.title, newRelativePathQuery);
        if(url_status_debug)  console.log([history.state, document.title, newRelativePathQuery])
    }
}

function contentToUrl(content_type, content_value, clear_all = false, add_history = true){
    if ('URLSearchParams' in window) {
        var old_search_params = new URLSearchParams(window.location.search);
        if(clear_all){
            var new_search_params = new URLSearchParams()
            new_search_params.set(content_type,content_value);
        }
        else{
            var new_search_params = new URLSearchParams(window.location.search);
            new_search_params.set(content_type,content_value);
        }

        
        if(!isEqual(searchParamsToObject(new_search_params),searchParamsToObject(old_search_params))){
            var newRelativePathQuery = window.location.pathname +'?' + new_search_params.toString();

            var state = {content_type:content_type, content:content_value};

            if(add_history){
                set_window_title(content_value);
                // $(document).prop('title',title_root + content_value);
                history.pushState(state, document.title, newRelativePathQuery);
            }
            else{
                history.replaceState(state, document.title, newRelativePathQuery);
            }
            if(url_status_debug)  console.log([state, document.title, newRelativePathQuery]);
        }
    }
}

function saveCurrentStatusToHistory(){
    if ('URLSearchParams' in window) {
        var old_search_params = new URLSearchParams(window.location.search);
        var rel_path = window.location.pathname +'?' + old_search_params.toString();
        history.pushState(null, document.title, rel_path);
    }
}


function statusToUrlAndStorage(name,value){
    contentToUrl(name,value,false,true);
    statusToStorage(name,value);
}

function syncStatusFromUrlToStorage(name){
    statusToStorage(name,statusFromUrl(name));
}

function syncStatusFromStorageToUrl(name){
    contentToUrl(name,statusFromStorage(name),false,true);
}