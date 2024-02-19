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

function batch_update_formatter(updates, formatter_func = null){
    return detail_as_table_formatter(null,updates,formatter_func,"Updated value");
}

function object_to_table_formatter(obj, formatter_func= null){
    return detail_as_table_formatter(null,obj,formatter_func);
}

function detail_as_table_formatter(index, row, row_data_formatter = null, value_col_head = "Current value"){
    if(row_data_formatter!= null){
        var data = row_data_formatter(row);
    }
    else{
        var data = row;
    }

    var table = $("<table/>").addClass("w-100 table table-sm table-striped table-bordered border-secondary").attr("id","detail_view_table");
    
    var names = ["Parameter",value_col_head];
    var keys = Object.keys(data);
    keys = _.without(keys,"state");

    var header_row = $("<tr/>");
    $.each(names,function(name_index,name){
        header_row.append($("<th/>").html(name).attr("scope","col").addClass("text-center"));
    })
    table.append($("<thead/>").addClass("table-dark").append(header_row));

    var table_body = $("<tbody/>");
    $.each(keys,function(key_index,key){
        var row_dom = $("<tr/>");
        row_dom.append($("<th/>").html(key).attr("scope","row"));
        var _val = nullify_obj(data[key]);
        if(!isObject(_val)){
            var _val = parse_val(_val);
            row_dom.append($("<td/>").html(_val == null ? "-":_val));
        }
        else{
            var cell_data = $("<div/>");
            $.each(_val,function(_key,_val){

                cell_data.append($("<b/>").append(_key))
                cell_data.append("&emsp;"+_val + "<br/>");
                
            })
            row_dom.append($("<td/>").append(cell_data));
        }
        table_body.append(row_dom);

    })

    table.append(table_body);

    var content = $("<div/>").addClass("mx-3 my-3").append(table);

    return content;
}



function unitTypeFormatter(value,row){
    if(value==null) return value;
    var name = getDefEntryFieldWhere("unit_type_definitions","UnitTypeID",value,"UnitTypeName");
    if (name){return name}
    else {return "Unknown type '" + String(value) + "'"}
    
}

function studyFormatter(value,row){
    if(value==null) return value;

    var name = getDefEntryFieldWhere("studies","StudyID",value,"StudyName");
    if (name){return name}
    else {return "Unknown study '" + String(value) + "'"}
    
}

function sideFormatter(value,row){
    if(value==null) return value;

    var name = getDefEntryFieldWhere("side_definitions","SideID",value,"SideShortName");
    if (name){return name}
    else {return "Unknown side '" + String(value) + "'"}
    
}

function consumableTypeFormatter(value,row){
    if(value==null) return value;

    var name = getDefEntryFieldWhere("consumable_type_definitions","ConsumableTypeID",value,"ConsumableTypeName");
    if (name){return name}
    else {return "Unknown type '" + String(value) + "'"}
}


function locationFormatter(value,row){
    if(value==null) return value;

    var name = getDefEntryFieldWhere("location_definitions","LocationID",value,"LocationName");
    if (name){return name}
    else {return "Unknown location '" + String(value) + "'"}
}

function sexFormatter(value,row){
    if(value==null) return value;

    var name = getDefEntryFieldWhere("sex_definitions","SexID",value,"SexName");
    if (name){return name}
    else {return "Unknown sex '" + String(value) + "'"}
}


function eventFormatter(value,row){
    if(value==null) return value;

    var event_name = getDefEntryFieldWhere("event_template_definitions","EventTemplateID",value,"EventName")
    if (event_name){return event_name}
    else {return "Unknown event '" + String(value) + "'"}
}

function eventTypeFormatter(value,row){
    if(value==null) return value;

    var name = getDefEntryFieldWhere("event_type_definitions","EventTypeID",value,"EventTypeName");
    if (name){return name}
    else {return "Unknown location '" + String(value) + "'"}
}


function eventStatusFormatter(value,row){
    if(value==null) return value;

    var name = getDefEntryFieldWhere("event_status_definitions","EventStatusID",value,"EventStatusName");
    if (name){return name}
    else {return "Unknown status '" + String(value) + "'"}
}

function subjectStatusFormatter(value,row){
    if(value==null) return value;

    var name = getDefEntryFieldWhere("subject_status_definitions","StatusID",value,"StatusName");
    if (name){return name}
    else {return "Unknown status '" + String(value) + "'"}
}


function datetimeFormatter(value,row){
    if(value==null) return value;
    try {
        return moment(value).format('YYYY.MM.DD. HH:mm:ss');
    } catch (error) {
        return;
    }
}

function jsonFormatter(value,row){
    var val = nullify_obj(isString(value)? JSON.parse(value):value);
    if(val==null) return;
    try {
        var res = "";

        if(isObject(val)){

            var keys = Object.keys(val);
            keys.sort();

            $.each(keys,function(index,key){
                res+="'"+key+"'='"+val[key]+"', ";
            })
            return res.slice(0,-2);
        }
        else if(isArray(val)){
            $.each(val,function(key,_val){
                res+="'"+_val+"', ";
            })
            return res.slice(0,-2);
        }
        return val;


    } catch (error) {
        return;
    }
}

function userFormatter(value,row){
    var uid = parse_val(value);

    if(uid==null) return;
    if(users == null) return;
    if(!isObject(users)) return;
    
    if(uid in users) return users[uid];
    return "Unknown user '" + String(uid) + "'";
}
