function getDefEntryWhere(def_name, key, value){
    if(!(def_name in defs)) return null;

    var result_entry = null;
    $.each(defs[def_name],function(index,entry){
        if(String(entry[key])===String(value)) {
            result_entry = {... entry};
            return false
        }
    })
    return result_entry;
}

function getDefEntriesWhere(def_name, key, value){
    if(!(def_name in defs)) return [];

    var entries = [];
    $.each(defs[def_name],function(index,entry){
        if(String(entry[key])===String(value)) {
            result_entry.push({... entry});
        }
    })
    return entries;
}

function getDefEntriesWhichIn(def_name, key, values){
    if(!(def_name in defs)) return [];

    var entries = [];
    $.each(defs[def_name],function(index,entry){
        if( values.includes(String(entry[key]))) {
            result_entry.push({... entry});
        }
    })
    return entries;
}


function getDefEntryFieldWhere(def_name, key, value, field){
    var result_entry = getDefEntryWhere(def_name, key, value);

    if(!result_entry) return null;
    
    if(field in result_entry){
        return result_entry[field];
    }
    return result_entry;
}

function hasDuplicates(array) {
    if(!Array.isArray(array)) return null;
    return (new Set(array)).size !== array.length;
}

function getFrequency(array){
    if(!Array.isArray(array)) return null;
    var counts = {};
    $.each(array, function(index,value){
        counts[value] = counts[value] ? counts[value] + 1 : 1;
    })

    return counts;
}

function getDoubles(array){
    var counts = getFrequency(array);
    var doubles = [];
    $.each(counts, function(key,value){
        if(value>1) doubles.push(key);
    })
    return doubles;
}

function getDefCol(def_name, col){
    if(!(def_name in defs)) return null;

    var vals = [];
    $.each(defs[def_name],function(index,entry){
        if(entry.hasOwnProperty(col))  vals.push(entry[col]);
    })

    return vals;
}

function defHasDuplicates(def_name, key){
    if(!(def_name in defs)) return null;

    var vals = getDefCol(def_name,key)

    return hasDuplicates(vals);
}



var deleted_status =  getDefEntryFieldWhere("event_status_definitions","EventStatusName","deleted","EventStatusID");
var planned_status =  getDefEntryFieldWhere("event_status_definitions","EventStatusName","planned","EventStatusID");