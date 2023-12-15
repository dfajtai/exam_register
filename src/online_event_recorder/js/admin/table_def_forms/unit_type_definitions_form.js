function unit_type_definition_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "unit_type_definitions"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function unit_type_definition_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        dataType: "json",
        data: ({table_name: "unit_type_definitions",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function unit_type_definition_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    dataType: "json",
    data: ({table_name: "unit_type_definitions", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}


function initUnitTypeDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'ID', field : 'UnitTypeID', align:'center', sortable:true, searchable:false},
                {title: 'Name', field : 'UnitTypeName', align:'center', sortable:true, searchable:true},
                {title: 'Desc', field : 'UnitTypeDesc', align:'center', sortable:true, searchable:true},
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
            detailFormatter:simpleFlatFormatter
        });
    
    table.bootstrapTable('refreshOptions', { ajax:unit_type_definition_retrieve_ajax });

    modalInsert("UnitType", container,"unit_type_modal_add_new",tableId, unitTypeDefinitionInputs, unit_type_definition_insert_ajax);
    modalUpdate("UnitType", container,"unit_type_modal_edit_selected",tableId, unitTypeDefinitionInputs, unit_type_definition_update_ajax,"UnitTypeID");

}

function unitTypeDefinitionInputs(container){
    var nameForm = $("<div/>").addClass("row mb-3");
    nameForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Name"));
    var nameInput = $("<div/>").addClass("col-sm-9");
    nameInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","name").attr("name","UnitTypeName").prop('required',true));
    nameForm.append(nameInput);

    var descForm = $("<div/>").addClass("row mb-3");
    descForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Description"));
    var descInput = $("<div/>").addClass("col-sm-9");
    descInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","desc").attr("name","UnitTypeDesc"));
    descForm.append(descInput);

    container.append(nameForm);
    container.append(descForm);
}