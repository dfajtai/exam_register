function event_type_definition_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "event_type_definitions"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function event_type_definition_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        dataType: "json",
        data: ({table_name: "event_type_definitions",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function event_type_definition_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    dataType: "json",
    data: ({table_name: "event_type_definitions", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}


function initEventTypeDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'ID', field : 'EventTypeID', align:'center', sortable:true, searchable:false, visible:false},
                {title: 'Name', field : 'EventTypeName', align:'center', sortable:true, searchable:true},
                {title: 'Desc', field : 'EventTypeDesc', align:'center', sortable:true, searchable:true},
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
            detailFormatter: function(index,row){return detail_as_table_formatter(index,row,null)}
        });
    
    table.bootstrapTable('refreshOptions', { ajax:event_type_definition_retrieve_ajax });

    modalInsert("EventType", container,"event_type_modal_add_new",tableId, eventTypeDefinitionInputs, event_type_definition_insert_ajax);
    modalUpdate("EventType", container,"event_type_modal_edit_selected",tableId, eventTypeDefinitionInputs, event_type_definition_update_ajax,"EventTypeID");
    
    table.on('load-success.bs.table',function(e,data,status){
        updateRemoteDefinitionChecksum("event_type_definitions",data["rows"]);
    })

}

function eventTypeDefinitionInputs(container){
    var params =  [
        {"FieldName":"EventTypeName","FieldLabel":"Name","FieldDataType":"text","FieldType":"input","FieldRequired":true},
        {"FieldName":"EventTypeDesc","FieldLabel":"Description","FieldDataType":"text","FieldType":"input","FieldRequired":false},
        ]
    
    showCustomArgs(container,params);

}