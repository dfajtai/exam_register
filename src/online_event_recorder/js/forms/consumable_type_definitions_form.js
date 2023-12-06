function consumable_type_definition_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "consumable_type_definitions"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function consumable_type_definition_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        dataType: "json",
        data: ({table_name: "consumable_type_definitions",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function consumable_type_definition_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    dataType: "json",
    data: ({table_name: "consumable_type_definitions", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}


function initConsumableTypeDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable("destroy").bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                //{title: 'ID', field : 'UnitTypeID', align:'center', sortable:true, searchable:true},
                {title: 'Name', field : 'ConsumableTypeName', align:'center', sortable:true, searchable:true},
                {title: 'Desc', field : 'ConsumableTypeDesc', align:'center', sortable:true, searchable:true},
            ],
            search:true,
            pagination:true,
            showExport:true,
            exportTypes: ['csv','json','excel','doc','txt','sql','xml',"pdf"],
            exportDataType: 'all',
            clickToSelect:true,
            checkboxHeader:false,
            multipleSelectRow:true,
            smartDisplay:true,
            autoRefresh:true,
            autoRefreshStatus:false,
            showAutoRefresh:true
        });
    
    table.bootstrapTable('refreshOptions', { ajax:consumable_type_definition_retrieve_ajax });

    modalInsert("ConsumableType", container,"consumable_type_modal_add_new",tableId, consumableTypeDefinitionInputs, consumable_type_definition_insert_ajax);
    modalUpdate("ConsumableType", container,"consumable_type_modal_edit_selected",tableId, consumableTypeDefinitionInputs, consumable_type_definition_update_ajax,"ConsumableTypeID");

}

function consumableTypeDefinitionInputs(container){
    var nameForm = $("<div/>").addClass("row mb-3");
    nameForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Name"));
    var nameInput = $("<div/>").addClass("col-sm-9");
    nameInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","name").attr("name","ConsumableTypeName").prop('required',true));
    nameForm.append(nameInput);

    var descForm = $("<div/>").addClass("row mb-3");
    descForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Description"));
    var descInput = $("<div/>").addClass("col-sm-9");
    descInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","desc").attr("name","ConsumableTypeDesc").prop('required',false));
    descForm.append(descInput);

    container.append(nameForm);
    container.append(descForm);
}