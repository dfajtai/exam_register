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
            detailFormatter: function(index,row){return detail_as_table_formatter(index,row,null)}
        });
    
    table.bootstrapTable('refreshOptions', { ajax:location_definition_retrieve_ajax });

    modalInsert("Location", container,"location_modal_add_new",tableId, locationDefinitionInputs, location_definition_insert_ajax);
    modalUpdate("Location", container,"location_modal_edit_selected",tableId, locationDefinitionInputs, location_definition_update_ajax,"LocationID");
    
    table.on('load-success.bs.table',function(e,data,status){
        updateRemoteDefinitionChecksum("location_definitions",data["rows"]);
    })

}

function locationDefinitionInputs(container){
    var params =  [
        {"FieldName":"LocationName","FieldLabel":"Name","FieldDataType":"text","FieldType":"input","FieldRequired":true},
        {"FieldName":"LocationDesc","FieldLabel":"Description","FieldDataType":"text","FieldType":"input","FieldRequired":false},
        ]
    
    showCustomArgs(container,params);

}