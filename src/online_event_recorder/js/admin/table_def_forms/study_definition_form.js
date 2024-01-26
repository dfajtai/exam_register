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
            detailFormatter:detail_as_table_formatter
        });
    
    table.bootstrapTable('refreshOptions', { ajax:study_definition_retrieve_ajax });

    modalInsert("Study", container, "study_modal_add_new", tableId, studyDefinitionInputs, study_definition_insert_ajax);
    modalUpdate("Study", container, "study_modal_edit_selected", tableId, studyDefinitionInputs, study_definition_update_ajax,"StudyID");

}

function studyDefinitionInputs(container){
    var nameForm = $("<div/>").addClass("row mb-3");
    nameForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Name"));
    var nameInput = $("<div/>").addClass("col-sm-9");
    nameInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","name").attr("name","StudyName").prop('required',true));
    nameForm.append(nameInput);

    var descForm = $("<div/>").addClass("row mb-3");
    descForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Description"));
    var descInput = $("<div/>").addClass("col-sm-9");
    descInput.append($("<textarea/>").addClass("form-control").attr("type","text").attr("id","desc").attr("name","StudyDesc"));
    descForm.append(descInput);

    var speciesForm = $("<div/>").addClass("row mb-3");
    speciesForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Species"));
    var speciesInput = $("<div/>").addClass("col-sm-9");
    speciesInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","species").attr("name","StudySpecies").prop('required',true));
    speciesForm.append(speciesInput);

    var startForm = $("<div/>").addClass("row mb-3");
    startForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Start"));
    var startInput = $("<div/>").addClass("col-sm-9");
    startInput.append($("<input/>").addClass("form-control").attr("type","date").attr("id","start").attr("name","StudyStart").prop('required',true));
    startForm.append(startInput);

    var endForm = $("<div/>").addClass("row mb-3");
    endForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("End"));
    var endInput = $("<div/>").addClass("col-sm-9");
    endInput.append($("<input/>").addClass("form-control").attr("type","date").attr("id","end").attr("name","StudyEnd").prop('required',true));
    endForm.append(endInput);

    var nForm = $("<div/>").addClass("row mb-3");
    nForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Max. number of subjects"));
    var nInput = $("<div/>").addClass("col-sm-9");
    nInput.append($("<input/>").addClass("form-control").attr("type","number").attr("step","1").attr("id","n").attr("name","StudyNMax").prop('required',true));
    nForm.append(nInput);

    container.append(nameForm);
    container.append(descForm);
    container.append(speciesForm);
    container.append(startForm);
    container.append(endForm);
    container.append(nForm);

}