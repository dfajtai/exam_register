function getCol(objlist, col){
    var vals = [];
    $.each(objlist,function(index,entry){
        if(entry.hasOwnProperty(col))  vals.push(entry[col]);
    })

    return vals;
}

function getEntryWhere(objlist, key, value){
    var result_entry = null;
    $.each(objlist,function(index,entry){
        if(String(entry[key])===String(value)) {
            result_entry = {... entry};
            return false
        }
    })
    return result_entry;
}

function getEntryFieldWhere(objlist, key, value, field){
    var result_entry = getEntryWhere(objlist, key, value);

    if(!result_entry) return null;
    
    if(field in result_entry){
        return result_entry[field];
    }
    return result_entry;
}

function listAppend(orig_array, new_array){
    return orig_array.concat(new_array);
}

function listPrepend(orig_array, new_array){
    return new_array.concat(orig_array);
}


function parse_val(val){
    if(val==null) return null;
    if(val=="") return null;
    var num_val = parseInt(val);

    if(String(val)!=String(num_val)){
        var _num_val = parseFloat(val);
        if(String(val)!=String(_num_val)){
            return val;
        };
        return _num_val;
    };
    return num_val;
}