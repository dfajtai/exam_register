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

function event_template_def_formatter(event_template_def){
    if(!isObject(event_template_def)){
        return event_template_def;
    }

    function format_value(value,col){
        switch (col) {
            case "EventType":
                return eventTypeFormatter(value,null);
                break;
        
            default:
                return value;
                break;
        }
    }

    var res  = {};
    $.each(event_template_def,function(key,value){
        res[key] = format_value(value,key);
    })

    return res;
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
            detailFormatter: function(index,row){return detail_as_table_formatter(index,row,event_template_def_formatter)}
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
                    values[field.name] = get_readable_value(form,field.name,field.value);
                }
                
            });

            var table = object_to_table_formatter(values);
            bootbox.alert('Values read:</br>'+$(table).prop("outerHTML"));
        })

        var data = JSON.parse(table.bootstrapTable("getSelections")[0]["EventFormJSON"]);
        modal_body.empty();
        showCustomArgs(form,data);
        modal_body.append(form);

        modal.modal('show');

        modal.on("hide.bs.modal",function(){

        });

    });

    table.on('load-success.bs.table',function(e,data,status){
        updateRemoteDefinitionChecksum("event_template_definitions",data["rows"]);
    })

    if(statusInUrl("addNewEventDef")){
        var params = statusFromUrl("addNewEventDef");
        var modal = $("#event_modal_add_new");
        modal.on("shown.bs.modal",function(){
            modal.find("#EventFormJSONInput").first().val(params).trigger("change");
            modal.off("shown.bs.modal");
        })

        var btn = container.find("#toolbar_add").first().trigger("click");
        
    }

}

function eventDefinitionInputs(container){
    var params =  [
        {"FieldName":"EventName","FieldLabel":"Name","FieldDataType":"text","FieldType":"input","FieldRequired":true},
        {"FieldName":"EventType","FieldLabel":"Type","FieldType":"select","FieldSource":"event_type","FieldRequired":true},
        {"FieldName":"EventDesc","FieldLabel":"Description","FieldDataType":"text","FieldType":"input","FieldRequired":false},
        {"FieldName":"EventFormJSON","FieldLabel":"Event form params","FieldDataType":"longtext","FieldType":"input","FieldRequired":false,"FieldDefaultValue":"[]"},
        ]
    showCustomArgs(container,params);
}