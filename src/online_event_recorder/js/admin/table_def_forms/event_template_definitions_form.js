function event_definition_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "event_template_definitions"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function event_definition_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        dataType: "json",
        data: ({table_name: "event_template_definitions",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function event_definition_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    dataType: "json",
    data: ({table_name: "event_template_definitions", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}


function initEventDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'ID', field : 'EventTemplateID', align:'center', sortable:true, searchable:false, visible:false},
                {title: 'Name', field : 'EventName', align:'center', sortable:true, searchable:true},
                {title: 'Type', field : 'EventType', align:'center', sortable:true, searchable:true, formatter: 'eventTypeFormatter'},
                {title: 'Desc', field : 'EventDesc', align:'center', sortable:true, searchable:true},
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
    
    table.bootstrapTable('refreshOptions', { ajax:event_definition_retrieve_ajax });

    modalInsert("Event template", container,"event_modal_add_new",tableId, eventDefinitionInputs, event_definition_insert_ajax);
    modalUpdate("Event template", container,"event_modal_edit_selected",tableId, eventDefinitionInputs, event_definition_update_ajax,"EventTemplateID");
    
    container.find("#event_modal_add_new").find(".modal-dialog").addClass("modal-xl");
    container.find("#event_modal_edit_selected").find(".modal-dialog").addClass("modal-xl");
    

    // add preview button
    var toolbar_id = tableId + "_toolbar";
    var toolbar = $("#"+toolbar_id)

    var preview_btn = $("<button/>").attr("id","toolbar_preview").addClass("btn btn-outline-dark admin-table-toolbar-btn needs-select").html($("<i/>").addClass("fa fa-eye fa-solid me-2").attr("aria-hidden","true")).append("Preview Selected");
    toolbar.append(preview_btn);

    
    table.on('all.bs.table',
    function(){
        var selection =  table.bootstrapTable('getSelections');

        if(selection.length>0){
            $(document).find(".needs-select").removeClass("disabled");
        }
        else{
            $(document).find(".needs-select").addClass("disabled");
        }
    });

    preview_btn.on('click',function(){
        var modal_id = "event_args_preview_modal";
        event_args_modal(container, modal_id, "Event form preview");

        var modal = container.find("#"+modal_id);
        var modal_body = modal.find(".modal-body");

        var data = JSON.parse(table.bootstrapTable("getSelections")[0]["EventFormJSON"]);
        modal_body.empty();
        showCustomArgs(modal_body,data);

        modal.modal('show');

        modal.on("hide.bs.modal",function(){

        });

    });

}

function eventDefinitionInputs(container){
    var typeForm = $("<div/>").addClass("row mb-3");
    typeForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Type"));
    var typeSelect = $("<div/>").addClass("col-sm-9");

    var type_select_dropdow = $("<select/>").addClass("form-select required").attr("type","text").attr("id","type").attr("name","EventType").prop('required',true);
    type_select_dropdow.append($("<option/>").html("Choose EventType...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    $.each(defs.event_type_definitions,function(key,entry){
        type_select_dropdow.append($("<option/>").html(entry.EventTypeName).attr("value",entry.EventTypeID))
    });

    typeSelect.append(type_select_dropdow);
    typeForm.append(typeSelect);

    var nameForm = $("<div/>").addClass("row mb-3");
    nameForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Name"));
    var nameInput = $("<div/>").addClass("col-sm-9");
    nameInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","name").attr("name","EventName").prop('required',true));
    nameForm.append(nameInput);

    var descForm = $("<div/>").addClass("row mb-3");
    descForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Description"));
    var descInput = $("<div/>").addClass("col-sm-9");
    descInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","desc").attr("name","EventDesc"));
    descForm.append(descInput);

    var eventParamsForm = $("<div/>").addClass("row mb-3");
    eventParamsForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Event form params"));
    var eventParamsInput = $("<div/>").addClass("col-sm-9");
    eventParamsInput.append($("<textarea/>").addClass("form-control").attr("type","text").attr("id","params").attr("name","EventFormJSON").attr("rows",10));
    eventParamsForm.append(eventParamsInput);


    container.append(nameForm);
    container.append(typeForm);
    container.append(descForm);
    container.append(eventParamsForm);
}