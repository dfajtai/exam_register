function specimen_bodypart_definitions_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "specimen_bodypart_definitions"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function specimen_bodypart_definitions_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        dataType: "json",
        data: ({table_name: "specimen_bodypart_definitions",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function specimen_bodypart_definitions_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    dataType: "json",
    data: ({table_name: "specimen_bodypart_definitions", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}


function initSpecimenBodypartDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable("destroy").bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                //{title: 'ID', field : 'UnitTypeID', align:'center', sortable:true, searchable:true},
                {title: 'Name', field : 'SpecimenBodypartName', align:'center', sortable:true, searchable:true},
                {title: 'Desc', field : 'SpecimenBodypartDesc', align:'center', sortable:true, searchable:true},
                {title: 'Side', field : 'SpecimenBodypartSide', align:'center', sortable:true, searchable:true, formatter: 'sideFormatter'},
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
    
    table.bootstrapTable('refreshOptions', { ajax:specimen_bodypart_definitions_retrieve_ajax });

    modalInsert("BodyPart", container,"bodypart_modal_add_new",tableId, bodypartDefinitionInputs, specimen_bodypart_definitions_insert_ajax);
    modalUpdate("BodyPart", container,"bodypart_modal_edit_selected",tableId, bodypartDefinitionInputs, specimen_bodypart_definitions_update_ajax,"SpecimenBodypartID");

}

function bodypartDefinitionInputs(container){


    var nameForm = $("<div/>").addClass("row mb-3");
    nameForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Name"));
    var nameInput = $("<div/>").addClass("col-sm-9");
    nameInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","name").attr("name","SpecimenBodypartName").prop('required',true));
    nameForm.append(nameInput);

    var descForm = $("<div/>").addClass("row mb-3");
    descForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Description"));
    var descInput = $("<div/>").addClass("col-sm-9");
    descInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","desc").attr("name","SpecimenBodypartDesc").prop('required',false));
    descForm.append(descInput);


    var side_defs = JSON.parse(localStorage.getItem("specimen_side_definitions"));

    var sideForm = $("<div/>").addClass("row mb-3");
    sideForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Side"));
    var sideSelect = $("<div/>").addClass("col-sm-9");

    var side_select_dropdow = $("<select/>").addClass("form-select required").attr("side","text").attr("id","side").attr("name","SpecimenBodypartSide").prop('required',true);
    side_select_dropdow.append($("<option/>").html("Choose Side...").attr('selected',"selected").attr("disabled","disabled").attr("value",""));
    $.each(side_defs,function(key,entry){
        side_select_dropdow.append($("<option/>").html("&lt;"+entry.SideShortName+"&gt; " +  entry.SideName).attr("value",entry.SideID))
    });

    sideSelect.append(side_select_dropdow);
    sideForm.append(sideSelect);

    container.append(nameForm);
    container.append(descForm);
    container.append(sideForm);
}