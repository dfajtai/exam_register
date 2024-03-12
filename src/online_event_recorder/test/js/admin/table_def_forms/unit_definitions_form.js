function unit_definition_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "unit_definitions"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function unit_definition_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        dataType: "json",
        data: ({table_name: "unit_definitions",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function unit_definition_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    dataType: "json",
    data: ({table_name: "unit_definitions", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}

function unit_definition_formatter(unit_definition){
    if(!isObject(unit_definition)){
        return unit_definition;
    }

    function format_value(value,col){
        switch (col) {
            case "UnitType":
                return eventFormatter(value,null);
                break;
                    
            default:
                return value;
                break;
        }
    }

    var res  = {};
    $.each(unit_definition,function(key,value){
        res[key] = format_value(value,key);
    })

    return res;
}

function initUnitDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'ID', field : 'UnitID', align:'center', sortable:true, searchable:false, visible:false},
                {title: 'Type', field : 'UnitType', align:'center', sortable:true, searchable:true, formatter: 'unitTypeFormatter'},
                {title: 'Name', field : 'UnitName', align:'center', sortable:true, searchable:true},
                {title: 'Unit', field : 'UnitUnit', align:'center', sortable:true, searchable:true},
                {title: 'Amount', field : 'UnitAmount', align:'center', sortable:true, searchable:false},
                {title: 'Desc', field : 'UnitDesc', align:'center', sortable:true, searchable:false},
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
            detailFormatter: function(index,row){return detail_as_table_formatter(index,row,unit_definition_formatter)}
        });
    
    table.bootstrapTable('refreshOptions', { ajax:unit_definition_retrieve_ajax });

    modalInsert("Unit", container,"unit_modal_add_new",tableId, unitDefinitionInputs, unit_definition_insert_ajax);
    modalUpdate("Unit", container,"unit_modal_edit_selected",tableId, unitDefinitionInputs, unit_definition_update_ajax,"UnitID");

    table.on('load-success.bs.table',function(e,data,status){
        updateRemoteDefinitionChecksum("unit_definitions",data["rows"]);
    })
}

function unitDefinitionInputs(container){
    var params =  [
        {"FieldName":"UnitType","FieldLabel":"Type","FieldType":"select","FieldSource":"unit_type","FieldRequired":true},
        {"FieldName":"UnitName","FieldLabel":"Name","FieldDataType":"text","FieldType":"input","FieldRequired":true},
        {"FieldName":"UnitUnit","FieldLabel":"Unit","FieldDataType":"text","FieldType":"input","FieldRequired":true},
        {"FieldName":"UnitAmount","FieldLabel":"Amount","FieldDataType":"numeric","FieldDataStep":"0.1", "FieldType":"input","FieldRequired":false},
        {"FieldName":"UnitDesc","FieldLabel":"Description","FieldDataType":"text","FieldType":"input","FieldRequired":false},
        ]
    
    showCustomArgs(container,params);
}
