function study_definition_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "studies"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function study_definition_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        dataType: "json",
        data: ({table_name: "studies",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function study_definition_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    dataType: "json",
    data: ({table_name: "studies", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}

function studyDescriptionFormatter(value,row){
    if (String(value).length>25){
        return String(value).slice(0,25) + "...";
    }
    return value

}

function nStyle(value, row, index) {
    if (value>row["StudyNMax"]) {
        return {
            css: {
            'color': 'red',
            'font-weight':'bold'
            }
        }
    }
    return {}
  }


function initStudyDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'ID', field : 'StudyID', align:'center', sortable:true, searchable:false, visible:false},
                {title: 'Name', field : 'StudyName', align:'center', sortable:true, searchable:true},
                {title: 'Desc', field : 'StudyDesc', align:'center', sortable:true, searchable:true, formatter: studyDescriptionFormatter},
                {title: 'Species', field : 'StudySpecies', align:'center', sortable:true, searchable:true},
                {title: 'Start', field : 'StudyStart', align:'center', sortable:true, searchable:false},
                {title: 'End', field : 'StudyEnd', align:'center', sortable:true, searchable:false},
                {title: 'N.max', field : 'StudyNMax', align:'center', sortable:true, searchable:false},
                {title: 'N.current', field : 'StudyNCurrent', align:'center', sortable:true, searchable:false, cellStyle: "nStyle"},
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
    
    table.bootstrapTable('refreshOptions', { ajax:study_definition_retrieve_ajax });

    modalInsert("Study", container, "study_modal_add_new", tableId, studyDefinitionInputs, study_definition_insert_ajax);
    modalUpdate("Study", container, "study_modal_edit_selected", tableId, studyDefinitionInputs, study_definition_update_ajax,"StudyID");
    
    container.find("#study_modal_add_new").find(".modal-dialog").addClass("modal-xl");
    container.find("#study_modal_edit_selected").find(".modal-dialog").addClass("modal-xl");

    table.on('load-success.bs.table',function(e,data,status){
        updateRemoteDefinitionChecksum("studies",data["rows"]);
    })

}

function studyDefinitionInputs(container){
    var params =  [
        {"FieldName":"StudyName","FieldLabel":"Name","FieldDataType":"text","FieldType":"input","FieldRequired":true},
        {"FieldName":"StudyDesc","FieldLabel":"Description","FieldDataType":"longtext","FieldType":"input","FieldRequired":false},
        {"FieldName":"StudySpecies","FieldLabel":"Species","FieldDataType":"text","FieldType":"input","FieldRequired":true},

        {"FieldName":"StudyStart","FieldLabel":"Start","FieldDataType":"date","FieldType":"input","FieldRequired":true},
        {"FieldName":"StudyEnd","FieldLabel":"End","FieldDataType":"date","FieldType":"input","FieldRequired":true},
        {"FieldName":"StudyNMax","FieldLabel":"Max. number of subjects","FieldDataType":"numeric","FieldDataStep":"1","FieldType":"input","FieldRequired":true},
        ]
    
    showCustomArgs(container,params);


}