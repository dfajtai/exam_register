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

function bodypart_def_formatter(bodypart_def){
    if(!isObject(bodypart_def)){
        return bodypart_def;
    }

    function format_value(value,col){
        switch (col) {
            case "Side":
                return sideFormatter(value,null);
                break;
        
            default:
                return value;
                break;
        }
    }

    var res  = {};
    $.each(bodypart_def,function(key,value){
        res[key] = format_value(value,key);
    })

    return res;
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
            detailFormatter: function(index,row){return detail_as_table_formatter(index,row,bodypart_def_formatter)}
        });
    
    table.bootstrapTable('refreshOptions', { ajax:bodypart_definitions_retrieve_ajax });

    modalInsert("BodyPart", container,"bodypart_modal_add_new",tableId, bodypartDefinitionInputs, bodypart_definitions_insert_ajax);
    modalUpdate("BodyPart", container,"bodypart_modal_edit_selected",tableId, bodypartDefinitionInputs, bodypart_definitions_update_ajax,"BodypartID");
    
    table.on('load-success.bs.table',function(e,data,status){
        updateRemoteDefinitionChecksum("bodypart_definitions",data["rows"]);
    })
}

function bodypartDefinitionInputs(container){
    var params =  [
        {"FieldName":"BodypartName","FieldLabel":"Name","FieldDataType":"text","FieldType":"input","FieldRequired":true},
        {"FieldName":"BodypartDesc","FieldLabel":"Description","FieldDataType":"text","FieldType":"input","FieldRequired":false},
        {"FieldName":"BodypartSide","FieldLabel":"Side","FieldType":"select","FieldSource":"side","FieldRequired":true},
        ]
    
    showCustomArgs(container,params);


}