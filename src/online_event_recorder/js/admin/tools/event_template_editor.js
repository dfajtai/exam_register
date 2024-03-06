var event_template_table_id = "fieldDefTable";
var event_template_modals  = {};
var event_template_content_name = "";
var event_template_lock_list = [];
var event_template_names = [];
var event_template_doubles = [];


window.event_template_operate_events = {
    'click .move_up': function (e, value, row, index) {
        if(index==0){
            return
        }
        var data = $('#'+event_template_table_id).bootstrapTable('getData');
        var upper_data = {... data[index-1]};
        upper_data.state = upper_data.state===undefined ? false : upper_data.state;;
        $('#'+event_template_table_id).bootstrapTable('updateRow',[{index:index-1,row:row},{index:index, row:upper_data}]);

        statusToStorage("eventArgEditorHistory",JSON.stringify($('#'+event_template_table_id).bootstrapTable('getData')));

    },
    'click .move_down': function (e, value, row, index) {
        var data = $('#'+event_template_table_id).bootstrapTable('getData');
        if(index==data.length-1){
            return
        }
        var lower_data = {... data[index+1]};
        lower_data.state = lower_data.state === undefined ? false : lower_data.state;
        $('#'+event_template_table_id).bootstrapTable('updateRow',[{index:index+1,row:row},{index:index, row:lower_data}]);

        statusToStorage("eventArgEditorHistory",JSON.stringify($('#'+event_template_table_id).bootstrapTable('getData')));

    },
    'click .edit': function (e, value, row, index) {
        show_event_template_modal_edit_form(event_template_modals, $('#'+event_template_table_id),index);
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
            className: 'btn-outline-dark'
            }
            },
            callback: function (result) {
                if(result){
                    $('#'+event_template_table_id).bootstrapTable('remove', {
                        field: '$index',
                        values: [index]
                        });
                    statusToStorage("eventArgEditorHistory",JSON.stringify($('#'+event_template_table_id).bootstrapTable('getData')));

                    // event_template_update_unique();
                    // $('#'+event_template_table_id).bootstrapTable("resetSearch"); // to call the formatter...
                    $('#'+event_template_table_id).bootstrapTable("uncheckAll");
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

    var btn_edit = $("<button/>").addClass("btn btn-outline-dark btn-sm edit me-2 lockable").append($("<i/>").addClass("fa fa-edit"));
    var btn_remove = $("<button/>").addClass("btn btn-outline-danger btn-sm remove lockable").append($("<i/>").addClass("fa fa-trash"));
    btn_edit.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Edit");
    btn_remove.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Remove");

    container.append(btn_edit)
    container.append(btn_remove)


    if (index==0){
        btn_up.addClass("disabled").removeClass("lockable");
    }
    if(index==$('#'+event_template_table_id).bootstrapTable('getData').length-1){
        btn_down.addClass("disabled").removeClass("lockable");
    }

    if(event_template_lock_list.length>0){
        container.find("button").addClass("disabled");
    }

    return container.prop("outerHTML");
}


function create_event_template_table(container, table_id, height){
    // var table_with_controls = $("<div/>");

    var table = $("<table/>").attr("id",table_id);

    var toolbar = $("<div/>").attr("id",table_id+"_toolbar");
    toolbar.append($("<button/>").attr("id","toolbar_add").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-plus me-2").attr("aria-hidden","true")).append("Add New"));
    // toolbar.append($("<button/>").attr("id","toolbar_edit").addClass("btn btn-outline-dark admin-table-toolbar-btn needs-select").html($("<i/>").addClass("fa fa-pen-to-square").attr("aria-hidden","true")).append(" Edit Selected"));
    toolbar.append($("<button/>").attr("id","toolbar_duplicate").addClass("btn btn-outline-dark admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-solid fa-copy me-2").attr("aria-hidden","true")).append("Duplicate").attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Duplicate selected events."));
    toolbar.append($("<button/>").attr("id","toolbar_removeSelected").addClass("btn btn-outline-danger admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-trash fa-solid me-2").attr("aria-hidden","true")).append("Remove").attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Remove selected events."));
    toolbar.append($("<button/>").attr("id","toolbar_event_template_json_import").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-file-import fa-solid me-2").attr("aria-hidden","true")).append("Import"));
    var json_btn = $("<button/>").attr("id","toolbar_generate_JSON").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-code fa-solid me-2").attr("aria-hidden","true")).append("Export");
    json_btn.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Export as JSON.")
    toolbar.append(json_btn);
    toolbar.append($("<button/>").attr("id","toolbar_preview_event_form").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-eye fa-solid me-2").attr("aria-hidden","true")).append("Preview"));
    var export_btn = $("<button/>").attr("id","toolbar_export_to_event_defs").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa-solid fa-share-from-square me-2").attr("aria-hidden","true")).append("Delegate")
    export_btn.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Export to 'EventTempalteDefinitions'.");
    toolbar.append(export_btn);

    table.attr("data-height",String(height));

    table.attr("data-toolbar","#"+table_id+"_toolbar");
    table.attr("data-toolbar-align","left");


    table.attr("data-pagination","false");
    table.attr("data-show-pagination-switch","false");
    table.attr("data-page-list","[10, 25, 50, 100, all]");

    table.attr("data-show-footer","false");

    table.attr("data-search","true");
    table.attr("data-regex-search","true");
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
                events: window.event_template_operate_events, formatter: eventOperateFormatter},
                {title: 'Name', field : 'FieldName', align:'center', sortable:true, searchable:true, cellStyle: 'argname_validate_formatter'},
                {title: 'Label', field : 'FieldLabel', align:'center', sortable:true, searchable:true},
                {title: 'Type', field : 'FieldType', align:'center', sortable:true, searchable:true},
                {title: 'Unit', field : 'FieldUnit', align:'center', sortable:true, searchable:true},
                {title: 'Source', field : 'FieldSource', align:'center', sortable:true, searchable:true},
                {title: 'Required', field : 'FieldRequired', align:'center', sortable:true, searchable:true},
            ],
            pagination:true,
            checkboxHeader:true,
            smartDisplay:true,
            detailFormatter: function(index,row){return detail_as_table_formatter(index,row,null)}
        });

}


function argname_validate_formatter(value, row, index){
    if(event_template_doubles.includes(value)){
        return {
            css: {
            'color': 'red',
            'font-weight':'bold'
            }
        }
    }
    return {}

}

function event_template_select_form(container){
    container.empty();

    var defSelectGroup = $("<div/>").addClass("row mb-2").attr("id","defitinitonSelectGroup");
    defSelectGroup.append($("<label/>").addClass("col-form-label col-md-3").attr("for","selectDataSource").html("Data Source"));
    var def_select_dropdow = $("<select/>").addClass("form-select required").attr("type","text").attr("id","selectDataSource").attr("name","FieldSource").prop('required',true);
    def_select_dropdow.append($("<option/>").html("Choose Field Data Source...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    def_select_dropdow.append($("<option/>").html("Location").attr("value","location"));
    def_select_dropdow.append($("<option/>").html("Bodypart").attr("value","bodypart"));
    // def_select_dropdow.append($("<option/>").html("Side").attr("value","side"));
    def_select_dropdow.append($("<option/>").html("Consumable").attr("value","consumable"));
    def_select_dropdow.append($("<option/>").html("Asset").attr("value","asset"));
    defSelectGroup.append($("<div/>").addClass("col-md-9").append(def_select_dropdow))

    container.append($("<hr/>").addClass("hr mt-3 mb-3"));
    container.append(defSelectGroup);

    var default_value_hr = $("<hr>").addClass("my-2");
    var defaultValueGroup = $("<div/>").attr("id","defaultValueGroup");
    
    defSelectGroup.find("select").change(function(){
        container.append(default_value_hr);
        container.append(defaultValueGroup);

        switch (this.value) {
            case "location":
                defaultValueGroup.empty().addClass("row mb-3");
                dynamicLocationSelect(defaultValueGroup,"FieldDefaultValue","Default value");
                break;
            
            case "bodypart":
                defaultValueGroup.empty().addClass("row mb-3");
                dynamicBodypartSelect(defaultValueGroup,"FieldDefaultValue","Default value");
                break;
        
            case "consumable":
                defaultValueGroup.empty().addClass("row mb-3");
                dynamicConsumableSelect(defaultValueGroup,"FieldDefaultValue","Default value");
                break;
            
            case "asset":
                defaultValueGroup.empty().addClass("row mb-3");
                dynamicAssetSelect(defaultValueGroup,"FieldDefaultValue","Default value");
                break;

            default:
                defaultValueGroup.empty().removeClass("row mb-3");
                default_value_hr.prop("hidden",true);
                break;
        }

        // var remove_default_value_switch_group = $("<div/>").addClass("form-check form-switch");
        // var remove_default_value_switch = $("<input/>").addClass("form-check-input").attr("type","checkbox").attr("id","remove_default_val");
        // remove_default_value_switch_group.append(remove_default_value_switch);
        // remove_default_value_switch_group.append($("<label/>").addClass("form-check-label").attr("for","remove_default_val").html("Remove default value "));
        // defaultValueGroup.append($("<div/>").addClass("mt-3 mb-2").append(remove_default_value_switch_group));

        // remove_default_value_switch.on("change",function(){

        //     var def_val_entry = $(defaultValueGroup).find('[name="FieldDefaultValue"]')[0];

        //     var checked = $(this).prop("checked");
        //     if(checked){
        //         $(def_val_entry).attr("data-value","");
        //     }
        //     else{
        //         $(def_val_entry).attr("data-value",$(def_val_entry).val());
        //     }
        // })

    });
}


function event_template_input_form(container){
    container.empty();

    var dtypeSelectGroup = $("<div/>").addClass("row mb-3");
    dtypeSelectGroup.append($("<label/>").addClass("col-form-label col-md-3").attr("for","dtypeSelect").html("Field Data Type"));

    var dtype_dropdown = $("<select/>").addClass("form-select required data-required data-required-style").attr("type","text").attr("id","dtypeSelect").attr("name","FieldDataType").prop('required',true);
    dtype_dropdown.append($("<option/>").html("Choose Field Data Type...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    dtype_dropdown.append($("<option/>").html("text").attr("value","text"));
    dtype_dropdown.append($("<option/>").html("longtext").attr("value","longtext"));
    dtype_dropdown.append($("<option/>").html("date").attr("value","date"));
    dtype_dropdown.append($("<option/>").html("time").attr("value","time"));
    dtype_dropdown.append($("<option/>").html("datetime").attr("value","datetime"));
    dtype_dropdown.append($("<option/>").html("numeric").attr("value","numeric"));
    dtype_dropdown.append($("<option/>").html("range").attr("value","range"));

    dtypeSelectGroup.append($("<div/>").addClass("col-md-9").append(dtype_dropdown));

    container.append($("<hr/>").addClass("mt-3 mb-3"));
    container.append(dtypeSelectGroup);


    var dtypeNumericGroup = $("<div/>").attr("id","numericParamGroup");
    container.append(dtypeNumericGroup);

    var default_value_hr = $("<hr/>").addClass("mt-3 mb-3").prop("hidden",true);
    container.append(default_value_hr);
    var defaultValueGroup = $("<div/>").attr("id","defaultValueGroup");
    container.append(defaultValueGroup);

    dtypeSelectGroup.find("select").change(function(){
        defaultValueGroup.empty().removeClass("row mb-3");
        dtypeNumericGroup.empty().removeClass("row mb-3");
        
        if(this.value=="numeric"){
            dtypeNumericGroup.empty().addClass("d-flex flex-lg-row flex-column row mb-3");
            var _step = $("<div/>").addClass("col-lg-4 mb-lg-0 mb-2 col-12");
            _step.append($("<label/>").addClass("form-label").attr("for","dtypeStepInput").html("Field Step"));
            _step.append($("<input/>").addClass("form-control").attr("type","numeric").attr("step","0.0001").attr("id","dtypeStepInput").attr("name","FieldDataStep").attr("placeholder","e.g. 1, 0.1, 0.01, ..."));
            dtypeNumericGroup.append(_step);

            var _unitType = $("<div/>").addClass("col-lg-4 mb-lg-0 mb-2 col-12");
            _unitType.append($("<label/>").addClass("form-label").attr("for","unitTypeSelect").html("Field Unit Type"));
            var type_select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id","unitTypeSelect");
            type_select_dropdow.append($("<option/>").html("Choose Unit Type...").prop('selected',true).attr("disabled","disabled").attr("value",""));
            showAllDefs(type_select_dropdow,"unit_type_definitions","UnitTypeID","UnitTypeName","UnitTypeName");
            _unitType.append(type_select_dropdow);
            dtypeNumericGroup.append(_unitType);

            var _unit = $("<div/>").addClass("col-lg-4 mb-lg-0 mb-2 col-12");
            _unit.append($("<label/>").addClass("form-label").attr("for","unitSelect").html("Field Unit"));
            var unit_select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id","unitSelect").attr("name","FieldUnit").prop('required',false);;
            unit_select_dropdow.append($("<option/>").html("Choose Unit...").prop('selected',true).attr("disabled","disabled").attr("value",""));
            showAllDefs(unit_select_dropdow,"unit_definitions","UnitUnit","UnitUnit","UnitUnit");
            _unit.append(unit_select_dropdow);
            dtypeNumericGroup.append(_unit);

            connectSelectByAttr(_unitType,_unit, "unit_definitions","UnitType", "UnitTypeID", "UnitID");

            defaultValueGroup.empty().addClass("row mb-3");
            default_value_hr.prop("hidden",false);
            defaultValueGroup.append($("<label/>").addClass("col-form-label col-md-3").attr("for","defvalInput").html("Default value"));
            var defValInput = $("<input/>").addClass("form-control").attr("type","numeric").attr("id","defvalInput").attr("name","FieldDefaultValue").prop('required',false);
            defaultValueGroup.append($("<div/>").addClass("col-md-9").append(defValInput));
            

        }
        else if(this.value=="range"){
            dtypeNumericGroup.empty().addClass("d-flex flex-lg-row flex-column row mb-3");
            var _step = $("<div/>").addClass("col-lg-2 mb-lg-0 mb-2 col-12");
            _step.append($("<label/>").addClass("form-label").attr("for","dtypeStepInput").html("Field Step"));
            _step.append($("<input/>").addClass("form-control data-required data-required-style").attr("type","numeric").attr("step","0.0001").attr("id","dtypeStepInput").attr("name","FieldDataStep").prop('required',true).attr("placeholder","e.g. 1, 0.1, 0.01, ..."));
            dtypeNumericGroup.append(_step);

            var _min = $("<div/>").addClass("col-lg-2 mb-lg-0 mb-2 col-12");
            _min.append($("<label/>").addClass("form-label").attr("for","dtypeMinInput").html("Field Min"));
            _min.append($("<input/>").addClass("form-control").attr("type","numeric").attr("step","0.0001").attr("id","dtypeMinInput").attr("name","FieldDataMin").prop('required',true).attr("placeholder","e.g. 0, ..."));
            dtypeNumericGroup.append(_min);

            var _max = $("<div/>").addClass("col-lg-2 mb-lg-0 mb-2 col-12");
            _max.append($("<label/>").addClass("form-label").attr("for","dtypeMaxInput").html("Field Max"));
            _max.append($("<input/>").addClass("form-control").attr("type","numeric").attr("step","0.0001").attr("id","dtypeMaxInput").attr("name","FieldDataMax").prop('required',true).attr("placeholder","e.g. 100, ..."));
            dtypeNumericGroup.append(_max);

            var _unitType = $("<div/>").addClass("col-lg-3 mb-lg-0 mb-2 col-12");
            _unitType.append($("<label/>").addClass("form-label").attr("for","unitTypeSelect").html("Field Unit Type"));
            var type_select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id","unitTypeSelect");
            type_select_dropdow.append($("<option/>").html("Choose Unit Type...").prop('selected',true).attr("disabled","disabled").attr("value",""));
            showAllDefs(type_select_dropdow,"unit_type_definitions","UnitTypeID","UnitTypeName","UnitTypeName");
            _unitType.append(type_select_dropdow);
            dtypeNumericGroup.append(_unitType);

            var _unit = $("<div/>").addClass("col-lg-3 mb-lg-0 mb-2 col-12");
            _unit.append($("<label/>").addClass("form-label").attr("for","unitSelect").html("Field Unit"));
            var unit_select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id","unitSelect").attr("name","FieldUnit");
            unit_select_dropdow.append($("<option/>").html("Choose Unit...").prop('selected',true).attr("disabled","disabled").attr("value",""));
            showAllDefs(unit_select_dropdow,"unit_definitions","UnitUnit","UnitUnit","UnitUnit");
            _unit.append(unit_select_dropdow);
            dtypeNumericGroup.append(_unit);

            connectSelectByAttr(_unitType,_unit, "unit_definitions", "UnitType", "UnitTypeID", "UnitID");

            defaultValueGroup.empty().addClass("row mb-3");
            default_value_hr.prop("hidden",false);
            defaultValueGroup.append($("<label/>").addClass("col-form-label col-md-3").attr("for","defvalInput").html("Default value"));
            var defValInput = $("<input/>").addClass("form-control").attr("type","numeric").attr("id","defvalInput").attr("name","FieldDefaultValue").prop('required',false);
            defaultValueGroup.append($("<div/>").addClass("col-md-9").append(defValInput));
            
        }
        else{
            dtypeNumericGroup.empty().removeClass("row mb-3");

            switch (this.value) {
                case "text":
                    defaultValueGroup.empty().addClass("row mb-3");
                    default_value_hr.prop("hidden",false);
                    dynamicTextInput(defaultValueGroup,"FieldDefaultValue","Default value");
                    break;
                
                case "longtext":
                    defaultValueGroup.empty().addClass("row mb-3");
                    default_value_hr.prop("hidden",false);
                    dynamicLongTextInput(defaultValueGroup,"FieldDefaultValue","Default value");
                    break;

                case "date":
                    defaultValueGroup.empty().addClass("row mb-3");
                    default_value_hr.prop("hidden",false);
                    dynamicDateInput(defaultValueGroup,"FieldDefaultValue","Default value");
                    break;
            
                case "datetime":
                    defaultValueGroup.empty().addClass("row mb-3");
                    default_value_hr.prop("hidden",false);
                    dynamicDatetimeInput(defaultValueGroup,"FieldDefaultValue","Default value");
                    break;
                
                case "time":
                    defaultValueGroup.empty().addClass("row mb-3");
                    default_value_hr.prop("hidden",false);
                    dynamicTimeInput(defaultValueGroup,"FieldDefaultValue","Default value");
                    break;

                default:
                    break;
            }
        }
    })
}

function event_template_modal(container, modal_id, title){
    var modal_root = $("<div/>").addClass("modal fade").attr("id",modal_id).attr("tabindex","-1");
    var modal_dialog = $("<div/>").addClass("modal-dialog modal-xl");
    var modal_content = $("<div/>").addClass("modal-content");

    var modal_header= $("<div/>").addClass("modal-header");
    modal_header.append($("<h5/>").addClass("modal-title display-3 fs-3").html(title));
    modal_header.append($("<button/>").addClass("btn-close").attr("data-bs-dismiss","modal").attr("aria-label","Close"));

    var modal_body = $("<div/>").addClass("modal-body");

    var modal_footer= $("<div/>").addClass("modal-footer");
    modal_footer.append($("<button/>").addClass("btn btn-outline-dark").attr("id","clear_form").attr("aria-label","Clear").html($("<i/>").addClass("fa fa-eraser me-2").attr("aria-hidden","true")).append("Clear"));
    modal_footer.append($("<button/>").addClass("btn btn-outline-dark").attr("data-bs-dismiss","modal").attr("aria-label","Close").html("Close"));

    modal_content.append(modal_header);
    modal_content.append(modal_body);
    modal_content.append(modal_footer);

    modal_dialog.html(modal_content);
    modal_root.html(modal_dialog);

    modal_footer.find('#clear_form').on('click',function(){
        $(modal_body).find('form')[0].reset();
    })

    container.append(modal_root);
}


function event_template_add_form(container,form_id, table){
    // container.empty();

    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var primaryProperties = $("<div/>");
    var nameGroup = $("<div/>").addClass("row mb-3");
    nameGroup.append($("<label/>").addClass("col-md-3 col-form-label").attr("for","name").html("Field Name"));
    var nameInput = $("<input/>").addClass("form-control data-required data-required-style").attr("type","text").attr("id","name").attr("name","FieldName").prop('required',true).attr("placeholder","Field name in database.");
    nameGroup.append($("<div/>").addClass("col-md-9").append(nameInput));
    
    var labelGroup = $("<div/>").addClass("row mb-3");
    labelGroup.append($("<label/>").addClass("col-md-3 col-form-label").attr("for","label").html("Field Label"));
    var labelInput = $("<input/>").addClass("form-control data-required data-required-style").attr("type","text").attr("id","label").attr("name","FieldLabel").prop('required',true).attr("placeholder","Field label in visualization.")
    labelGroup.append($("<div/>").addClass("col-md-9").append(labelInput));

    var typeGroup = $("<div/>").addClass("d-flex flex-column flex-md-row row mb-3");
    var typeGroupLabel = $("<div/>").addClass("form-label col-md-3").html("Field Type");

    var inputGroup = $("<div/>").addClass("form-check form-check-inline col-md-2 col-12 ms-md-3 ms-4");
    inputGroup.append($("<input/>").addClass("form-check-input data-required data-required-style").attr("type","radio").attr("id","inputRadio").attr("name","FieldType").prop('required',true).attr("value","input"));
    inputGroup.append($("<label/>").addClass("form-check-label").attr("for","inputRadio").html("Input"));

    var selectGroup = $("<div/>").addClass("form-check form-check-inline col-md-2 col-12 ms-4");
    selectGroup.append($("<input/>").addClass("form-check-input data-required data-required-style").attr("type","radio").attr("id","selectRadio").attr("name","FieldType").prop('required',true).attr("value","select"));
    selectGroup.append($("<label/>").addClass("form-check-label").attr("for","selectRadio").html("Select"));

    var requiredGroup = $("<div/>").addClass("form-check form-check-inline col-md-2 col-12 ms-4");
    requiredGroup.append($("<input/>").addClass("form-check-input").attr("type","checkbox").attr("id","requiredCheckbox").attr("name","FieldRequired").attr("value","true"));
    requiredGroup.append($("<label/>").addClass("form-check-label").attr("for","requiredCheckbox").html("Required"));

    typeGroup.append(typeGroupLabel);
    typeGroup.append(inputGroup);
    typeGroup.append(selectGroup);
    typeGroup.append(requiredGroup);


    primaryProperties.append(nameGroup);
    primaryProperties.append(labelGroup);
    primaryProperties.append(typeGroup);


    var additionalForm = $("<div/>");

    typeGroup.find("input[type=radio]").change(function(){
        // console.log(this.value + " : " + this.checked);
        if(this.value=="select"){
            event_template_select_form(additionalForm);
        }
        else{
            event_template_input_form(additionalForm);
        }
    })



    form.append(primaryProperties);
    form.append(additionalForm);

    var submitButton = $("<button/>").addClass("btn btn-outline-dark col-12").attr("id","submitBtn").attr("type","submit").html("Add as new field");

    form.append(submitButton);

    form.on('submit',function(e){
        e.preventDefault();

        var values = {};
        $.each($(this).serializeArray(),function(index,field){
            var entries = $(form).find("[name='"+field.name+"'][data-value]");
            if(entries.length>0){
                var _entry = entries[0];
                var data_val = $(_entry).prop("data-value");
                values[field.name] = parse_val(data_val==""?null:data_val);
            }
            else{
                values[field.name] = parse_val(field.value==""?null:field.value);
            }
        })
        

        if(values.FieldType == "input"){
            delete values.FieldSource;
        }
        else if(values.FieldType == "select"){
            delete values.FieldUnit;
            delete values.FieldDataType;
            delete values.FieldDataStep;
            delete values.FieldDataMin;
            delete values.FieldDataMax;
        }


        if(event_template_content_name.includes(values.FieldName)){
            event_template_doubles.push(values.FieldName);
        }

        table.bootstrapTable("append",values);
        statusToStorage("eventArgEditorHistory",JSON.stringify(table.bootstrapTable('getData')));


        event_template_content_name = "";
        $( document ).trigger( "_release", [ "add"] );

        // event_template_update_unique();
        // event_template_uniqueness_warning();
        // table.bootstrapTable("resetSearch"); // to call the formatter...
        // container.empty();

    });

    container.append(form);
}

function show_event_template_modal_add_form(container, table){
    container.empty();

    var modal_id = "event_template_add_modal";
    event_template_modal(container, modal_id, "Configure new argument");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    var modal_footer = modal.find(".modal-footer");
    // modal_footer.empty();

    event_template_content_name = "add";
    $( document ).trigger( "_lock", [ "add"] );

    event_template_add_form(modal_body,"add_form", table);

    var form = $(modal).find("form");
    // console.log(form);
    form.on('submit',function(){
        modal.modal('hide');
    })

    modal.modal('show');

    modal.on("hide.bs.modal",function(){
        event_template_content_name = "";
        $( document ).trigger( "_release", [ "add" ] )
        // container.empty();
    });

}

function event_template_edit_form(container, form_id,  table, index, submit_callback = null){
    // container.empty();
    event_template_add_form(container, form_id, table);

    var form = container.find("#"+form_id);

    if(index> table.bootstrapTable('getData').length){
        return
    }
    var entry = table.bootstrapTable('getData')[index];

    // TODO store inputs updated to prevent redundant update

    var fields_initialized = [];

    form.find("input[name][type!=radio]").each(function(){
        var name = $(this).attr("name");
        if(name in entry){
            fields_initialized.push(name);
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
            fields_initialized.push(name);
        }
        $(this).trigger("change");
    });
    // re-fill input (step)

    form.find("input[name][type!=radio]").each(function(){
        var name = $(this).attr("name");
        if(name in entry){
            $(this).val(entry[name]);
            fields_initialized.push(name);
        }
    });
    form.find("select[name]").each(function(){
        var name = $(this).attr("name");
        if(name in entry){
            $(this).val(entry[name]);
            fields_initialized.push(name);
        }
    });
    form.find("[name]").each(function(){
        var name = $(this).attr("name");
        if(fields_initialized.includes(name)) return true;
        if(name in entry){
            $(this).val(entry[name]);
        }
    });


    form.find("#submitBtn").each(function(){
        $(this).html("Alter selected field");
    });

    form.off("submit").on('submit',function(e){
        e.preventDefault();

        var values = {};
        $.each($(this).serializeArray(),function(index,field){
            var entries = $(form).find("[name='"+field.name+"'][data-value]");
            if(entries.length>0){
                var _entry = entries[0];
                var data_val = $(_entry).prop("data-value");
                values[field.name] = parse_val(data_val==""?null:data_val);
            }
            else{
                values[field.name] = parse_val(field.value==""?null:field.value);
            }
        })
        // console.log(newFieldInfo);

        if(values.FieldType == "input"){
            values.FieldSource = undefined;
        }
        else if(values.FieldType == "select"){
            values.FieldUnit = undefined;
            values.FieldDataType = undefined;
            values.FieldDataStep = undefined;
            values.FieldDataMin = undefined;
            values.FieldDataMax = undefined;
        }

        table.bootstrapTable("updateRow",{
            index: index,
            row: values
            })


        statusToStorage("eventArgEditorHistory",JSON.stringify(table.bootstrapTable('getData')));

        event_template_content_name = "";
        $( document ).trigger( "_release", [ "edit"] );

        // event_template_update_unique();
        // event_template_uniqueness_warning();
        // table.bootstrapTable("resetSearch"); // to call the formatter...
        
        if(submit_callback!=null){
            submit_callback();
        }
    });
}


function show_event_template_modal_edit_form(container, table, index){
    container.empty();

    var modal_id = "event_template_add_modal";
    event_template_modal(container, modal_id, "Configure argument");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    var modal_footer = modal.find(".modal-footer");
    // modal_footer.empty();

    modal_footer.prepend($("<button/>").addClass("btn btn-outline-dark").attr("id","revert_form").attr("aria-label","Clear").html($("<i/>").addClass("fa fa-rotate-right me-2").attr("aria-hidden","true")).append("Revert"));

    event_template_content_name = "edit";
    $( document ).trigger( "_lock", [ "edit"] );

    event_template_edit_form(modal_body, "edit_form", table, index, function(){ modal.modal('hide');});

    var form = $(modal).find("form");
    // console.log(form);
    form.on('submit',function(){
        modal.modal('hide');
    })

    modal.modal('show');

    modal_footer.find("#revert_form").click(function(){
        modal_body.empty();
        event_template_edit_form(modal_body, "edit_form", table, index, function(){ modal.modal('hide');});
    })

    modal.on("hide.bs.modal",function(){
        event_template_content_name = "";
        $( document ).trigger( "_release", [ "edit" ] )
        // container.empty();
    });

}

function event_template_json_import(container,form_id, table){
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var textarea =$("<textarea/>").addClass("form-control col-md-12 mb-2").attr("placeholder","Paste your JSON").attr("rows",20).prop("required",true).attr("name","json_text");
    form.append(textarea);

    form.append($("<button/>").addClass("btn btn-outline-dark col-md-12").html("Add JSON data to Fields"));


    form.on("submit",function(e){
        e.preventDefault();
        var json_text = $(textarea).val();
        if(json_text.length==0 | json_text == null) return;
        var json = JSON.parse(json_text);
        table.bootstrapTable('append',json);
        statusToStorage("eventArgEditorHistory",JSON.stringify(table.bootstrapTable('getData')));
    });


    container.append(form);

}

function show_event_template_modal_json_import_form(container, table){
    container.empty();

    var modal_id = "event_template_add_modal";
    event_template_modal(container, modal_id, "Import arguments as JSON");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    var modal_footer = modal.find(".modal-footer");
    // modal_footer.empty();

    var dialog = modal.find(".modal-dialog");
    if(dialog){
        dialog.removeClass("modal-lg").addClass("modal-xl");
    }

    event_template_content_name = "json_import";
    $( document ).trigger( "_lock", [ "json_import"] );

    event_template_json_import(modal_body, "json_import_form",table);

    var form = $(modal).find("form");
    // console.log(form);
    form.on('submit',function(){
        modal.modal('hide');
    })

    modal.modal('show');

    modal.on("hide.bs.modal",function(){
        event_template_content_name = "";
        $( document ).trigger( "_release", [ "json_import" ] )
        // container.empty();
    });

}

function event_template_json_export(container,table){
    var content = $("<div/>");

    var textarea = $("<textarea/>").addClass("col-md-12 mb-2").attr("rows",20);
    content.append(textarea);


    var data = table.bootstrapTable('getData');

    var filtered_data = [];
    $.each(data,function(index,row){
        var _data = {... row};
        delete _data.state;
        filtered_data.push(_data);
    })

    textarea.text(JSON.stringify(filtered_data));

    content.find(".btn-close").on("click",function(){
        event_template_content_name = "";
        $( document ).trigger( "_release", ["json_export"] );
        container.empty();
    })

    container.append(content);

}


function show_event_template_modal_json_export_form(container, table){
    container.empty();

    var modal_id = "event_template_add_modal";
    event_template_modal(container, modal_id, "Export arguments as JSON");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    var modal_footer = modal.find(".modal-footer");
    modal_footer.empty();

    var dialog = modal.find(".modal-dialog");
    if(dialog){
        dialog.removeClass("modal-lg").addClass("modal-xl");
    }

    event_template_content_name = "json_export";
    $( document ).trigger( "_lock", [ "json_export"] );

    event_template_json_export(modal_body, table);

    var form = $(modal).find("form");
    // console.log(form);
    form.on('submit',function(){
        modal.modal('hide');
    })

    modal.modal('show');

    modal.on("hide.bs.modal",function(){
        event_template_content_name = "";
        $( document ).trigger( "_release", [ "json_export" ] )
        // container.empty();
    });

}


function show_event_template_modal_preview(container,table){
    container.empty();
    var modal_id = "event_template_preview_modal";
    event_template_modal(container, modal_id, "Event form preview");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");

    var form = $("<form>").addClass("needs-validation");
    var modal_footer = modal.find(".modal-footer");

    modal_footer.find("button").remove();
    modal_footer.append($("<button>").addClass("btn btn-outline-dark w-100 validate-preview-btn").html("Test input"));

    modal_footer.find(".validate-preview-btn").on("click",function(){
        if (! $(form)[0].checkValidity()) {    
            $(form)[0].reportValidity();
        }
        else{
            form.trigger("submit",true);
        }
    });

    form.on("submit",function(e){
        e.preventDefault();
        var values = {};
        $.each($(this).serializeArray(), function(i, field) {
            var entries = $(form).find("[name='"+field.name+"'][data-value]");
            if(entries.length>0){
                var _entry = entries[0];
                var data_val = $(_entry).prop("data-value");
                values[field.name] = parse_val(data_val==""?null:data_val);
            }
            else{
                values[field.name] = get_readable_value(form,field.name,field.value)
            }
            
        });

        var table = object_to_table_formatter(values);
        bootbox.alert('Values read:</br>'+$(table).prop("outerHTML"));
    })

    var data = table.bootstrapTable("getData");
    modal_body.empty();
    showCustomArgs(form,data);
    modal_body.append(form);

    modal.modal('show');

    modal.on("hide.bs.modal",function(){
        event_template_content_name = "";
        $( document ).trigger( "_release", [ "preview_event_form" ] )
        // container.empty();
    });

}


function show_event_template_in_template_defs(table){
    var data = table.bootstrapTable('getData');

    function delegate_params(){    
        var filtered_data = [];
        $.each(data,function(index,row){
            var _data = {... row};
            delete _data.state;
            filtered_data.push(_data);
        })
    
        filtered_data_json = JSON.stringify(filtered_data);
        
        saveCurrentStatusToHistory() // duplicate current history entry
        contentToUrl("addNewEventDef",filtered_data_json, true, false); // replace with new status - remove old tool
        contentToUrl("def","events",  false, false); // add tool tag to status

    
        window.location.reload();
    }

    var params = JSON.stringify(data);

    bootbox.confirm({
        message: 'You are going to export the current "EventTemplate" to "EventTemplateDefinitions" as a new event definition.</br>' + params +'</br>Do you want to proceed?',
        buttons: {
        confirm: {
        label: 'Yes',
        className: 'btn-outline-danger'
        },
        cancel: {
        label: 'No',
        className: 'btn-outline-dark'
        }
        },
        callback: function (result) {
            if(result){
                delegate_params()
            }
        }
        });

}

function event_template_uniqueness_warning(callback = null){
    if(event_template_doubles.length>0){
        var message = 'Warning! FieldName needs to be unique.<br/>Please check for redundant FieldNames:<br/><br/>'+JSON.stringify(event_template_doubles);

        bootbox.alert({
            message: message,
            buttons: {
                ok: {
                    label: 'Accept',
                    className: 'btn-outline-dark'
                    },
                },
            });
    }
    else{
        if(callback!=null) callback();
    }
}

function event_template_update_unique(data = null){
    if(data==null){
        var table = $('#'+event_template_table_id);
        var data = table.bootstrapTable("getData");
    }
    event_template_names = [];
    $.each(data,function(index){ event_template_names.push(data[index]["FieldName"])});
    event_template_doubles = getDoubles(event_template_names);
}


function show_event_template_editor(container){
    create_event_template_table(container,event_template_table_id,500);
    var table = $('#'+event_template_table_id);

    if(statusInStorage("eventArgEditorHistory")){
        var data = JSON.parse(statusFromStorage("eventArgEditorHistory"));

        event_template_names = [];
        $.each(data,function(index){ event_template_names.push(data[index]["FieldName"])});
        event_template_doubles = getDoubles(event_template_names);

        table.bootstrapTable('append',data);
        // event_template_uniqueness_warning();
    }

    var toolbar = container.find(".fixed-table-toolbar");

    toolbar.find(".needs-select").addClass("disabled");

    event_template_modals  = $("<div/>");
    container.append(event_template_modals);

    table.on('all.bs.table',
    // table.on('check.bs.table check-all.bs.table check-some.bs.table uncheck.bs.table uncheck-all.bs.table uncheck-some.bs.table',
        function(){
            if(event_template_lock_list.length>0) return;

            var selection =  table.bootstrapTable('getSelections');
            if(selection.length>0 && event_template_lock_list.length==0){
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


    table.on('pre-body.bs.table',function(args,data){
        event_template_update_unique(data);
        event_template_uniqueness_warning();
        // event_template_uniqueness_warning();
    })

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
            className: 'btn-outline-dark'
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

                    // event_template_update_unique();
                    // $('#'+event_template_table_id).bootstrapTable("resetSearch"); // to call the formatter...
                    $('#'+event_template_table_id).bootstrapTable("uncheckAll");
                }
            }
            });


    })

    toolbar.find("#toolbar_add").on("click",function(e){
        show_event_template_modal_add_form(event_template_modals,table);
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

        // event_template_update_unique();
        // table.bootstrapTable("resetSearch"); // to call the formatter...
    })


    toolbar.find("#toolbar_event_template_json_import").on("click",function(e){
        show_event_template_modal_json_import_form(event_template_modals,table);
    })

    toolbar.find("#toolbar_generate_JSON").on("click",function(e){
        event_template_uniqueness_warning(function(){
            show_event_template_modal_json_export_form(event_template_modals, table);

        });
    })

    toolbar.find("#toolbar_export_to_event_defs").on("click",function(e){
        event_template_uniqueness_warning(function(){
            show_event_template_in_template_defs(table);

        });
    })

    toolbar.find("#toolbar_preview_event_form").on("click",function(e){
        show_event_template_modal_preview(event_template_modals, table);

        event_template_content_name = "preview_event_form";
        $( document ).trigger( "_lock", [ "preview_event_form" ] );
    })


    $( document ).on( "operate_lock", {},
        function( event ) {
            if(event_template_lock_list.length!=0){
                $(document).find(".lockable").addClass("disabled");
                if(!event_template_lock_list.includes("search")) $(document).find(".search-input").prop( "disabled", true );
                $(document).find(".sortable").prop( "disabled", true );
            }
            else{
                // $(event_template_content).empty();
                $(document).find(".lockable").not(".needs-select").removeClass("disabled");
                if(!event_template_lock_list.includes("search")) $(document).find(".search-input").prop( "disabled", false );
                $(document).find(".sortable").prop( "disabled", false );
            }
        }
    );

    $( document ).on( "_lock", {},
    function( event, lock_name ) {
        if(!(lock_name == "" || lock_name == null )){
            event_template_lock_list.push(lock_name);
            // console.log("Lock ["+lock_name+"] acquired.");
            $(this).trigger("operate_lock",[]);
        }
    });

    $( document ).on( "_release", {},
    function( event, lock_name ) {
        if(!(lock_name == "" || lock_name == null )){
            event_template_lock_list = _.without(event_template_lock_list,lock_name);
            // console.log("Lock ["+lock_name+"] released.");
            $(this).trigger("operate_lock",[]);
        }
    });

    table.on('all.bs.table',function(args,name){
        console.log(name)
    })
    

}