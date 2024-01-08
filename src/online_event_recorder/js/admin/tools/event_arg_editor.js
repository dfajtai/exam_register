var eventarg_table_id = "fieldDefTable";
var eventarg_content = {};
var eventarg_content_name = "";
var eventarg_lock_list = []

window.eventDefOperateEvents = {
    'click .move_up': function (e, value, row, index) {
        if(index==0){
            return
        }
        var data = $('#'+eventarg_table_id).bootstrapTable('getData');
        var upper_data = {... data[index-1]};
        upper_data.state = upper_data.state===undefined ? false : upper_data.state;
        $('#'+eventarg_table_id).bootstrapTable('updateRow',{index:index-1,row:row});
        $('#'+eventarg_table_id).bootstrapTable('updateRow',{index:index, row:upper_data});
    },
    'click .move_down': function (e, value, row, index) {
        var data = $('#'+eventarg_table_id).bootstrapTable('getData');
        if(index==data.length-1){
            return
        }
        var lower_data = {... data[index+1]};
        lower_data.state = lower_data.state === undefined ? false : lower_data.state;
        $('#'+eventarg_table_id).bootstrapTable('updateRow',{index:index+1,row:row});
        $('#'+eventarg_table_id).bootstrapTable('updateRow',{index:index, row:lower_data});
    },
    'click .edit': function (e, value, row, index) {
        showArgEditorEditForm(eventarg_content,"edit_form", $('#'+eventarg_table_id),index);
        eventarg_content_name = "edit";
        $( document ).trigger( "_lock", [ "edit"] );
    },
    'click .remove': function (e, value, row, index) {
        bootbox.confirm({
            message: 'You are going to the selected row: [name = "'+ row["FieldName"] +'"].<br>Do you want to proceed?',
            buttons: {
            confirm: {
            label: 'Yes',
            className: 'btn-outline-danger'
            },
            cancel: {
            label: 'No',
            className: 'btn-outline-success'
            }
            },
            callback: function (result) {
                if(result){
                    $('#'+eventarg_table_id).bootstrapTable('remove', {
                        field: '$index',
                        values: [index]
                        });
                    statusToStorage("eventArgEditorHistory",JSON.stringify($('#'+eventarg_table_id).bootstrapTable('getData')));
                }
            }
            });
    }
}

function eventOperateFormatter(value, row, index) {
    var container = $("<div/>").addClass("lockable");
    var up_down_gorup = $("<div/>").addClass("btn-group me-3 ");
    var btn_up = $("<button/>").attr("type","button").addClass("btn btn-outline-secondary btn-sm move_up lockable").append($("<i/>").addClass("fa fa-angle-up"));
    var btn_down = $("<button/>").attr("type","button").addClass("btn btn-outline-secondary btn-sm move_down lockable").append($("<i/>").addClass("fa fa-angle-down"));
    btn_up.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Move up");
    btn_down.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Move down");

    up_down_gorup.append(btn_up)
    up_down_gorup.append(btn_down)
    container.append(up_down_gorup);

    var btn_edit = $("<button/>").addClass("btn btn-outline-primary btn-sm edit me-2 lockable").append($("<i/>").addClass("fa fa-edit"));
    var btn_remove = $("<button/>").addClass("btn btn-outline-danger btn-sm remove lockable").append($("<i/>").addClass("fa fa-trash"))
    btn_edit.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Edit");
    btn_remove.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Remove");
    
    container.append(btn_edit)
    container.append(btn_remove)

    
    if (index==0){
        btn_up.addClass("disabled").removeClass("lockable");
    }
    if(index==$('#'+eventarg_table_id).bootstrapTable('getData').length-1){
        btn_down.addClass("disabled").removeClass("lockable");
    }

    if(eventarg_lock_list.length>0){
        container.find("button").addClass("disabled");
    }

    return container.prop("outerHTML");
}


function createFieldsTable(container, table_id, height){
    // var table_with_controls = $("<div/>");

   
    var table = $("<table/>").attr("id",table_id);

    var toolbar = $("<div/>").attr("id",table_id+"_toolbar");
    toolbar.append($("<button/>").attr("id","toolbar_add").addClass("btn btn-success admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-plus me-2").attr("aria-hidden","true")).append("Add New"));
    // toolbar.append($("<button/>").attr("id","toolbar_edit").addClass("btn btn-primary admin-table-toolbar-btn needs-select").html($("<i/>").addClass("fa fa-pen-to-square").attr("aria-hidden","true")).append(" Edit Selected"));
    toolbar.append($("<button/>").attr("id","toolbar_duplicate").addClass("btn btn-primary admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-solid fa-copy me-2").attr("aria-hidden","true")).append("Duplicate Selected"));
    toolbar.append($("<button/>").attr("id","toolbar_removeSelected").addClass("btn btn-danger admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-trash fa-solid me-2").attr("aria-hidden","true")).append("Remove Selected"));
    toolbar.append($("<button/>").attr("id","toolbar_loadJSON").addClass("btn btn-outline-success admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-file-import fa-solid me-2").attr("aria-hidden","true")).append("Load JSON"));
    toolbar.append($("<button/>").attr("id","toolbar_createJSON").addClass("btn btn-outline-success admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-code fa-solid me-2").attr("aria-hidden","true")).append("Generate JSON"));
    toolbar.append($("<button/>").attr("id","toolbar_previewForm").addClass("btn btn-outline-success admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-eye fa-solid me-2").attr("aria-hidden","true")).append("Preview"));

    table.attr("data-height",String(height));

    table.attr("data-toolbar","#"+table_id+"_toolbar");
    table.attr("data-toolbar-align","left");
    

    table.attr("data-pagination","false");
    table.attr("data-show-pagination-switch","false");
    table.attr("data-page-list","[10, 25, 50, 100, all]");

    table.attr("data-show-footer","false");

    table.attr("data-search","true");
    table.attr("data-visible-search","true");
    table.attr("data-search-highlight","true");
    table.attr("data-show-search-clear-button","true");

    table.attr("data-maintain-meta-data","true");

    table.attr("data-detail-view","true");

    table.attr("data-locale","hu-HU");

    table.attr("data-click-to-select","true");
    table.attr("data-single-select","false");
    table.attr("data-multiple-select-row","false");

    table.attr("data-sort-reset","true");

    var table_container = $("<div/>").addClass("row mt-2")
    table_container.append(table);
    table_container.append(toolbar);
    container.append(table_container)

    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: '', field: 'operate', align: 'center', sortable:false, searchable:false, clickToSelect : false,
                events: window.eventDefOperateEvents, formatter: eventOperateFormatter},
                {title: 'Name', field : 'FieldName', align:'center', sortable:true, searchable:true},
                {title: 'Label', field : 'FieldLabel', align:'center', sortable:true, searchable:true},
                {title: 'Type', field : 'FieldType', align:'center', sortable:true, searchable:true},
                {title: 'Unit', field : 'FieldUnit', align:'center', sortable:true, searchable:true},
                {title: 'Source', field : 'FieldSource', align:'center', sortable:true, searchable:true},
                {title: 'Required', field : 'FieldRequired', align:'center', sortable:true, searchable:true},
            ],
            pagination:true,
            checkboxHeader:true,
            smartDisplay:true,
            detailFormatter:simpleFlatFormatter
        });
    
}


function selectFormFields(container){
    container.empty();

    var defSelectGroup = $("<div/>").addClass("col-md-12");
    defSelectGroup.append($("<label/>").addClass("form-label").attr("for","selectDataSource").html("Data Source"));
    var def_select_dropdow = $("<select/>").addClass("form-select required").attr("type","text").attr("id","selectDataSource").attr("name","FieldSource").prop('required',true);
    def_select_dropdow.append($("<option/>").html("Choose Field Data Source...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    def_select_dropdow.append($("<option/>").html("Location").attr("value","location"));
    def_select_dropdow.append($("<option/>").html("Bodypart").attr("value","bodypart"));
    // def_select_dropdow.append($("<option/>").html("Side").attr("value","side"));
    def_select_dropdow.append($("<option/>").html("Consumable").attr("value","consumable"));
    def_select_dropdow.append($("<option/>").html("Asset").attr("value","asset"));
    defSelectGroup.append(def_select_dropdow)
    
    container.append(defSelectGroup);
}


function inputFormFields(container){
    container.empty();
    
    var dtypeSelectGroup = $("<div/>").addClass("col-md-3");
    dtypeSelectGroup.append($("<label/>").addClass("form-label").attr("for","dtypeSelect").html("Field Data Type"));

    var dtype_dropdown = $("<select/>").addClass("form-select required").attr("type","text").attr("id","dtypeSelect").attr("name","FieldDataType").prop('required',true);
    dtype_dropdown.append($("<option/>").html("Choose Field Data Type...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    dtype_dropdown.append($("<option/>").html("text").attr("value","text"));
    dtype_dropdown.append($("<option/>").html("longtext").attr("value","longtext"));
    dtype_dropdown.append($("<option/>").html("date").attr("value","date"));
    dtype_dropdown.append($("<option/>").html("time").attr("value","time"));
    dtype_dropdown.append($("<option/>").html("datetime").attr("value","datetime"));
    dtype_dropdown.append($("<option/>").html("numeric").attr("value","numeric"));
    dtype_dropdown.append($("<option/>").html("range").attr("value","range"));

    dtypeSelectGroup.append(dtype_dropdown);

    container.append(dtypeSelectGroup);


    var dtypeNumericGroup = $("<div/>").addClass("row col-md-9").attr("id","numericParamGroup");
    container.append(dtypeNumericGroup);
    

    dtypeSelectGroup.find("select").change(function(){


        if(this.value=="numeric"){
            dtypeNumericGroup.empty();
            var _step = $("<div/>").addClass("col-md-4");
            _step.append($("<label/>").addClass("form-label").attr("for","dtypeStepInput").html("Field Step"));
            _step.append($("<input/>").addClass("form-control").attr("type","numeric").attr("step","0.0001").attr("id","dtypeStepInput").attr("name","FieldDataStep").prop('required',true).attr("placeholder","e.g. 1, 0.1, 0.01, ..."));
            dtypeNumericGroup.append(_step);

            var _unitType = $("<div/>").addClass("col-md-4");
            _unitType.append($("<label/>").addClass("form-label").attr("for","unitTypeSelect").html("Field Unit Type"));
            var type_select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id","unitTypeSelect");
            type_select_dropdow.append($("<option/>").html("Choose Unit Type...").prop('selected',true).attr("disabled","disabled").attr("value",""));
            showAllDefs(type_select_dropdow,"unit_type_definitions","UnitTypeID","UnitTypeName");
            _unitType.append(type_select_dropdow);
            dtypeNumericGroup.append(_unitType);

            var _unit = $("<div/>").addClass("col-md-4");
            _unit.append($("<label/>").addClass("form-label").attr("for","unitSelect").html("Field Unit"));
            var unit_select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id","unitSelect").attr("name","FieldUnit").prop('required',true);;
            unit_select_dropdow.append($("<option/>").html("Choose Unit...").prop('selected',true).attr("disabled","disabled").attr("value",""));
            showAllDefs(unit_select_dropdow,"unit_definitions","UnitUnit","UnitUnit");
            _unit.append(unit_select_dropdow);
            dtypeNumericGroup.append(_unit);

            connectSelectByAttr(_unitType,_unit, "unit_definitions","UnitType", "UnitTypeID", "UnitID");

        }
        else if(this.value=="range"){
            dtypeNumericGroup.empty();
            var _step = $("<div/>").addClass("col-md-2");
            _step.append($("<label/>").addClass("form-label").attr("for","dtypeStepInput").html("Field Step"));
            _step.append($("<input/>").addClass("form-control").attr("type","numeric").attr("step","0.0001").attr("id","dtypeStepInput").attr("name","FieldDataStep").attr("placeholder","e.g. 1, 0.1, 0.01, ..."));
            dtypeNumericGroup.append(_step);

            var _min = $("<div/>").addClass("col-md-2");
            _min.append($("<label/>").addClass("form-label").attr("for","dtypeMinInput").html("Field Min"));
            _min.append($("<input/>").addClass("form-control").attr("type","numeric").attr("step","0.0001").attr("id","dtypeMinInput").attr("name","FieldDataMin").prop('required',true).attr("placeholder","e.g. 0, ..."));
            dtypeNumericGroup.append(_min);

            var _max = $("<div/>").addClass("col-md-2");
            _max.append($("<label/>").addClass("form-label").attr("for","dtypeMaxInput").html("Field Max"));
            _max.append($("<input/>").addClass("form-control").attr("type","numeric").attr("step","0.0001").attr("id","dtypeMaxInput").attr("name","FieldDataMax").prop('required',true).attr("placeholder","e.g. 100, ..."));
            dtypeNumericGroup.append(_max);

            var _unitType = $("<div/>").addClass("col-md-3");
            _unitType.append($("<label/>").addClass("form-label").attr("for","unitTypeSelect").html("Field Unit Type"));
            var type_select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id","unitTypeSelect");
            type_select_dropdow.append($("<option/>").html("Choose Unit Type...").prop('selected',true).attr("disabled","disabled").attr("value",""));
            showAllDefs(type_select_dropdow,"unit_type_definitions","UnitTypeID","UnitTypeName");
            _unitType.append(type_select_dropdow);
            dtypeNumericGroup.append(_unitType);

            var _unit = $("<div/>").addClass("col-md-3");
            _unit.append($("<label/>").addClass("form-label").attr("for","unitSelect").html("Field Unit"));
            var unit_select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id","unitSelect").attr("name","FieldUnit");
            unit_select_dropdow.append($("<option/>").html("Choose Unit...").prop('selected',true).attr("disabled","disabled").attr("value",""));
            showAllDefs(unit_select_dropdow,"unit_definitions","UnitUnit","UnitUnit");
            _unit.append(unit_select_dropdow);
            dtypeNumericGroup.append(_unit);

            connectSelectByAttr(_unitType,_unit, "unit_definitions", "UnitType", "UnitTypeID", "UnitID");
        }
        else{
            dtypeNumericGroup.empty();
        }
    })    
}


function showArgEditorAddForm(container,form_id, table){
    container.empty();

    var form = $("<form/>").attr("id",form_id).addClass("needs-validation mb-3 pb-3 shadow container");

    var form_header= $("<div/>").addClass("row p-2 bg-dark text-white mb-3").attr("id","formTitle");
    
    form_header.append($("<div/>").addClass("col-md-11 fs-4").html("Field Configuration"));
    form_header.append($("<div/>").addClass("col-md-1 float-end").append($("<i/>").addClass("btn-close btn-close-white fs-4 float-end")));


    var nameForm = $("<div/>").addClass("row mb-2");
    var nameGroup = $("<div/>").addClass("col-md-4");
    nameGroup.append($("<label/>").addClass("form-label").attr("for","name").html("Field Name"));
    nameGroup.append($("<input/>").addClass("form-control").attr("type","text").attr("id","name").attr("name","FieldName").prop('required',true).attr("placeholder","Field name in database."));
    var labelGroup = $("<div/>").addClass("col-md-4");
    labelGroup.append($("<label/>").addClass("form-label").attr("for","label").html("Field Label"));
    labelGroup.append($("<input/>").addClass("form-control").attr("type","text").attr("id","label").attr("name","FieldLabel").prop('required',true).attr("placeholder","Field label in visualization."));

    var typeGroup = $("<div/>").addClass("col-md-4");
    typeGroup.append($("<label/>").addClass("form-label").attr("for","typeRadios").html("Field Type"));
    var inlineRadio = $("<div/>").attr("id","typeRadios");
    var inputGroup = $("<div/>").addClass("form-check form-check-inline");
    inputGroup.append($("<input/>").addClass("form-check-input").attr("type","radio").attr("id","inputRadio").attr("name","FieldType").prop('required',true).attr("value","input"));
    inputGroup.append($("<label/>").addClass("form-check-label").attr("for","inputRadio").html("Input field"));
    var selectGroup = $("<div/>").addClass("form-check form-check-inline");
    selectGroup.append($("<input/>").addClass("form-check-input").attr("type","radio").attr("id","selectRadio").attr("name","FieldType").prop('required',true).attr("value","select"));
    selectGroup.append($("<label/>").addClass("form-check-label").attr("for","selectRadio").html("Select field"));

    var requiredGroup = $("<div/>").addClass("form-check form-check-inline");
    requiredGroup.append($("<input/>").addClass("form-check-input").attr("type","checkbox").attr("id","requiredCheckbox").attr("name","FieldRequired").attr("value","true"));
    requiredGroup.append($("<label/>").addClass("form-check-label").attr("for","requiredCheckbox").html("Required"));

    inlineRadio.append(inputGroup);
    inlineRadio.append(selectGroup);
    inlineRadio.append(requiredGroup);

    typeGroup.append(inlineRadio);   

    nameForm.append(nameGroup);
    nameForm.append(labelGroup);
    nameForm.append(typeGroup);

    

    var additionalForm = $("<div/>").addClass("row mb-2");

    inlineRadio.find("input[type=radio]").change(function(){
        // console.log(this.value + " : " + this.checked);
        if(this.value=="select"){
            selectFormFields(additionalForm);
        }
        else{
            inputFormFields(additionalForm);
        }
    })


    form.append(form_header);
    form.append(nameForm);
    form.append(additionalForm);
    
    var submitButton = $("<button/>").addClass("btn btn-outline-primary col-md-12").attr("id","submitBtn").attr("type","submit").html("Add as new field");

    form.append(submitButton);

    form.on('submit',function(e){
        e.preventDefault();
        var newFieldInfo = {}
        form.find("input[type=text]").each(function(){
            newFieldInfo[$(this).attr("name")]= $(this).val();
        })
        form.find("input[type=numeric]").each(function(){
            newFieldInfo[$(this).attr("name")]= $(this).val();
        })
        form.find("select[name]").each(function(){
            if($(this).val()!=null) newFieldInfo[$(this).attr("name")]= $(this).val();
        })
        form.find("input[type=radio]:checked").each(function(){
            newFieldInfo[$(this).attr("name")]= $(this).val();
        })
        form.find("input[type=checkbox]").each(function(){
            newFieldInfo[$(this).attr("name")]= this.checked;
        })
        // console.log(newFieldInfo);

        if(newFieldInfo.FieldType == "input"){
            delete newFieldInfo.FieldSource;
        }
        else if(newFieldInfo.FieldType == "select"){
            delete newFieldInfo.FieldUnit;
            delete newFieldInfo.FieldDataType;
            delete newFieldInfo.FieldDataStep;
            delete newFieldInfo.FieldDataMin;
            delete newFieldInfo.FieldDataMax;
        }


        table.bootstrapTable("append",newFieldInfo);
        statusToStorage("eventArgEditorHistory",JSON.stringify(table.bootstrapTable('getData')));


        eventarg_content_name = "";
        $( document ).trigger( "_release", [ "add"] );
        container.empty();

    });

    form.find(".btn-close").on("click",function(){
        eventarg_content_name = "";
        $( document ).trigger( "_release", ["add"] );
        container.empty();
    })

    container.append(form);

}

function showArgEditorEditForm(container, form_id,  table, index){
    // container.empty();
    showArgEditorAddForm(container, form_id, table);

    var form = container.find("#"+form_id);

    if(index>table.bootstrapTable('getData').length){
        return
    }
    var entry = table.bootstrapTable('getData')[index];

    // TODO store inputs updated to prevent redundant update

    form.find("input[name][type!=radio]").each(function(){
        var name = $(this).attr("name");
        if(name in entry){
            $(this).val(entry[name]);
        }
    });

    if(entry.FieldType=="input"){
        form.find("input[type=radio][value=input]").prop("checked", true).trigger("change");
    }
    else if(entry.FieldType=="select"){
        form.find("input[type=radio][value=select]").prop("checked", true).trigger("change");
    }

    form.find("#requiredCheckbox").prop("checked",entry.FieldRequired);

    form.find("select[name]").each(function(){
        var name = $(this).attr("name");
        if(name in entry){
            $(this).val(entry[name]);
        }
        $(this).trigger("change");
    });
    // re-fill input (step)
    
    form.find("input[name][type!=radio]").each(function(){
        var name = $(this).attr("name");
        if(name in entry){
            $(this).val(entry[name]);
        }
    });
    form.find("select[name]").each(function(){
        var name = $(this).attr("name");
        if(name in entry){
            $(this).val(entry[name]);
        }
    });


    form.find("#submitBtn").each(function(){
        $(this).html("Alter selected field");
    });

    form.off("submit").on('submit',function(e){
        e.preventDefault();
        var newFieldInfo = {}
        form.find("input[type=text]").each(function(){
            newFieldInfo[$(this).attr("name")]= $(this).val();
        })
        form.find("input[type=numeric]").each(function(){
            newFieldInfo[$(this).attr("name")]= $(this).val();
        })
        form.find("select[name]").each(function(){
            if($(this).val()!=null) newFieldInfo[$(this).attr("name")]= $(this).val();
        })
        form.find("input[type=radio]:checked").each(function(){
            newFieldInfo[$(this).attr("name")]= $(this).val();
        })

        form.find("input[type=checkbox]").each(function(){
            newFieldInfo[$(this).attr("name")]= this.checked;
        })
        // console.log(newFieldInfo);

        if(newFieldInfo.FieldType == "input"){
            console.log("input");
            console.log(newFieldInfo);
            newFieldInfo.FieldSource = undefined;
            console.log(newFieldInfo);
        }
        else if(newFieldInfo.FieldType == "select"){
            newFieldInfo.FieldUnit = undefined;
            newFieldInfo.FieldDataType = undefined;
            newFieldInfo.FieldDataStep = undefined;
            newFieldInfo.FieldDataMin = undefined;
            newFieldInfo.FieldDataMax = undefined;
        }

        table.bootstrapTable("remove",{
            field: "$index",
            values: [index]
            });
        table.bootstrapTable("insertRow",{
            index: index,
            row: newFieldInfo
            })
        statusToStorage("eventArgEditorHistory",JSON.stringify(table.bootstrapTable('getData')));

        eventarg_content_name = "";
        $( document ).trigger( "_release", [ "edit"] );
        container.empty();

    });

    form.find(".btn-close").unbind("click").on("click",function(){
        eventarg_content_name = "";
        $( document ).trigger( "_release", ["edit"] );
        container.empty();
    })
}

function loadJSON(container,table){
    container.empty();

    var content = $("<div/>").addClass("container shadow pb-3 mb-3");

    var header= $("<div/>").addClass("row p-2 bg-dark text-white mb-3").attr("id","formTitle");
    
    header.append($("<div/>").addClass("col-md-11 fs-4").html("Field definition JSON import"));
    header.append($("<div/>").addClass("col-md-1 float-end").append($("<i/>").addClass("btn-close btn-close-white fs-4 float-end")));

    content.append(header);

    var textarea =$("<textarea/>").addClass("col-md-12 mb-2").attr("placeholder","Paste your JSON").attr("rows",10);
    content.append(textarea);

    content.append($("<button/>").addClass("btn btn-outline-primary col-md-12").html("Add JSON data to Fields"));

    content.find("button").on("click",function(){
        var json_text = $(textarea).val();
        console.log(json_text);
        var json = JSON.parse(json_text);
        table.bootstrapTable('append',json);
        statusToStorage("eventArgEditorHistory",JSON.stringify(table.bootstrapTable('getData')));
        
    })

    content.find(".btn-close").on("click",function(){
        eventarg_content_name = "";
        $( document ).trigger( "_release", ["jsonLoad"] );
        container.empty();
    })

    container.append(content);

}


function showTableJSON(container,table){
    container.empty();

    var content = $("<div/>").addClass("container shadow pb-3 mb-3");

    var header= $("<div/>").addClass("row p-2 bg-dark text-white mb-3").attr("id","formTitle");
    
    header.append($("<div/>").addClass("col-md-11 fs-4").html("Field definition JSON export"));
    header.append($("<div/>").addClass("col-md-1 float-end").append($("<i/>").addClass("btn-close btn-close-white fs-4 float-end")));

    content.append(header);

    var textarea = $("<textarea/>").addClass("col-md-12 mb-2").attr("rows",10);
    content.append(textarea);


    var data = table.bootstrapTable('getData');

    var filtered_data = [];
    $.each(data,function(index,row){
        var _data = {... row};
        delete _data.state;
        filtered_data.push(_data);
    })

    textarea.text(JSON.stringify(filtered_data));

    // var btn = $("<button/>").addClass("btn btn-outline-primary col-md-12").html("Copy to clipboard");
    // btn.attr("data-bs-toggle","tooltip").attr("title","")
    // btn.attr("data-bs-placement","top");

    // content.append(btn);

    // btn.on("click",function(){
    //     window.navigator.clipboard.writeText($(textarea).val());

    // })


    content.find(".btn-close").on("click",function(){
        eventarg_content_name = "";
        $( document ).trigger( "_release", ["jsonShow"] );
        container.empty();
    })

    container.append(content);

}

function previewTableForm(container,table){
    container.empty();

    var content = $("<div/>").addClass("container shadow pb-3 mb-3");

    var header= $("<div/>").addClass("row p-2 bg-dark text-white mb-3").attr("id","formTitle");
    
    header.append($("<div/>").addClass("col-md-11 fs-4").html("Event form preview"));
    header.append($("<div/>").addClass("col-md-1 float-end").append($("<i/>").addClass("btn-close btn-close-white fs-4 float-end")));

    content.append(header);

    var formPreview = $("<div/>").addClass("container shadow pb-3 mb-3");

    showCustomArgs(formPreview,table.bootstrapTable("getData"));

    content.append(formPreview);

    content.find(".btn-close").on("click",function(){
        eventarg_content_name = "";
        $( document ).trigger( "_release", ["preview"] );
        container.empty();
    })

    container.append(content);

}


function showEventArgEditor(container){
    createFieldsTable(container,eventarg_table_id,500);
    var table = $('#'+eventarg_table_id);
    
    if(statusInStorage("eventArgEditorHistory")){
        table.bootstrapTable('append',JSON.parse(statusFromStorage("eventArgEditorHistory")));
    }

    var toolbar = container.find(".fixed-table-toolbar");
    
    toolbar.find(".needs-select").addClass("disabled");
    
    eventarg_content = $("<div/>").addClass("pt-3");
    container.append(eventarg_content);


    table.on('all.bs.table',function(){
            if(eventarg_lock_list.length>0) return;

            var selection =  table.bootstrapTable('getSelections');
            if(selection.length>0 && eventarg_lock_list.length==0){
                toolbar.find(".needs-select").removeClass("disabled");
            }
            else{
                toolbar.find(".needs-select").addClass("disabled");
            }
        }
    )
    

    table.on('search.bs.table',function(e,text){
        if(text!=""){
            $( document ).trigger( "_lock", [ "search"] );
        }
        else{
            $( document ).trigger( "_release", [ "search"] );
        }
    }
    )

    table.on('sort.bs.table',function(e,name,order){
        if(order){
            $( document ).trigger( "_lock", [ "sort"] );
        }else{
            $( document ).trigger( "_release", [ "sort"] );
        }
    }
    )

    toolbar.find("#toolbar_removeSelected").on("click",function(e){
        bootbox.confirm({
            message: 'You are going to remove the selected fileds. Do you want to proceed?',
            buttons: {
            confirm: {
            label: 'Yes',
            className: 'btn-outline-danger'
            },
            cancel: {
            label: 'No',
            className: 'btn-outline-success'
            }
            },
            callback: function (result) {
                if(result){
                    var indices = [];
                    
                    
                    $('input[name="btSelectItem"]:checked').each(function(){
                        indices.push($(this).data('index'));
                    })
                    // console.log(indices);
                    table.bootstrapTable("remove",{field:"$index",values:indices});
                    statusToStorage("eventArgEditorHistory",JSON.stringify(table.bootstrapTable('getData')));
                }
            }
            });
    

    })

    toolbar.find("#toolbar_add").on("click",function(e){
        showArgEditorAddForm(eventarg_content,"add_form", table);
        eventarg_content_name = "add";
        $( document ).trigger( "_lock", [ "add"] );
    })

    toolbar.find("#toolbar_duplicate").on("click",function(e){
        var selected = $('input[name="btSelectItem"]:checked');
        if(selected.length>1){
            $('input[name="btSelectItem"]:checked').each(function () {
                let index = $(this).data('index');
                var data = table.bootstrapTable('getData');
                var _data = {... data[index]};
                _data["state"] = false;
                table.bootstrapTable("append",_data);
            })
            statusToStorage("eventArgEditorHistory",JSON.stringify(table.bootstrapTable('getData')));
        }
        else{
            $('input[name="btSelectItem"]:checked').each(function () {
                let index = $(this).data('index');
                var data = table.bootstrapTable('getData');
                var _data = {... data[index]};
                _data["state"] = false;
                table.bootstrapTable("insertRow",{index:index+1,row:_data});
            })
            statusToStorage("eventArgEditorHistory",JSON.stringify(table.bootstrapTable('getData')));
        }

    })

    // toolbar.find("#toolbar_edit").on("click",function(e){
    //     showArgEditorEditForm(eventarg_content,"edit_form", table);
    //     eventarg_content_name = "edit";
    // })

    toolbar.find("#toolbar_loadJSON").on("click",function(e){
        loadJSON(eventarg_content, table);
        eventarg_content_name = "jsonLoad";
        $( document ).trigger( "_lock", [ "jsonLoad"] );
    })

    toolbar.find("#toolbar_createJSON").on("click",function(e){
        showTableJSON(eventarg_content, table);
        eventarg_content_name = "jsonShow";
        $( document ).trigger( "_lock", [ "jsonShow" ] );
    })

    toolbar.find("#toolbar_previewForm").on("click",function(e){
        previewTableForm(eventarg_content, table);

        eventarg_content_name = "preview";
        $( document ).trigger( "_lock", [ "preview" ] )

        var named_fileds = $(eventarg_content).find("[name]");
        var names = [];
        $.each(named_fileds, function (){
            names.push($(this).attr("name"))
        });

        if(hasDuplicates(names)){
            var doubles = getDoubles(names);
            bootbox.alert({
                message: 'Warning! FieldName needs to be unique.<br/>Please check for redundant FieldNames:<br/>'+JSON.stringify(doubles),
                buttons: {
                    ok: {
                        label: 'Accept',
                        className: 'btn-outline-primary'
                        },
                    },
                });
        }
    })



    $( document ).on( "operate_lock", {}, 
        function( event ) {

            if(eventarg_lock_list.length!=0){
                $(document).find(".lockable").addClass("disabled");
                if(!eventarg_lock_list.includes("search")) $(document).find(".search-input").prop( "disabled", true );
                $(document).find(".sortable").prop( "disabled", true );
            }
            else{
                $(eventarg_content).empty();
                $(document).find(".lockable").not(".needs-select").removeClass("disabled");
                if(!eventarg_lock_list.includes("search")) $(document).find(".search-input").prop( "disabled", false );
                $(document).find(".sortable").prop( "disabled", false );
            }
        }
    );

    $( document ).on( "_lock", {}, 
    function( event, lock_name ) {
        if(!(lock_name == "" || lock_name == null )){
            eventarg_lock_list.push(lock_name);
            // console.log("Lock ["+lock_name+"] acquired.");
            $(this).trigger("operate_lock",[]);
        }
    });

    $( document ).on( "_release", {}, 
    function( event, lock_name ) {
        if(!(lock_name == "" || lock_name == null )){
            eventarg_lock_list = _.without(eventarg_lock_list,lock_name);
            // console.log("Lock ["+lock_name+"] released.");
            $(this).trigger("operate_lock",[]);
        }
    });
    

}