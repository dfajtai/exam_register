function location_definition_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "location_definitions"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function location_definition_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        dataType: "json",
        data: ({table_name: "location_definitions",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function location_definition_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    dataType: "json",
    data: ({table_name: "location_definitions", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}


function initLocationDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'ID', field : 'LocationID', align:'center', sortable:true, searchable:false, visible:false},
                {title: 'Name', field : 'LocationName', align:'center', sortable:true, searchable:true},
                {title: 'Desc', field : 'LocationDesc', align:'center', sortable:true, searchable:true},
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
    
    table.bootstrapTable('refreshOptions', { ajax:location_definition_retrieve_ajax });

    modalInsert("Location", container,"location_modal_add_new",tableId, locationDefinitionInputs, location_definition_insert_ajax);
    modalUpdate("Location", container,"location_modal_edit_selected",tableId, locationDefinitionInputs, location_definition_update_ajax,"LocationID");

}

function locationDefinitionInputs(container){
    var nameForm = $("<div/>").addClass("row mb-3");
    nameForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Name"));
    var nameInput = $("<div/>").addClass("col-sm-9");
    nameInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","name").attr("name","LocationName").prop('required',true));
    nameForm.append(nameInput);

    var descForm = $("<div/>").addClass("row mb-3");
    descForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Description"));
    var descInput = $("<div/>").addClass("col-sm-9");
    descInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","desc").attr("name","LocationDesc").prop('required',false));
    descForm.append(descInput);

    container.append(nameForm);
    container.append(descForm);
}