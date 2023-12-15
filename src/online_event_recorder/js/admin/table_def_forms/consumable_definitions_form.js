function consumable_definition_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "consumable_definitions"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function consumable_definition_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        dataType: "json",
        data: ({table_name: "consumable_definitions",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function consumable_definition_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    dataType: "json",
    data: ({table_name: "consumable_definitions", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}



function initConsumableDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'ID', field : 'ConsumableID', align:'center', sortable:true, searchable:false},
                {title: 'Name', field : 'ConsumableName', align:'center', sortable:true, searchable:true},
                {title: 'Consumable Type', field : 'ConsumableType', align:'center', sortable:true, searchable:true, formatter: 'consumableTypeFormatter'},
                {title: 'Desc', field : 'ConsumableDesc', align:'center', sortable:true, searchable:false},
                {title: 'Unit Type', field : 'ConsumableUnitType', align:'center', sortable:true, searchable:true, formatter: 'unitTypeFormatter'},
            ],
            search:true,
            pagination:true,
            showExport:true,
            exportUnitTypes: ['csv','json','excel','doc','txt','sql','xml',"pdf"],
            exportDataUnitType: 'all',
            checkboxHeader:false,
            smartDisplay:true,
            autoRefresh:true,
            autoRefreshStatus:false,
            showAutoRefresh:true,
            detailFormatter:simpleFlatFormatter
        });
    
    table.bootstrapTable('refreshOptions', { ajax:consumable_definition_retrieve_ajax });

    modalInsert("Consumable", container,"consumable_modal_add_new",tableId, consumableDefinitionInputs, consumable_definition_insert_ajax);
    modalUpdate("Consumable", container,"consumable_modal_edit_selected",tableId, consumableDefinitionInputs, consumable_definition_update_ajax,"ConsumableID");
}

function consumableDefinitionInputs(container){
    var consumabletypeForm = $("<div/>").addClass("row mb-3");
    consumabletypeForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Cons.Type"));
    var consumabletypeSelect = $("<div/>").addClass("col-sm-9");

    var consumabletype_select_dropdow = $("<select/>").addClass("form-select required").attr("type","text").attr("id","consumabletype").attr("name","ConsumableType").prop('required',true);
    consumabletype_select_dropdow.append($("<option/>").html("Choose ConsumableType...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    $.each(defs.consumable_type_definitions,function(key,entry){
        consumabletype_select_dropdow.append($("<option/>").html(entry.ConsumableTypeName).attr("value",entry.ConsumableTypeID))
    });

    consumabletypeSelect.append(consumabletype_select_dropdow);
    consumabletypeForm.append(consumabletypeSelect);

    var nameForm = $("<div/>").addClass("row mb-3");
    nameForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Name"));
    var nameInput = $("<div/>").addClass("col-sm-9");
    nameInput.append($("<input/>").addClass("form-control").attr("unittype","text").attr("id","name").attr("name","ConsumableName").prop('required',true));
    nameForm.append(nameInput);

    var descForm = $("<div/>").addClass("row mb-3");
    descForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Description"));
    var descInput = $("<div/>").addClass("col-sm-9");
    descInput.append($("<input/>").addClass("form-control").attr("unittype","text").attr("id","desc").attr("name","ConsumableDesc").prop('required',false));
    descForm.append(descInput);

    var unittypeForm = $("<div/>").addClass("row mb-3");
    unittypeForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("UnitType"));
    var unittypeSelect = $("<div/>").addClass("col-sm-9");

    var unittype_select_dropdow = $("<select/>").addClass("form-select required").attr("type","text").attr("id","unittype").attr("name","ConsumableUnitType").prop('required',true);
    unittype_select_dropdow.append($("<option/>").html("Choose UnitType...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    $.each(defs.unit_type_definitions,function(key,entry){
        unittype_select_dropdow.append($("<option/>").html(entry.UnitTypeName).attr("value",entry.UnitTypeID))
    });

    unittypeSelect.append(unittype_select_dropdow);
    unittypeForm.append(unittypeSelect);


    container.append(nameForm);
    container.append(consumabletypeForm);
    container.append(descForm);
    container.append(unittypeForm);
}
