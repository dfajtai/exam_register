function consumable_definition_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "consumable_definitions"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function consumable_definition_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        dataType: "json",
        data: ({table_name: "consumable_definitions",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function consumable_definition_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    dataType: "json",
    data: ({table_name: "consumable_definitions", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}

function consumable_def_formatter(consumable_def){
    if(!isObject(consumable_def)){
        return consumable_def;
    }

    function format_value(value,col){
        switch (col) {
            case "ConsumableType":
                return consumableTypeFormatter(value,null);
                break;
            case "ConsumableUnitType":
                return unitTypeFormatter(value,null);
                break;            
            
            default:
                return value;
                break;
        }
    }

    var res  = {};
    $.each(consumable_def,function(key,value){
        res[key] = format_value(value,key);
    })

    return res;
}


function initConsumableDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'ID', field : 'ConsumableID', align:'center', sortable:true, searchable:false, visible:false},
                {title: 'Name', field : 'ConsumableName', align:'center', sortable:true, searchable:true},
                {title: 'Consumable Type', field : 'ConsumableType', align:'center', sortable:true, searchable:true, formatter: 'consumableTypeFormatter'},
                {title: 'Desc', field : 'ConsumableDesc', align:'center', sortable:true, searchable:false},
                {title: 'Unit Type', field : 'ConsumableUnitType', align:'center', sortable:true, searchable:true, formatter: 'unitTypeFormatter'},
            ],
            search:true,
            pagination:true,
            showExport:true,
            exportUnitTypes: ['csv','json','excel','doc','txt','sql','xml',"pdf"],
            exportDataUnitType: 'all',
            checkboxHeader:false,
            smartDisplay:true,
            autoRefresh:true,
            autoRefreshStatus:false,
            showAutoRefresh:true,
            detailFormatter: function(index,row){return detail_as_table_formatter(index,row,consumable_def_formatter)}
        });
    
    table.bootstrapTable('refreshOptions', { ajax:consumable_definition_retrieve_ajax });

    modalInsert("Consumable", container,"consumable_modal_add_new",tableId, consumableDefinitionInputs, consumable_definition_insert_ajax);
    modalUpdate("Consumable", container,"consumable_modal_edit_selected",tableId, consumableDefinitionInputs, consumable_definition_update_ajax,"ConsumableID");

    container.find("#consumable_modal_add_new").find(".modal-dialog").addClass("modal-lg");
    container.find("#consumable_modal_edit_selected").find(".modal-dialog").addClass("modal-lg");

    table.on('load-success.bs.table',function(e,data,status){
        updateRemoteDefinitionChecksum("consumable_definitions",data["rows"]);
    })

}

function consumableDefinitionInputs(container){
    var params =  [
        {"FieldName":"ConsumableName","FieldLabel":"Name","FieldDataType":"text","FieldType":"input","FieldRequired":true},
        {"FieldName":"ConsumableType","FieldLabel":"Type","FieldType":"select","FieldSource":"consumable_type","FieldRequired":true},
        {"FieldName":"ConsumableDesc","FieldLabel":"Description","FieldDataType":"text","FieldType":"input","FieldRequired":false},
        {"FieldName":"ConsumableUnitType","FieldLabel":"UnitType","FieldType":"select","FieldSource":"unit_type","FieldRequired":true},
        ]
    
    showCustomArgs(container,params);


}
