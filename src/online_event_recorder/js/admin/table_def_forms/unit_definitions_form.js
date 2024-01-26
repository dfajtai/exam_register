function unit_definition_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "unit_definitions"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function unit_definition_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        dataType: "json",
        data: ({table_name: "unit_definitions",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function unit_definition_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    dataType: "json",
    data: ({table_name: "unit_definitions", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}

function initUnitDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'ID', field : 'UnitID', align:'center', sortable:true, searchable:false, visible:false},
                {title: 'Type', field : 'UnitType', align:'center', sortable:true, searchable:true, formatter: 'unitTypeFormatter'},
                {title: 'Name', field : 'UnitName', align:'center', sortable:true, searchable:true},
                {title: 'Unit', field : 'UnitUnit', align:'center', sortable:true, searchable:true},
                {title: 'Amount', field : 'UnitAmount', align:'center', sortable:true, searchable:false},
                {title: 'Desc', field : 'UnitDesc', align:'center', sortable:true, searchable:false},
            ],
            search:true,
            pagination:true,
            showExport:true,
            exportTypes: ['csv','json','excel','doc','txt','sql','xml',"pdf"],
            exportDataType: 'all',
            checkboxHeader:false,
            smartDisplay:true,
            autoRefresh:true,
            autoRefreshStatus:false,
            showAutoRefresh:true,
            detailFormatter:detail_as_table_formatter
        });
    
    table.bootstrapTable('refreshOptions', { ajax:unit_definition_retrieve_ajax });

    modalInsert("Unit", container,"unit_modal_add_new",tableId, unitDefinitionInputs, unit_definition_insert_ajax);
    modalUpdate("Unit", container,"unit_modal_edit_selected",tableId, unitDefinitionInputs, unit_definition_update_ajax,"UnitID");
}

function unitDefinitionInputs(container){
    var typeForm = $("<div/>").addClass("row mb-3");
    typeForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Type"));
    var typeSelect = $("<div/>").addClass("col-sm-9");

    var type_select_dropdow = $("<select/>").addClass("form-select required").attr("type","text").attr("id","type").attr("name","UnitType").prop('required',true);
    type_select_dropdow.append($("<option/>").html("Choose UnitType...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    $.each(defs.unit_type_definitions,function(key,entry){
        type_select_dropdow.append($("<option/>").html(entry.UnitTypeName).attr("value",entry.UnitTypeID))
    });

    typeSelect.append(type_select_dropdow);
    typeForm.append(typeSelect);

    var nameForm = $("<div/>").addClass("row mb-3");
    nameForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Name"));
    var nameInput = $("<div/>").addClass("col-sm-9");
    nameInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","name").attr("name","UnitName").prop('required',true));
    nameForm.append(nameInput);

    var unitForm = $("<div/>").addClass("row mb-3");
    unitForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Unit"));
    var unitInput = $("<div/>").addClass("col-sm-9");
    unitInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","unit").attr("name","UnitUnit").prop('required',true));
    unitForm.append(unitInput);

    var amountForm = $("<div/>").addClass("row mb-3");
    amountForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Amount"));
    var amountInput = $("<div/>").addClass("col-sm-9");
    amountInput.append($("<input/>").addClass("form-control").attr("type","number").attr("step","0.01").attr("id","amount").attr("name","UnitAmount").prop('required',true));
    amountForm.append(amountInput);

    var descForm = $("<div/>").addClass("row mb-3");
    descForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Description"));
    var descInput = $("<div/>").addClass("col-sm-9");
    descInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","desc").attr("name","UnitDesc").prop('required',false));
    descForm.append(descInput);


    container.append(typeForm);
    container.append(nameForm);
    container.append(unitForm);
    container.append(amountForm);
    container.append(descForm);
}
