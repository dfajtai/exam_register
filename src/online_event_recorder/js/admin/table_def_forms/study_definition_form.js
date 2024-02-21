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

    var toolbar = container.find('#'+table_id+'_toolbar').first();
    var export_btn = $("<button/>").attr("id","toolbar_export").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable needs-select").html($("<i/>").addClass("fa fa-solid fa-qrcode me-2").attr("aria-hidden","true")).append("Export");
    toolbar.append(export_btn);
    
    export_btn.on('click',function(){
        study_export_modal(container,table);
    })

    table.on('load-success.bs.table',function(e,data,status){
        updateRemoteDefinitionChecksum("studies",data["rows"]);
    })

}

function study_export_modal(container,table){
    var modal_id = "studyExportModal";
    
    container.find("#"+modal_id).remove();

    var modal_root = $("<div/>").addClass("modal fade").attr("id",modal_id).attr("tabindex","-1");
    var modal_dialog = $("<div/>").addClass("modal-dialog modal-md");
    var modal_content = $("<div/>").addClass("modal-content");

    var modal_header= $("<div/>").addClass("modal-header");
    modal_header.append($("<h5/>").addClass("modal-title display-3 fs-3").html("Study export"));
    modal_header.append($("<button/>").addClass("btn-close").attr("data-bs-dismiss","modal").attr("aria-label","Close"));

    var modal_body = $("<div/>").addClass("modal-body d-inline-flex  flex-column justify-content-center");

    // var pool_readable_text = $("<textarea/>").addClass("w-100 mb-2").attr("rows",3);
    // modal_body.append(pool_readable_text);

    var study_url = $("<textarea/>").addClass("w-100 mb-2").attr("rows",3).attr("readonly",true);
    modal_body.append(study_url);
    var qrcode_dom = $("<div/>").attr("id","qrcode")
    modal_body.append(qrcode_dom);

    
    modal_content.append(modal_header);
    modal_content.append(modal_body);

    modal_dialog.html(modal_content);
    modal_root.html(modal_dialog);


    var full_url = null;

    $(modal_root).on('show.bs.modal',function(){
        var indices = $(table).bootstrapTable("getSelections")[0]["StudyID"];
        var indices_text = JSON.stringify(indices);
        // console.log(indices_text);
        var searchParams = new URLSearchParams();
        searchParams.set("activeStudy",indices_text);
        full_url =  window.location.host+'?' + searchParams.toString();

        $(study_url).val(full_url);
    });

    $(modal_root).on('shown.bs.modal',function(){
        $(qrcode_dom).css({width:$(study_url).width(),height:$(study_url).width()});

        // qrcode gen
        var qrcode = new QRCode("qrcode",{
            text: full_url,
            width: $(study_url).width(),
            height: $(study_url).width(),
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    });

    container.append(modal_root);

    modal_root.modal("show");

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