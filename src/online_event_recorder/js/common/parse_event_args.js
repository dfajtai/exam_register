
// dtype_dropdown.append($("<option/>").html("text").attr("value","text"));
// dtype_dropdown.append($("<option/>").html("longtext").attr("value","longtext"));
// dtype_dropdown.append($("<option/>").html("date").attr("value","date"));
// dtype_dropdown.append($("<option/>").html("time").attr("value","time"));
// dtype_dropdown.append($("<option/>").html("numeric").attr("value","numeric"));
// dtype_dropdown.append($("<option/>").html("range").attr("value","range"));

// def_select_dropdow.append($("<option/>").html("Location").attr("value","location"));
// def_select_dropdow.append($("<option/>").html("Bodypart").attr("value","bodypart"));
// def_select_dropdow.append($("<option/>").html("Consumable").attr("value","consumable"));
// def_select_dropdow.append($("<option/>").html("Asset").attr("value","asset"));


function customArgParserTest(container){
    var test_args = [{"FieldName":"date","FieldLabel":"datum","FieldDataType":"date","FieldType":"input"},
    {"FieldName":"time","FieldLabel":"ido","FieldDataType":"time","FieldType":"input"},
    {"FieldName":"datetime","FieldLabel":"datumido","FieldDataType":"datetime","FieldType":"input","FieldRequired":true},
    {"FieldName":"comment","FieldLabel":"comment","FieldDataType":"text","FieldType":"input"},
    {"FieldName":"desc","FieldLabel":"desc","FieldDataType":"longtext","FieldType":"input"},
    {"FieldName":"location","FieldLabel":"helyszin","FieldType":"select","FieldSource":"location"},
    {"FieldName":"location2","FieldLabel":"helyszin2","FieldType":"select","FieldSource":"location"},
    {"FieldName":"inj_bp","FieldLabel":"beadas_hely","FieldType":"select","FieldSource":"bodypart","FieldRequired":true},
    {"FieldName":"inj_asset","FieldLabel":"beado_eszkoz","FieldType":"select","FieldSource":"asset","FieldRequired":true},
    {"FieldName":"inj_dose","FieldLabel":"beadadott_dozis","FieldDataType":"numeric","FieldType":"input","FieldSource":"bodypart","FieldDataStep":".1","FieldDataMin":"0","FieldDataMax":"10","FieldUnit":"ml","FieldRequired":true},
    {"FieldName":"inj_agent","FieldLabel":"beadott_anyag","FieldType":"select","FieldSource":"consumable","FieldRequired":true},
    {"FieldName":"inj_flow","FieldLabel":"beadadas_sebessege","FieldDataType":"range","FieldType":"input","FieldSource":"bodypart","FieldDataStep":"0.1","FieldDataMin":"0","FieldDataMax":"10","FieldUnit":"ml/s","FieldRequired":true}]
    
    showCustomArgs(container,test_args);
}

function eventTextInput(container,name,label){
    var _label =  $("<label/>").addClass("col-md-4 col-form-label").html(label);
    var _input = $("<input/>").addClass("form-control").attr("type","text").attr("id",name+"Input").attr("name",name);

    container.append(_label);
    container.append($("<div/>").addClass("col-md-8").append(_input));
}

function eventLongTextInput(container,name,label){
    var _label =  $("<label/>").addClass("col-md-4 col-form-label").html(label);
    var _input = $("<textarea/>").addClass("form-control").attr("type","text").attr("id",name+"Input").attr("name",name).attr("rows",5);

    container.append(_label);
    container.append($("<div/>").addClass("col-md-8").append(_input));
}

function eventDateInput(container,name,label){
    var _label =  $("<label/>").addClass("col-md-4 col-form-label").html(label);

    var group_container = $("<div/>").addClass("input-group");
    var current = $("<span/>").addClass("input-group-text w-40").attr("id","currentTime");
    group_container.append(current);

    var fa_span =$("<i/>").addClass("fa fa-arrow-right update-date");
    group_container.append($("<span/>").addClass("btn-outline-dark btn update-date").append(fa_span));

    var _input = $("<input/>").addClass("form-control").attr("type","date").attr("id",name+"Input").attr("name",name);

    _input.val(moment().format("YYYY-MM-DD"));
    group_container.append(_input)

    current.html(moment().format("YYYY-MM-DD"));

    group_container.find(".update-date").on("click", function (){
        $(_input).val(current.html());
    });

    container.append(_label);
    container.append($("<div/>").addClass("col-md-8").append(group_container));

}

function eventTimeInput(container,name,label){
    var _label =  $("<label/>").addClass("col-md-4 col-form-label").html(label);

    var group_container = $("<div/>").addClass("input-group");
    var current = $("<span/>").addClass("input-group-text w-40").attr("id","currentTime");
    group_container.append(current);

    var fa_span =$("<span/>").addClass("fa fa-arrow-right update-date");
    group_container.append($("<i/>").addClass("btn-outline-dark btn update-date").append(fa_span));
    var _input = $("<input/>").addClass("form-control").attr("type","time").attr("id",name+"Input").attr("name",name).attr("step","1");

    _input.val(moment().format("HH:mm:ss"));
    group_container.append(_input)

    current.html(moment().format("HH:mm:ss"));
    setInterval(function(){current.html(moment().format("HH:mm:ss"));},1000);

    group_container.find(".update-date").on("click", function (){
        $(_input).val(current.html());
    });

    container.append(_label);
    container.append($("<div/>").addClass("col-md-8").append(group_container));
}

function eventDatetimeInput(container,name,label){
    var _label =  $("<label/>").addClass("col-md-4 col-form-label").html(label);

    var group_container = $("<div/>").addClass("input-group");
    var current = $("<span/>").addClass("input-group-text w-40").attr("id","currentDateTime");
    group_container.append(current);

    var fa_span =$("<span/>").addClass("fa fa-arrow-right update-datetime");
    group_container.append($("<i/>").addClass("btn-outline-dark btn update-datetime").append(fa_span));
    var _input = $("<input/>").addClass("form-control").attr("type","datetime-local").attr("id",name+"Input").attr("name",name).attr("step","1");

    _input.val(moment().format("YYYY-MM-DD HH:mm:ss"));
    group_container.append(_input)

    current.html(moment().format("YYYY-MM-DD HH:mm:ss"));
    setInterval(function(){current.html(moment().format("YYYY-MM-DD HH:mm:ss"));},1000);

    group_container.find(".update-datetime").on("click", function (){
        $(_input).val(current.html());
    });

    container.append(_label);
    container.append($("<div/>").addClass("col-md-8").append(group_container));
}

function eventNumericInput(container,name,label,arg){
    var _label =  $("<label/>").addClass("col-md-4 col-form-label").html(label);

    var group_container = $("<div/>").addClass("input-group");
    
    var _input = $("<input/>").addClass("form-control").attr("type","numeric").attr("id",name+"Input").attr("name",name);
    if(arg.hasOwnProperty("FieldDataStep")) _input.attr("step",arg.FieldDataStep);

    group_container.append(_input)

    if(arg.hasOwnProperty("FieldUnit")){
        var unit = $("<span/>").addClass("input-group-text w-25");  
        unit.html(arg.FieldUnit);
        group_container.append(unit);
    }

    container.append(_label);
    container.append($("<div/>").addClass("col-md-8").append(group_container));
}

function eventRangeInput(container,name,label,arg){
    var _label =  $("<label/>").addClass("col-md-4 col-form-label").html(label);

    var group_container = $("<div/>").addClass("input-group");
    
    var _input = $("<input/>").addClass("form-control form-range w-50 mt-2 me-2").attr("type","range").attr("id",name+"Input").attr("name",name);
    if(arg.hasOwnProperty("FieldDataStep")) _input.attr("step",arg.FieldDataStep);
    if(arg.hasOwnProperty("FieldDataMin")) _input.attr("min",arg.FieldDataMin);
    if(arg.hasOwnProperty("FieldDataMax")) _input.attr("max",arg.FieldDataMax);

    group_container.append(_input)

    var current =$("<input/>").addClass("form-control").attr("type","numeric").attr("id","currentValue");
    if(arg.hasOwnProperty("FieldDataStep")) current.attr("step",arg.FieldDataStep);
    
    group_container.append(current);

    $(_input).on("change",function(){
        $(current).val($(this).val());
    })

    $(current).on("change",function(){
        $(_input).val($(this).val());
    })

    $(_input).on("input",function(){
        $(current).val($(this).val());
    })

    if(arg.hasOwnProperty("FieldUnit")){
        var unit = $("<span/>").addClass("input-group-text w-25");  
        unit.html(arg.FieldUnit);
        group_container.append(unit);
    }

    container.append(_label);
    container.append($("<div/>").addClass("col-md-8").append(group_container));

}

function addInputField(container, name,label,required, datatype, arg){
    var legit_data_types = ["text","longtext","date","time","datetime","numeric","range"];
    if(!legit_data_types.includes(datatype))
        throw new Error('Custom "input" field "'+ name + '" has invalid data type "'+ datatype +'".');

    if(datatype=="text")  eventTextInput(container,name,label);
    else if(datatype=="longtext")  eventLongTextInput(container,name,label);
    else if(datatype=="date")  eventDateInput(container,name,label);
    else if(datatype=="time")  eventTimeInput(container,name,label);
    else if(datatype=="datetime")  eventDatetimeInput(container,name,label);
    else if(datatype=="numeric")  eventNumericInput(container,name,label,arg);
    else if(datatype=="range")  eventRangeInput(container,name,label,arg);
    
    if(required) container.find("[name="+name+"]").prop('required',true).addClass("border border-2 border-dark");
}


function eventLocationSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-4 col-form-label").html(label);
    var _select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name);
    _select_dropdow.append($("<option/>").html("Choose location...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    showAllDefs(_select_dropdow,"location_definitions","LocationName","LocationName");

    container.append(_label);
    container.append($("<div/>").addClass("col-md-8").append(_select_dropdow));
}

function eventBodypartSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-4 col-form-label").html(label);
    
    var side_select_div  = $("<div/>").addClass("col-md-4");
    var _select_1 = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select");
    _select_1.append($("<option/>").html("Choose side...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    showAllDefs(_select_1,"side_definitions","SideID","SideName");
    side_select_div.append(_select_1)

    var bodpart_select_div = $("<div/>").addClass("col-md-4");
    var _select_2 = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name);
    _select_2.append($("<option/>").html("Choose bodypart...").prop('selected',true).attr("disabled","disabled").attr("value","").attr("required","true"));
    showAllDefs(_select_2,"bodypart_definitions","BodypartName","BodypartName");
    bodpart_select_div.append(_select_2);
    
    connectSelectByAttr(side_select_div,bodpart_select_div, "bodypart_definitions","BodypartSide", "SideID", "BodypartName");

    container.append(_label);
    container.append(side_select_div);
    container.append(bodpart_select_div);
}


function eventConsumableSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-4 col-form-label").html(label);
    
    var constype_select_div  = $("<div/>").addClass("col-md-4");
    var _select_1 = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select");
    _select_1.append($("<option/>").html("Choose consumable type...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    showAllDefs(_select_1,"consumable_type_definitions","ConsumableTypeID","ConsumableTypeName");
    constype_select_div.append(_select_1)

    var cons_select_div = $("<div/>").addClass("col-md-4");
    var _select_2 = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name);
    _select_2.append($("<option/>").html("Choose consumable...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    showAllDefs(_select_2,"consumable_definitions","ConsumableName","ConsumableName");
    cons_select_div.append(_select_2);
    
    connectSelectByAttr(constype_select_div,cons_select_div, "consumable_definitions","ConsumableType", "ConsumableTypeID", "ConsumableName");

    container.append(_label);
    container.append(constype_select_div);
    container.append(cons_select_div);

}

function eventAssetSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-4 col-form-label").html(label);
    var _select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name);
    _select_dropdow.append($("<option/>").html("Choose asset...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    showAllDefs(_select_dropdow,"asset_definitions","AssetID","AssetName");

    container.append(_label);
    container.append($("<div/>").addClass("col-md-8").append(_select_dropdow));

}

function addSelectField(container, name, label, required, data_source_name){
    var legit_data_source_names = ["location","bodypart","consumable","asset"];
    if(!legit_data_source_names.includes(data_source_name))
        throw new Error('Custom "select" field "'+ name + '" has invalid data source "'+ data_source_name +'".');

    container.attr("id",name+"SelectGroup");

    if(data_source_name=="location")  eventLocationSelect(container,name,label);
    else if(data_source_name=="bodypart")  eventBodypartSelect(container,name,label);
    else if(data_source_name=="consumable")  eventConsumableSelect(container,name,label);
    else if(data_source_name=="asset")  eventAssetSelect(container,name,label);
    
    if(required) container.find("[name="+name+"]").prop('required',true).addClass("border border-2 border-dark");
}


function showCustomArgs(container,custom_args){
    container.empty();
    var content = $("<div/>");
    $.each(custom_args,function(index,arg){
        var arg_row = $("<div/>").addClass("row mb-2 event-custom-field");
        try {
            // console.log(arg);
            var name = arg.FieldName;
            var label = arg.FieldLabel;
            var object_type = arg.FieldType;
            var required = arg.FieldRequired;

            if(object_type=="input"){
                if(!arg.hasOwnProperty('FieldDataType')) 
                    throw new Error('Custom "input" field "'+ JSON.stringify(arg) + '" has no "FieldDataType".');
                addInputField(arg_row,name,label,required, arg.FieldDataType, arg);
            }
            else if(object_type=="select"){
                if(!arg.hasOwnProperty('FieldSource')) 
                    throw new Error('Custom "select" field "'+ JSON.stringify(arg) + '" has no "FieldSource".');
                addSelectField(arg_row,name,label,required, arg.FieldSource);
                
            }
            content.append(arg_row);
        } catch (error) {
            console.log(error);
        }
        
    })
    container.append(content);
}