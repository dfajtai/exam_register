function simpleFlatFormatter(index, row) {
    var html = []
    var hidden_keys = ["state"]
    $.each(row, function (key, value) {
        if(!(hidden_keys.includes(key))){
            html.push('<p><b>' + key + ':</b> ' + value + '</p>')
        }

    })
    return html.join('')
}



function unitTypeFormatter(value,row){
    if(value==null) return;
    var name = getDefEntryFieldWhere("unit_type_definitions","UnitTypeID",value,"UnitTypeName");
    if (name){return name}
    else {return "Unknown type '" + String(value) + "'"}
    
}

function studyFormatter(value,row){
    if(value==null) return;

    var name = getDefEntryFieldWhere("studies","StudyID",value,"StudyName");
    if (name){return name}
    else {return "Unknown study '" + String(value) + "'"}
    
}

function sideFormatter(value,row){
    if(value==null) return;

    var name = getDefEntryFieldWhere("side_definitions","SideID",value,"SideShortName");
    if (name){return name}
    else {return "Unknown side '" + String(value) + "'"}
    
}

function consumableTypeFormatter(value,row){
    if(value==null) return;

    var name = getDefEntryFieldWhere("consumable_type_definitions","ConsumableTypeID",value,"ConsumableTypeName");
    if (name){return name}
    else {return "Unknown type '" + String(value) + "'"}
}


function locationFormatter(value,row){
    if(value==null) return;

    var name = getDefEntryFieldWhere("location_definitions","LocationID",value,"LocationName");
    if (name){return name}
    else {return "Unknown location '" + String(value) + "'"}
}

function sexFormatter(value,row){
    if(value==null) return;

    var name = getDefEntryFieldWhere("sex_definitions","SexID",value,"SexName");
    if (name){return name}
    else {return "Unknown sex '" + String(value) + "'"}
}


function eventFormatter(value,row){
    if(value==null) return;

    var event_name = getDefEntryFieldWhere("event_definitions","EventID",value,"EventName")
    if (event_name){return event_name}
    else {return "Unknown event '" + String(value) + "'"}
}

function eventTypeFormatter(value,row){
    if(value==null) return;

    var name = getDefEntryFieldWhere("event_type_definitions","EventTypeID",value,"EventTypeName");
    if (name){return name}
    else {return "Unknown location '" + String(value) + "'"}
}


function eventStatusFormatter(value,row){
    if(value==null) return;

    var name = getDefEntryFieldWhere("event_status_definitions","EventStatusID",value,"EventStatusName");
    if (name){return name}
    else {return "Unknown status '" + String(value) + "'"}
}

function subjectStatusFormatter(value,row){
    if(value==null) return;

    var name = getDefEntryFieldWhere("subject_status_definitions","StatusID",value,"StatusName");
    if (name){return name}
    else {return "Unknown location '" + String(value) + "'"}
}


function datetimeFormatter(value,row){
    if(value==null) return;
    try {
        return moment(value).format('YYYY.MM.DD. hh:mm:ss');
    } catch (error) {
        return;
    }
}