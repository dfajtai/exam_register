function getCol(objlist, col){
    var vals = [];
    $.each(objlist,function(index,entry){
        if(entry.hasOwnProperty(col))  vals.push(entry[col]);
    })

    return vals;
}

function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

function getColUnique(objlist, col){
    var vals = getCol(objlist,col);
    var unique = vals.filter(onlyUnique);

    return unique;
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

function getEntriesWhere(objlist, key, value){
    var result_entries = [];
    $.each(objlist,function(index,entry){
        if(String(entry[key])===String(value)) {
            result_entries.push({... entry});
        }
    })
    return result_entries;
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


function parse_val(val, dummy = false){
    if(dummy) return val;

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

function nullify_obj(obj, parse = false){
    // {'key':null, 'key2':null , ...} -> null
    if(!isObject(obj)) return obj;

    var keys = Object.keys(obj);
    var non_null_count = 0;

    var res = {};
    $.each(keys,function(index,key){
        let val = parse_val(obj[key],parse);
        if(val!=null){
            non_null_count+=1;
            res[key]=val;
        }
    })
    if(non_null_count == 0) return null;

    return res;
}

function nullify_array(array, parse = false){
    if(!Array.isArray(array)) return array;

    var non_null_count = 0;
    var res = [];
    $.each(array,function(index,entry){
        let val = parse_val(entry,parse);
        if(entry!=null){
            non_null_count+=1;
            res.push(val);
        }
    })
    if(non_null_count == 0) return null;

    return res;
}

function isObject(value) {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
    );
  }

  function isString(string_candidate){
    return typeof string_candidate === 'string' || string_candidate instanceof String;
  }