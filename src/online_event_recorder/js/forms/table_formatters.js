function unitTypeFormatter(value,row){
    var defs = JSON.parse(localStorage.getItem("unit_type_definitions"));
    var match = $.grep(defs, function(def) {
        return def.UnitTypeID ===  value;
    });
    
    if (match.length){return match[0].UnitTypeName}
    else {return "Unknown type '" + String(value) + "'"}
    
}

function sideFormatter(value,row){
    var defs = JSON.parse(localStorage.getItem("specimen_side_definitions"));
    var match = $.grep(defs, function(def) {
        return def.SideID ===  value;
    });
    
    if (match.length){return match[0].SideShortName}
    else {return "Unknown side '" + String(value) + "'"}
    
}

function consumableTypeFormatter(value,row){
    var defs = JSON.parse(localStorage.getItem("consumable_type_definitions"));
    var match = $.grep(defs, function(def) {
        return def.ConsumableTypeID ===  value;
    });
    
    if (match.length){return match[0].ConsumableTypeName}
    else {return "Unknown type '" + String(value) + "'"}
}


function locationFormatter(value,row){
    var defs = JSON.parse(localStorage.getItem("location_definitions"));
    var match = $.grep(defs, function(def) {
        return def.LocationID ===  value;
    });
    
    if (match.length){return match[0].LocationName}
    else {return "Unknown location '" + String(value) + "'"}
}


function eventTypeFormatter(value,row){
    var defs = JSON.parse(localStorage.getItem("event_type_definitions"));
    var match = $.grep(defs, function(def) {
        return def.EventTypeID ===  value;
    });
    
    if (match.length){return match[0].EventTypeName}
    else {return "Unknown location '" + String(value) + "'"}
}


function eventStatusFormatter(value,row){
    var defs = JSON.parse(localStorage.getItem("event_status_definitions"));
    var match = $.grep(defs, function(def) {
        return def.EventStatusID ===  value;
    });
    
    if (match.length){return match[0].EventStatusName}
    else {return "Unknown location '" + String(value) + "'"}
}