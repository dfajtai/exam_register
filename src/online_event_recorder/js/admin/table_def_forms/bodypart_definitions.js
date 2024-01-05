function bodypart_definitions_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "bodypart_definitions"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function bodypart_definitions_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        dataType: "json",
        data: ({table_name: "bodypart_definitions",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function bodypart_definitions_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    dataType: "json",
    data: ({table_name: "bodypart_definitions", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}


function initBodypartDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'ID', field : 'BodypartID', align:'center', sortable:true, searchable:false, visible:false},
                {title: 'Name', field : 'BodypartName', align:'center', sortable:true, searchable:true},
                {title: 'Desc', field : 'BodypartDesc', align:'center', sortable:true, searchable:true},
                {title: 'Side', field : 'BodypartSide', align:'center', sortable:true, searchable:true, formatter: 'sideFormatter'},
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
    
    table.bootstrapTable('refreshOptions', { ajax:bodypart_definitions_retrieve_ajax });

    modalInsert("BodyPart", container,"bodypart_modal_add_new",tableId, bodypartDefinitionInputs, bodypart_definitions_insert_ajax);
    modalUpdate("BodyPart", container,"bodypart_modal_edit_selected",tableId, bodypartDefinitionInputs, bodypart_definitions_update_ajax,"BodypartID");

}

function bodypartDefinitionInputs(container){


    var nameForm = $("<div/>").addClass("row mb-3");
    nameForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Name"));
    var nameInput = $("<div/>").addClass("col-sm-9");
    nameInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","name").attr("name","BodypartName").prop('required',true));
    nameForm.append(nameInput);

    var descForm = $("<div/>").addClass("row mb-3");
    descForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Description"));
    var descInput = $("<div/>").addClass("col-sm-9");
    descInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","desc").attr("name","BodypartDesc").prop('required',false));
    descForm.append(descInput);

    var sideForm = $("<div/>").addClass("row mb-3");
    sideForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Side"));
    var sideSelect = $("<div/>").addClass("col-sm-9");

    var side_select_dropdow = $("<select/>").addClass("form-select required").attr("side","text").attr("id","side").attr("name","BodypartSide").prop('required',true);
    side_select_dropdow.append($("<option/>").html("Choose Side...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    $.each(defs.side_definitions,function(key,entry){
        side_select_dropdow.append($("<option/>").html("&lt;"+entry.SideShortName+"&gt; " +  entry.SideName).attr("value",entry.SideID))
    });

    sideSelect.append(side_select_dropdow);
    sideForm.append(sideSelect);

    container.append(nameForm);
    container.append(descForm);
    container.append(sideForm);
}