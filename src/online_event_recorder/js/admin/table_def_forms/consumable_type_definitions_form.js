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
    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'ID', field : 'ConsumableTypeID', align:'center', sortable:true, searchable:false, visible:false},
                {title: 'Name', field : 'ConsumableTypeName', align:'center', sortable:true, searchable:true},
                {title: 'Desc', field : 'ConsumableTypeDesc', align:'center', sortable:true, searchable:true},
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
    
    table.bootstrapTable('refreshOptions', { ajax:consumable_type_definition_retrieve_ajax });

    modalInsert("ConsumableType", container,"consumable_type_modal_add_new",tableId, consumableTypeDefinitionInputs, consumable_type_definition_insert_ajax);
    modalUpdate("ConsumableType", container,"consumable_type_modal_edit_selected",tableId, consumableTypeDefinitionInputs, consumable_type_definition_update_ajax,"ConsumableTypeID");
    
    table.on('load-success.bs.table',function(e,data,status){
        updateRemoteDefinitionChecksum("consumable_type_definitions",data["rows"]);
    })
}

function consumableTypeDefinitionInputs(container){
    var params =  [
        {"FieldName":"ConsumableTypeName","FieldLabel":"Name","FieldDataType":"text","FieldType":"input","FieldRequired":true},
        {"FieldName":"ConsumableTypeDesc","FieldLabel":"Description","FieldDataType":"text","FieldType":"input","FieldRequired":false},
        ]
    
    showCustomArgs(container,params);

}