function asset_definition_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "asset_definitions"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function asset_definition_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        dataType: "json",
        data: ({table_name: "asset_definitions",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function asset_definition_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    dataType: "json",
    data: ({table_name: "asset_definitions", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}

function initAssetDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'ID', field : 'AssetID', align:'center', sortable:true, searchable:false},
                {title: 'Name', field : 'AssetName', align:'center', sortable:true, searchable:true},
                {title: 'Location', field : 'AssetLocation', align:'center', sortable:true, searchable:true, formatter: 'locationFormatter'},
                {title: 'Owner', field : 'AssetOwner', align:'center', sortable:true, searchable:false},
                {title: 'Desc', field : 'AssetDesc', align:'center', sortable:true, searchable:false},
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
    
    table.bootstrapTable('refreshOptions', { ajax:asset_definition_retrieve_ajax });

    modalInsert("Asset", container,"asset_modal_add_new",tableId, assetDefinitionInputs, asset_definition_insert_ajax);
    modalUpdate("Asset", container,"asset_modal_edit_selected",tableId, assetDefinitionInputs, asset_definition_update_ajax,"AssetID");
}

function assetDefinitionInputs(container){

    var nameForm = $("<div/>").addClass("row mb-3");
    nameForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Name"));
    var nameInput = $("<div/>").addClass("col-sm-9");
    nameInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","name").attr("name","AssetName").prop('required',true));
    nameForm.append(nameInput);


    var locationForm = $("<div/>").addClass("row mb-3");
    locationForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Location"));
    var locationSelect = $("<div/>").addClass("col-sm-9");

    var location_select_dropdow = $("<select/>").addClass("form-select required").attr("type","text").attr("id","type").attr("name","AssetLocation").prop('required',true);
    location_select_dropdow.append($("<option/>").html("Choose Location...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    $.each(defs.location_definitions,function(key,entry){
        location_select_dropdow.append($("<option/>").html(entry.LocationName).attr("value",entry.LocationID))
    });

    locationSelect.append(location_select_dropdow);
    locationForm.append(locationSelect);

    var ownerForm = $("<div/>").addClass("row mb-3");
    ownerForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Owner"));
    var ownerInput = $("<div/>").addClass("col-sm-9");
    ownerInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","owner").attr("name","AssetOwner").attr("value","Medicoups").prop('required',true));
    ownerForm.append(ownerInput);

    var descForm = $("<div/>").addClass("row mb-3");
    descForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Description"));
    var descInput = $("<div/>").addClass("col-sm-9");
    descInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","desc").attr("name","AssetDesc").prop('required',false));
    descForm.append(descInput);


    container.append(nameForm);
    container.append(locationForm);
    container.append(ownerForm);
    container.append(descForm);
}
