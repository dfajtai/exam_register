
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

function dynamicTextInput(container,name,label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Input").html(label);
    var _input = $("<input/>").addClass("form-control").attr("type","text").attr("id",name+"Input").attr("name",name).attr("data-name",name).attr("data-label",label);

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(_input));
}

function dynamicLongTextInput(container,name,label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Input").html(label);
    var _input = $("<textarea/>").addClass("form-control").attr("type","text").attr("id",name+"Input").attr("name",name).attr("data-name",name).attr("data-label",label).attr("rows",5);

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(_input));
}

function dynamicDateInput(container,name,label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Input").html(label);

    var group_container = $("<div/>").addClass("d-flex flex-xl-row flex-column justify-content-evenly");

    var part_1 = $("<div/>").addClass("input-group d-flex flex-fill mb-xl-0 mb-1 me-xl-2");
    var part_2 = $("<div/>").addClass("input-group d-flex flex-fill");

    group_container.append(part_1);
    group_container.append(part_2);

    var current = $("<span/>").addClass("input-group-text flex-grow-1").attr("id","currentTime");
    part_1.append(current);

    var fa_span =$("<i/>").addClass("fa fa-arrow-right update-date");
    part_1.append($("<span/>").addClass("btn-outline-dark btn update-date").append(fa_span));


    var _input = $("<input/>").addClass("form-control flex-grow-1").attr("type","date").attr("id",name+"Input").attr("name",name).attr("data-name",name).attr("data-label",label);

    _input.val(moment().format("YYYY-MM-DD"));
    part_2.append(_input)

    var clear_span =$("<span/>").addClass("fa fa-x clear-datetime");
    part_2.append($("<i/>").addClass("btn-outline-dark btn clear-datetime").append(clear_span));

    current.html(moment().format("YYYY-MM-DD"));

    group_container.find(".update-date").on("click", function (){
        $(_input).val(current.html());
    });

    group_container.find(".clear-datetime").on("click", function (){
        $(_input).val(null);
    });

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(group_container));

}

function dynamicTimeInput(container,name,label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Input").html(label);

    var group_container = $("<div/>").addClass("d-flex flex-xl-row flex-column justify-content-evenly");

    var part_1 = $("<div/>").addClass("input-group d-flex flex-fill mb-xl-0 mb-1 me-xl-2");
    var part_2 = $("<div/>").addClass("input-group d-flex flex-fill");

    group_container.append(part_1);
    group_container.append(part_2);

    var current = $("<span/>").addClass("input-group-text flex-grow-1").attr("id","currentTime");
    part_1.append(current);

    var fa_span =$("<span/>").addClass("fa fa-arrow-right update-date");
    part_1.append($("<i/>").addClass("btn-outline-dark btn update-date").append(fa_span));
    var _input = $("<input/>").addClass("form-control flex-grow-1").attr("type","time").attr("id",name+"Input").attr("name",name).attr("data-name",name).attr("data-label",label).attr("step","1");

    _input.val(moment().format("HH:mm:ss"));
    part_2.append(_input);

    var clear_span =$("<span/>").addClass("fa fa-x clear-datetime");
    part_2.append($("<i/>").addClass("btn-outline-dark btn clear-datetime").append(clear_span));

    current.html(moment().format("HH:mm:ss"));
    setInterval(function(){current.html(moment().format("HH:mm:ss"));},1000);

    group_container.find(".update-date").on("click", function (){
        $(_input).val(current.html());
    });

    group_container.find(".clear-datetime").on("click", function (){
        $(_input).val(null);
    });

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(group_container));
}

function dynamicDatetimeInput(container,name,label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Input").html(label);

    var group_container = $("<div/>").addClass("d-flex flex-xl-row flex-column justify-content-evenly");

    var part_1 = $("<div/>").addClass("input-group d-flex flex-fill mb-xl-0 mb-1 me-xl-2");
    var part_2 = $("<div/>").addClass("input-group d-flex flex-fill");

    group_container.append(part_1);
    group_container.append(part_2);

    var current = $("<div/>").addClass("input-group-text flex-grow-1").attr("id","currentDateTime");
    part_1.append(current);

    var fa_span =$("<span/>").addClass("fa fa-arrow-right update-datetime");
    part_1.append($("<div/>").addClass("btn-outline-dark btn update-datetime").append(fa_span));
        
    var _input = $("<input/>").addClass("form-control flex-grow-1").attr("type","datetime-local").attr("id",name+"Input").attr("name",name).attr("data-name",name).attr("data-label",label).attr("step","1");

    // _input.val(moment().format("YYYY-MM-DD HH:mm:ss"));
    part_2.append(_input)

    var clear_span =$("<span/>").addClass("fa fa-x clear-datetime");
    part_2.append($("<i/>").addClass("btn-outline-dark btn clear-datetime").append(clear_span));
    

    current.html(moment().format("YYYY-MM-DD HH:mm:ss"));
    setInterval(function(){current.html(moment().format("YYYY-MM-DD HH:mm:ss"));},1000);

    group_container.find(".update-datetime").on("click", function (){
        $(_input).val(current.html());
    });

    group_container.find(".clear-datetime").on("click", function (){
        $(_input).val(null);
    });

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(group_container));
}

function dynamicNumericInput(container,name,label,arg){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Input").html(label);

    var group_container = $("<div/>").addClass("input-group");
    
    var _input = $("<input/>").addClass("form-control").attr("type","numeric").attr("id",name+"Input").attr("name",name).attr("data-name",name).attr("data-label",label);
    if(arg.hasOwnProperty("FieldDataStep")) _input.attr("step",arg.FieldDataStep);

    group_container.append(_input)

    if(arg.hasOwnProperty("FieldUnit")){
        var unit = $("<span/>").addClass("input-group-text w-25");  
        unit.html(arg.FieldUnit);
        group_container.append(unit);
    }

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(group_container));
}

function dynamicRangeInput(container,name,label,arg){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Input").html(label);

    var group_container = $("<div/>").addClass("input-group");
    
    var _input = $("<input/>").addClass("form-control form-range w-50 mt-2 me-2");
    _input.attr("type","range").attr("id",name+"Input").attr("name",name).attr("data-name",name).attr("data-label",label);
    $(_input).attr("data-value","");
    if(arg.hasOwnProperty("FieldDataStep")) _input.attr("step",arg.FieldDataStep);
    if(arg.hasOwnProperty("FieldDataMin")) _input.attr("min",arg.FieldDataMin);
    if(arg.hasOwnProperty("FieldDataMax")) _input.attr("max",arg.FieldDataMax);

    group_container.append(_input)

    var current =$("<input/>").addClass("form-control").attr("type","numeric").attr("id","currentValue");
    if(arg.hasOwnProperty("FieldDataStep")) current.attr("step",arg.FieldDataStep);
    
    group_container.append(current);

    $(_input).on("change",function(){
        $(current).val($(this).val());
        $(this).prop("data-value",$(this).val());
    })

    $(current).on("change",function(){
        $(_input).val($(this).val());
        $(_input).prop("data-value",$(this).val());
    })

    $(_input).on("input",function(){
        $(current).val($(this).val());
        $(this).prop("data-value",$(this).val());
    })

    if(arg.hasOwnProperty("FieldUnit")){
        var unit = $("<span/>").addClass("input-group-text w-25");  
        unit.html(arg.FieldUnit);
        group_container.append(unit);
    }

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(group_container));

}

function addDynamicInputField(container, name,label,required, datatype, arg, default_value){
    var legit_data_types = ["text","longtext","date","time","datetime","numeric","range"];
    if(!legit_data_types.includes(datatype))
        throw new Error('Custom "input" field "'+ name + '" has invalid data type "'+ datatype +'".');

    
    switch (datatype) {
      case "longtext": {
        dynamicLongTextInput(container, name, label);
        break;
      }
      case "date": {
        dynamicDateInput(container, name, label);
        break;
      }
      case "time": {
        dynamicTimeInput(container, name, label);
        break;
      }
      case "datetime": {
        dynamicDatetimeInput(container, name, label);
        break;
      }
      case "numeric": {
        dynamicNumericInput(container, name, label, arg);
        break;
      }
      case "range": {
        dynamicRangeInput(container, name, label, arg);
        break;
      }
      case "text": {
        dynamicTextInput(container, name, label);
        break;
      }
      default: {
        dynamicTextInput(container, name, label);
        break;
      }
    }

    
    if(required) {
        container.find("[name='"+name+"']").prop('required',true).addClass("data-required-style data-required");
        if(datatype=="range"){
            $(container.find("[name='"+name+"']")).get(0).setCustomValidity('Please fill out this field.');

            $(container.find("[name='"+name+"']")).on("change",function(){
                $(this).get(0).setCustomValidity("");
            })
        }
    }

    if(default_value!=null) {
        container.find("[name='"+name+"']").val(default_value).trigger("change");
        // console.log(name + " initialized with default value " + default_value);
    }
}


function dynamicLocationSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Select").html(label);
    var _select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name).attr("data-name",name).attr("data-label",label);
    _select_dropdow.append($("<option/>").html("Choose location...").prop('selected',true).attr("value",""));
    showAllDefs(_select_dropdow,"location_definitions","LocationID","LocationName","LocationName");

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(_select_dropdow));
}

function dynamicBodypartSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Select").html(label);

    container.addClass("d-flex");
    
    var side_select_div  = $("<div/>").addClass("col-md-4 d-none d-xl-block");
    var _select_1 = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select");
    _select_1.append($("<option/>").html("Choose side...").prop('selected',true).attr("value",""));
    showAllDefs(_select_1,"side_definitions","SideID","SideName","SideName");
    side_select_div.append(_select_1)

    var bodpart_select_div = $("<div/>").addClass("col-md-5 flex-fill");
    var _select_2 = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name).attr("data-name",name).attr("data-label",label);
    _select_2.append($("<option/>").html("Choose bodypart...").prop('selected',true).attr("value",""));
    showAllDefs(_select_2,"bodypart_definitions","BodypartName","BodypartName","BodypartName");
    bodpart_select_div.append(_select_2);
    
    connectSelectByAttr(side_select_div,bodpart_select_div, "bodypart_definitions","BodypartSide", "SideID", "BodypartName");

    container.append(_label);
    container.append(side_select_div);
    container.append(bodpart_select_div);
}


function dynamicConsumableSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Select").html(label);
    
    container.addClass("d-flex");

    var constype_select_div  = $("<div/>").addClass("col-md-4 d-none d-xl-block");
    var _select_1 = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select");
    _select_1.append($("<option/>").html("Choose consumable type...").prop('selected',true).attr("value",""));
    showAllDefs(_select_1,"consumable_type_definitions","ConsumableTypeID","ConsumableTypeName","ConsumableTypeName");
    constype_select_div.append(_select_1)

    var cons_select_div = $("<div/>").addClass("col-md-5 flex-fill");
    var _select_2 = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name).attr("data-name",name).attr("data-label",label);
    _select_2.append($("<option/>").html("Choose consumable...").prop('selected',true).attr("value",""));
    showAllDefs(_select_2,"consumable_definitions","ConsumableName","ConsumableName","ConsumableName");
    cons_select_div.append(_select_2);
    
    connectSelectByAttr(constype_select_div,cons_select_div, "consumable_definitions","ConsumableType", "ConsumableTypeID", "ConsumableName");

    container.append(_label);
    container.append(constype_select_div);
    container.append(cons_select_div);

}

function dynamicEventSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Select").html(label);

    container.addClass("d-flex");
    
    var type_select_div  = $("<div/>").addClass("col-md-4 d-none d-xl-block");
    var _select_1 = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select");
    _select_1.append($("<option/>").html("Choose event type...").prop('selected',true).attr("value",""));
    showAllDefs(_select_1,"event_type_definitions","EventTypeID","EventTypeName","EventTypeName");
    type_select_div.append(_select_1)

    var event_select_div = $("<div/>").addClass("col-md-5 flex-fill");
    var _select_2 = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name).attr("data-name",name).attr("data-label",label);
    _select_2.append($("<option/>").html("Choose event...").prop('selected',true).attr("value",""));
    showAllDefs(_select_2,"event_template_definitions","EventTemplateID","EventName","EventName");
    event_select_div.append(_select_2);
    
    connectSelectByAttr(type_select_div,event_select_div, "event_template_definitions","EventType", "EventTypeID", "EventTemplateID");

    container.append(_label);
    container.append(type_select_div);
    container.append(event_select_div);
}

function dynamicAssetSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Select").html(label);
    var _select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name).attr("data-name",name).attr("data-label",label);
    _select_dropdow.append($("<option/>").html("Choose asset...").prop('selected',true).attr("value",""));
    showAllDefs(_select_dropdow,"asset_definitions","AssetID","AssetName","AssetName");

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(_select_dropdow));
}

function dynamicConsumableTypeSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Select").html(label);
    var _select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name).attr("data-name",name).attr("data-label",label);
    _select_dropdow.append($("<option/>").html("Choose consumable type...").prop('selected',true).attr("value",""));
    showAllDefs(_select_dropdow,"consumable_type_definitions","ConsumableTypeID","ConsumableTypeName","ConsumableTypeName");

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(_select_dropdow));
}

function dynamicEventTypeSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Select").html(label);
    var _select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name).attr("data-name",name).attr("data-label",label);
    _select_dropdow.append($("<option/>").html("Choose event type...").prop('selected',true).attr("value",""));
    showAllDefs(_select_dropdow,"event_type_definitions","EventTypeID","EventTypeName","EventTypeName");

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(_select_dropdow));
}

function dynamicSideSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Select").html(label);
    var _select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name).attr("data-name",name).attr("data-label",label);
    _select_dropdow.append($("<option/>").html("Choose side...").prop('selected',true).attr("value",""));
    showAllDefs(_select_dropdow,"side_definitions","SideID","SideName","SideName");

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(_select_dropdow));
}

function dynamicUnitSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Select").html(label);
    var _select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name).attr("data-name",name).attr("data-label",label);
    _select_dropdow.append($("<option/>").html("Choose unit...").prop('selected',true).attr("value",""));
    showAllDefs(_select_dropdow,"unit_definitions","UnitID","UnitUnit","UnitUnit");

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(_select_dropdow));
}

function dynamicUnitTypeSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Select").html(label);
    var _select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name).attr("data-name",name).attr("data-label",label);
    _select_dropdow.append($("<option/>").html("Choose UnitType...").prop('selected',true).attr("value",""));
    showAllDefs(_select_dropdow,"unit_type_definitions","UnitTypeID","UnitTypeName","UnitTypeName");

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(_select_dropdow));
}

function dynamicStudySelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Select").html(label);
    var _select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name).attr("data-name",name).attr("data-label",label);
    _select_dropdow.append($("<option/>").html("Choose study...").prop('selected',true).attr("value",""));
    showAllDefs(_select_dropdow,"studies","StudyID","StudyName","StudyName");

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(_select_dropdow));

}

function dynamicSexSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Select").html(label);
    var _select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name).attr("data-name",name).attr("data-label",label);
    _select_dropdow.append($("<option/>").html("Choose sex...").prop('selected',true).attr("value",""));
    showAllDefs(_select_dropdow,"sex_definitions","SexID","SexName","SexName");

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(_select_dropdow));

}

function dynamicEventStatusSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Select").html(label);
    var _select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name).attr("data-name",name).attr("data-label",label);
    _select_dropdow.append($("<option/>").html("Choose event status...").prop('selected',true).attr("value",""));
    showAllDefs(_select_dropdow,"event_status_definitions","EventStatusID","EventStatusName","EventStatusName");

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(_select_dropdow));

}

function dynamicSubjectStatusSelect(container, name, label){
    var _label =  $("<label/>").addClass("col-md-3 col-form-label").attr("for",name+"Select").html(label);
    var _select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id",name+"Select").attr("name",name).attr("data-name",name).attr("data-label",label);
    _select_dropdow.append($("<option/>").html("Choose subject status...").prop('selected',true).attr("value",""));
    showAllDefs(_select_dropdow,"subject_status_definitions","StatusID","StatusName","StatusName");

    container.append(_label);
    container.append($("<div/>").addClass("col-md-9").append(_select_dropdow));

}

function addDynamicSelectField(container, name, label, required, data_source_name, default_value){
    var legit_data_source_names = ["location","bodypart","consumable","asset","sex",
    "subject_status","event","event_status","study","unit","unit_type","side","event_type","consumable_type"];
    if(!legit_data_source_names.includes(data_source_name))
        throw new Error('Custom "select" field "'+ name + '" has invalid data source "'+ data_source_name +'".');

    container.attr("id",name+"SelectGroup");

    switch (data_source_name) {
      case "location":
        dynamicLocationSelect(container, name, label);
        break;
      case "bodypart":
        dynamicBodypartSelect(container, name, label);
        break;

      case "consumable":
        dynamicConsumableSelect(container, name, label);
        break;
      case "consumable_type":
        dynamicConsumableTypeSelect(container, name, label);
        break;

      case "event":
        dynamicEventSelect(container, name, label);
        break;
      case "event_type":
        dynamicEventTypeSelect(container, name, label);
        break;

      case "side":
        dynamicSideSelect(container, name, label);
        break;
      case "unit":
        dynamicUnitSelect(container, name, label);
        break;
      case "unit_type":
        dynamicUnitTypeSelect(container, name, label);
        break;

      case "asset":
        dynamicAssetSelect(container, name, label);
        break;
      case "sex":
        dynamicSexSelect(container, name, label);
        break;
      case "subject_status":
        dynamicSubjectStatusSelect(container, name, label);
        break;
      case "event_status":
        dynamicEventStatusSelect(container, name, label);
        break;
      case "study":
        dynamicStudySelect(container, name, label);
        break;
    }
    
    if(required) container.find("[name='"+name+"']").prop('required',true).addClass("data-required-style data-required");
    if(default_value!=null) container.find("[name='"+name+"']").val(default_value).trigger("change");
}


function showCustomArgs(container,custom_args, flex = false){
    var content = $("<div/>");
    if(flex){
        content.addClass("d-flex flex-column flex-lg-row flex-lg-wrap justify-content-evenly");
    }

    $.each(custom_args,function(index,arg){
        var arg_row = $("<div/>").addClass("row mb-2 dynamic-field");
        if(flex){
            arg_row.addClass("w-lg-50");
            if(index%2==0){
                arg_row.addClass("me-lg-2");
            }
            else{
                arg_row.addClass("g-lg-0 ps-lg-2");
            }
        }
        
        try {
            var name = arg.FieldName;
            var label = arg.FieldLabel;
            var object_type = arg.FieldType;
            var required = arg.FieldRequired;

            var default_value = arg.hasOwnProperty("FieldDefaultValue")? parse_val(arg.FieldDefaultValue) : null;

            if(object_type=="input"){
                if(!arg.hasOwnProperty('FieldDataType')) 
                    throw new Error('Custom "input" field "'+ JSON.stringify(arg) + '" has no "FieldDataType".');
                addDynamicInputField(arg_row,name,label,required, arg.FieldDataType, arg,default_value);
            }
            else if(object_type=="select"){
                if(!arg.hasOwnProperty('FieldSource')) 
                    throw new Error('Custom "select" field "'+ JSON.stringify(arg) + '" has no "FieldSource".');
                addDynamicSelectField(arg_row,name,label,required, arg.FieldSource,default_value);
                
            }
            content.append(arg_row);
        } catch (error) {
            console.log(error);
        }
        
    })
    container.append(content);
}



function get_readable_value(container, field_name, field_value){
    // returns the val() of a field with the given name - or its 'data-readable' tag if it is exists
    var res = null;

    var field_element = $(container).find("[name='"+field_name+"']")[0];

    var data_value_element = $(field_element).find("[data-value]");

    // retrieve the 'readable' child element (with the selected value)
    var readable_element = $(field_element).find("[data-readable][value='"+field_value+"']");
    if(readable_element.length==0){
        if(data_value_element.length>0){
            var data_value = $(data_value_element[0]).prop("data-value");
            res = parse_val(data_value==""?null:data_value);
        }
        else{
            res = parse_val(field_value==""?null:field_value);
        }
    }
    else{
        res = parse_val($(readable_element[0]).attr("data-readable"));
    }

    return res;
}

function set_with_value(element, value){
    // sets the val() of an element - but first searches for child elements with 'data-readable' tag

    var val = value;

    var readable_element = $(element).find("[data-readable='"+value+"']");
    if(readable_element.length>0){
        val = $(readable_element[0]).val();
    }

    $(element).val(val);
}