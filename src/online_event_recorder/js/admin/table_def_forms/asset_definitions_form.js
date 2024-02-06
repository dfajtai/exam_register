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

function asset_def_formatter(asset_def){
    if(!isObject(asset_def)){
        return asset_def;
    }

    function format_value(value,col){
        switch (col) {
            case "AssetLocation":
                return locationFormatter(value,null);
                break;            
        
            default:
                return value;
                break;
        }
    }

    var res  = {};
    $.each(asset_def,function(key,value){
        res[key] = format_value(value,key);
    })
    return res;
}


function initAssetDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'ID', field : 'AssetID', align:'center', sortable:true, searchable:false, visible:false},
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
            detailFormatter: function(index,row){return detail_as_table_formatter(index,row,asset_def_formatter)}
        });
    
    table.bootstrapTable('refreshOptions', { ajax: asset_definition_retrieve_ajax });

    modalInsert("Asset", container,"asset_modal_add_new",tableId, assetDefinitionInputs, asset_definition_insert_ajax);
    modalUpdate("Asset", container,"asset_modal_edit_selected",tableId, assetDefinitionInputs, asset_definition_update_ajax,"AssetID");

    table.on('load-success.bs.table',function(e,data,status){
        updateRemoteDefinitionChecksum("asset_definitions",data["rows"]);
    })
}

function assetDefinitionInputs(container){
    var params =  [
        {"FieldName":"AssetName","FieldLabel":"Name","FieldDataType":"text","FieldType":"input","FieldRequired":true},
        {"FieldName":"AssetLocation","FieldLabel":"Location","FieldType":"select","FieldSource":"location","FieldRequired":true},
        {"FieldName":"AssetOwner","FieldLabel":"Owner","FieldDataType":"text","FieldDefaultValue":"Medicoups","FieldType":"input","FieldRequired":true},
        {"FieldName":"AssetDesc","FieldLabel":"Description","FieldDataType":"text","FieldType":"input","FieldRequired":false},
        ]
    
    showCustomArgs(container,params);

}
