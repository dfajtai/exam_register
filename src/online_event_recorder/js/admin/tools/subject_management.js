var subject_table_id = "subjectTable";
var subject_content = {};
// var _content_name = "";
// var _lock_list = []


function subject_retrieve_all_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "subjects"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function subject_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_study_subjects.php',
    dataType: "json",
    data: ({study_id: params.study_id}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function subject_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_subject.php',
        dataType: "json",
        data: ({subject_info:params}),
        success: function(result){
            callback();
        }
    });
}

function subject_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_subject.php',
    dataType: "json",
    data: ({subject_index:key_info, subject_info:params}),
    success: function(result){
        callback();
    }
    });
}


function subjectOperateFormatter(value, row, index) {
    var container = $("<div/>").addClass("lockable");
    var container = $("<div/>").addClass("lockable");
    container.append($("<button/>").addClass("btn btn-outline-primary btn-sm edit me-2 lockable").append($("<i/>").addClass("fa fa-edit")))
    // container.append($("<button/>").addClass("btn btn-outline-primary btn-sm status argeditor-lockable").append($("<i/>").addClass("fa fa-solid fa-signs-post")))

    // if(_lock_list.length>0){
    //     container.find("button").addClass("disabled");
    // }

    return container.prop("outerHTML");
  }


window.subject_operate_events = {
    'click .edit': function (e, value, row, index) {
        var modal_id = initSubjectModalEdit(subject_content,$("#"+subject_table_id),index);
        var modal_edit = $("#"+modal_id);
        if(modal_edit.length>0){
            $(modal_edit[0]).modal('show');
            // _content_name = "edit";
            // $( document ).trigger( "_lock", [ "edit"] );
        }
    },
}

function createSubjectTable(container,table_id, height){
    var table = $("<table/>").attr("id",table_id);

    var study_selector = $("<div/>").addClass("row mt-3 mb-3");
    var study_dropdown = $("<select/>").addClass("form-control").attr("id","studySelect").attr("type","text");
    study_dropdown.append($("<option/>").html("All").prop('selected',true).attr("value","all"));
    showAllDefs(study_dropdown,"studies","StudyID","StudyName");

    study_selector.append($("<label/>").attr("for","studySelect").addClass("col-form-label col-md-3").html("Show subejcts from Study: "));
    study_selector.append($("<div/>").addClass("col-md-9").append(study_dropdown));

    container.append(study_selector);


    var toolbar = $("<div/>").attr("id",table_id+"_toolbar");

    toolbar.append($("<button/>").attr("id","toolbar_add").addClass("btn btn-success admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-plus me-2").attr("aria-hidden","true")).append("Add New"));
    toolbar.append($("<button/>").attr("id","toolbar_duplicate").addClass("btn btn-primary admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-solid fa-copy me-2").attr("aria-hidden","true")).append("Duplicate Selected"));
    toolbar.append($("<button/>").attr("id","toolbar_batch_edit").addClass("btn btn-outline-primary admin-table-toolbar-btn lockable needs-select").html($("<i/>").addClass("fa fa-pen-to-square me-2").attr("aria-hidden","true")).append("Batch edit selected"));
    toolbar.append($("<button/>").attr("id","toolbar_import").addClass("btn btn-outline-success admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-solid fa-file-import me-2").attr("aria-hidden","true")).append("Import from CSV"));

    table.attr("data-height",String(height));

    table.attr("data-toolbar","#"+table_id+"_toolbar");
    table.attr("data-toolbar-align","left");
    

    table.attr("data-pagination","false");
    table.attr("data-show-pagination-switch","false");
    table.attr("data-page-list","[10, 25, 50, 100, all]");

    table.attr("data-show-footer","false");

    table.attr("data-show-refresh","true");

    table.attr("data-auto-refresh","true");
    table.attr("data-auto-refresh-status","false");
    table.attr("data-show-auto-refresh","true");
    table.attr("data-auto-refresh-interval","10");
    table.attr("data-auto-refresh-silent","true");

    table.attr("data-show-fullscreen","true");

    table.attr("data-minimum-count-columns","2");
    table.attr("data-show-columns","true");
    table.attr("data-show-columns-toggle-all","true");

    table.attr("data-search","true");
    table.attr("data-visible-search","true");
    table.attr("data-search-highlight","true");
    table.attr("data-show-search-clear-button","true");

    table.attr("data-maintain-meta-data","true");

    table.attr("data-detail-view","true");

    table.attr("data-locale","hu-HU");

    table.attr("data-click-to-select","true");
    table.attr("data-single-select","false");
    table.attr("data-multiple-select-row","false");

    table.attr("data-sort-reset","true");


    container.append(table);
    container.append(toolbar);

    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center', forceHide:true},
                {title: '', field: 'operate', align: 'center', sortable:false, searchable:false, clickToSelect : false,
                events: window.subject_operate_events, formatter: subjectOperateFormatter, forceHide:true},
                {title: '#', field : 'SubjectIndex', align:'center', sortable:true, searchable:false, visible:false, forceHide: true},
                {title: 'Study', field : 'StudyID', align:'center', sortable:true, searchable:true, formatter: "studyFormatter", forceExport: true},
                {title: 'ID', field : 'SubjectID', align:'center', sortable:true, searchable:true,forceExport: true},
                {title: 'Name', field : 'Name', align:'center', sortable:true, searchable:true,forceExport: true},
                {title: 'Group', field : 'Group', align:'center', sortable:true, searchable:true,forceExport: true},
                {title: 'Container', field : 'Container', align:'center', sortable:true, searchable:true,forceExport: true},
                {title: 'Location', field : 'Location', align:'center', sortable:true, searchable:true, formatter: "locationFormatter",forceExport: true},
                {title: 'Status', field : 'Status', align:'center', sortable:true, searchable:true, formatter: "subjectStatusFormatter",forceExport: true},
                {title: 'Age', field : 'Age', align:'center', sortable:true, searchable:false,forceExport: true},
                {title: 'Sex', field : 'Sex', align:'center', sortable:true, searchable:true, formatter: "sexFormatter",forceExport: true},
                {title: 'Weight', field : 'Weight', align:'center', sortable:true, searchable:false,forceExport: true},
                {title: 'Height', field : 'Height', align:'center', sortable:true, searchable:false,forceExport: true}
            ],
            pagination:true,
            checkboxHeader:true,
            smartDisplay:true,
            detailFormatter:simpleFlatFormatter,

            idField:"SubjectIndex",

            showExport:true,
            exportTypes: ['csv','json','excel','doc','txt','sql','xml',"pdf"],
            exportDataType: 'all'
        });
    
    study_dropdown.on("change", function(){
        var selected = $(this).val();

        if(selected == "all"){
            table.bootstrapTable('uncheckAll');
            table.bootstrapTable('refreshOptions', { ajax: subject_retrieve_all_ajax });
            table.bootstrapTable('resetSearch');
        }
        else{
            table.bootstrapTable('uncheckAll');
            table.bootstrapTable('refreshOptions', { ajax: function(params){
                params.study_id = selected;
                subject_retrieve_ajax(params);
            } });
            table.bootstrapTable('resetSearch');
        }
        subjects_table_events();
    })
    
    table.bootstrapTable('refreshOptions', { ajax: subject_retrieve_all_ajax });

    // modalInsert("Subject", container,"subject_modal_add_new",table_id, subjectFormInputs, subject_insert_ajax);
    // modalUpdate("Subject", container,"subject_modal_edit_selected",table_id, subjectFormInputs, subject_update_ajax,"SubjectIndex");

}

function subjectFormInputs(container){
    var params =  [
    {"FieldName":"SubjectID","FieldLabel":"Subject ID","FieldDataType":"text","FieldType":"input","FieldRequired":true},
    {"FieldName":"StudyID","FieldLabel":"Study","FieldType":"select","FieldSource":"study","FieldRequired":true},
    {"FieldName":"Name","FieldLabel":"Name","FieldDataType":"text","FieldType":"input","FieldRequired":false},
    {"FieldName":"Group","FieldLabel":"Group","FieldDataType":"text","FieldType":"input","FieldRequired":false},
    {"FieldName":"Age","FieldLabel":"Age","FieldType":"input","FieldDataType":"numeric", "FieldDataStep":"1","FieldUnit":"year","FieldRequired":false},
    {"FieldName":"Sex","FieldLabel":"Sex","FieldType":"select","FieldSource":"sex","FieldRequired":false},
    {"FieldName":"Container","FieldLabel":"Container","FieldType":"input","FieldDataType":"range", "FieldDataStep":"1","FieldDataMin":"1","FieldDataMax":"30","FieldRequired":false},
    {"FieldName":"Weight","FieldLabel":"Weight","FieldType":"input","FieldDataType":"numeric", "FieldDataStep":"0.01","FieldUnit":"kg","FieldRequired":false},
    {"FieldName":"Height","FieldLabel":"Height","FieldType":"input","FieldDataType":"numeric", "FieldDataStep":"0.01","FieldUnit":"cm","FieldRequired":false},
    {"FieldName":"Location","FieldLabel":"Location","FieldType":"select","FieldSource":"location"},
    {"FieldName":"Status","FieldLabel":"Status","FieldType":"select","FieldSource":"subject_status"}
    ]

    showCustomArgs(container,params);    
}


function subjectBatchFormInputs(container){
    var params =  [
    {"FieldName":"StudyID","FieldLabel":"Study","FieldType":"select","FieldSource":"study","FieldRequired":false},
    {"FieldName":"Group","FieldLabel":"Group","FieldDataType":"text","FieldType":"input","FieldRequired":false},
    {"FieldName":"Location","FieldLabel":"Location","FieldType":"select","FieldSource":"location"},
    {"FieldName":"Status","FieldLabel":"Status","FieldType":"select","FieldSource":"subject_status"},
    {"FieldName":"Sex","FieldLabel":"Sex","FieldType":"select","FieldSource":"sex","FieldRequired":false},
    {"FieldName":"Age","FieldLabel":"Age","FieldType":"input","FieldDataType":"numeric", "FieldDataStep":"1","FieldUnit":"year","FieldRequired":false},

    ]

    showCustomArgs(container,params);    
}

function subject_modal(container, modal_id, title){
    var modal_root = $("<div/>").addClass("modal fade").attr("id",modal_id).attr("tabindex","-1");
    var modal_dialog = $("<div/>").addClass("modal-dialog modal-lg");
    var modal_content = $("<div/>").addClass("modal-content");

    var modal_header= $("<div/>").addClass("modal-header");
    modal_header.append($("<h5/>").addClass("modal-title display-3 fs-3").html(title));
    modal_header.append($("<button/>").addClass("btn-close").attr("data-bs-dismiss","modal").attr("aria-label","Close"));

    var modal_body = $("<div/>").addClass("modal-body");

    var modal_footer= $("<div/>").addClass("modal-footer");
    // modal_footer.append($("<button/>").addClass("btn btn-success").attr("id","copy_selected").attr("aria-label","Copy Selected").html($("<i/>").addClass("fa fa-copy").attr("aria-hidden","true")).append(" Copy Selected"));
    modal_footer.append($("<button/>").addClass("btn btn-danger").attr("id","clear_form").attr("aria-label","Clear").html($("<i/>").addClass("fa fa-eraser me-2").attr("aria-hidden","true")).append("Clear"));
    modal_footer.append($("<button/>").addClass("btn btn-secondary").attr("data-bs-dismiss","modal").attr("aria-label","Close").html("Close"));

    modal_content.append(modal_header);
    modal_content.append(modal_body);
    modal_content.append(modal_footer);

    modal_dialog.html(modal_content);
    modal_root.html(modal_dialog);

    container.append(modal_root);
}

function initSubjectModalAdd(container, table){
    var modal_id = "subject_modalAdd";
    var form_id = modal_id+"Form";

    container.find("#"+modal_id).remove();

    subject_modal(container, modal_id, "Add Subject from scratch");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var submitForm = $("<div/>").addClass("row mb-3 text-center");
    var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Add Subject");
    submitForm.append(submitButton);

    subjectFormInputs(form);
    form.append(submitForm);

    
    $(modal).on('hidden.bs.modal',function(){
        // $( document ).trigger("_release",["add"]);
    })

    form.on('submit',function(e){
        e.preventDefault();
        var values = {};
        $.each($(this).serializeArray(), function(i, field) {
            if(!(field.value==""||field.value==null)) values[field.name]= field.value;
        });

        subject_insert_ajax(values,function(){table.bootstrapTable('refresh')});
        modal.modal('hide');
        form[0].reset();
    });

    container.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })
    modal_body.append(form);
}

function initSubjectModalEdit(container, table, index){
    var modal_id = "subject_modalEdit";
    var form_id = modal_id+"Form";

    if(index>table.bootstrapTable('getData').length){
        return
    }
    var entry = table.bootstrapTable('getData')[index];
    

    container.find("#"+modal_id).remove();

    subject_modal(container, modal_id, "Edit Subject");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    var modal_footer = modal.find(".modal-footer");
    
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var submitForm = $("<div/>").addClass("row mb-3 text-center");
    var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Alter Subject");
    submitForm.append(submitButton);

    subjectFormInputs(form);
    form.append(submitForm);
    modal_body.append(form);

    modal_footer.prepend($("<button/>").addClass("btn btn-outline-danger").attr("id","revert_form").attr("aria-label","Clear").html($("<i/>").addClass("fa fa-rotate-right me-2").attr("aria-hidden","true")).append("Revert"));

    modal_footer.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })  

    var modal = container.find("#"+modal_id);

    $(modal).on('hidden.bs.modal',function(){
        // $( document ).trigger("_release",["edit"]);
    })

    function init_fields(form,entry){
        $(form).find("input[name]").each(function(){
            var name = $(this).attr("name");
            if(name in entry){
                $(this).val(entry[name]).trigger("change");
            }
        });
        $(form).find("textarea[name]").each(function(){
            var name = $(this).attr("name");
            if(name in entry){
                if(name.includes("JSON")){
                    $(this).val(entry[name]);
                }
                else{
                    $(this).val(entry[name]);
                }
            }
        });
        
        $(form).find("select[name]").each(function(){
            var name = $(this).attr("name");
            if(name in entry){
                $(this).val(entry[name]);
            }
        });
    }

    $(modal).on('show.bs.modal', function () {                   
        init_fields(form,entry);
        console.log(entry);
    })

    modal_footer.find("#revert_form").click(function(){
        init_fields(form,entry);
    })

    form.on('submit',function(e){
        e.preventDefault();

        if(! form[0].checkValidity()){
            form[0].reportValidity();
            return;
        }


        var values = {};
        form.find("input[name]").each(function(){
            let _val =  $(this).val();
            if(!(_val==""||_val==null)){
                values[$(this).attr("name")] = _val;
            };
        });
        form.find("textarea[name]").each(function(){
            let _val =  $(this).val();
            if(!(_val==""||_val==null)){
                values[$(this).attr("name")]  = _val;
            };

        });
        form.find("select[name]").each(function(){
            let _val =  $(this).val();
            if(!(_val==""||_val==null)){
                values[$(this).attr("name")]  = _val;
            };
        });

        subject_update_ajax(entry["SubjectIndex"],values,function(){table.bootstrapTable('refresh')});
        modal.modal('hide');
        form[0].reset();
    });
    return modal_id;
}

function initSubjectBatchModalEdit(container, table){
    var modal_id = "subjectBatchModalEdit";
    var form_id = modal_id+"Form";

    container.find("#"+modal_id).remove();
    
    subject_modal(container, modal_id, "Batch edit Subjects");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    var modal_footer = modal.find(".modal-footer");
    
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var submitForm = $("<div/>").addClass("row mb-3 text-center");
    var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Alter Subjects");
    submitForm.append(submitButton);

    subjectBatchFormInputs(form);
    form.append(submitForm);
    modal_body.append(form);
   
    $(modal).on('hidden.bs.modal',function(){
        // $( document ).trigger("_release",["batch_edit"]);
    })

    form.on('submit',function(e){
        e.preventDefault();

        if(! form[0].checkValidity()){
            form[0].reportValidity();
            return;
        }

        var values = {};


        form.find("input[name]").each(function(){
            let _val =  $(this).val();
            if(!(_val==""||_val==null)){
                values[$(this).attr("name")] = _val;
            };
        });
        form.find("textarea[name]").each(function(){
            let _val =  $(this).val();
            if(!(_val==""||_val==null)){
                values[$(this).attr("name")] = _val;
            };

        });
        form.find("select[name]").each(function(){
            let _val =  $(this).val();
            if(!(_val==""||_val==null)){
                values[$(this).attr("name")] = _val;
            };
        });

        var selection =  table.bootstrapTable('getSelections');

        $.each(selection, function(index,entry){
            subject_update_ajax(entry["SubjectIndex"],values,function(){table.bootstrapTable('refresh')});
        })
        
        modal.modal('hide');
        form[0].reset();
    });
    
    return modal_id;
}

function initSubjectModalImport(container,table){
    var modal_id = "subject_modalImport";
    var form_id = modal_id+"Form";

    container.find("#"+modal_id).remove();
    
    subject_modal(container, modal_id, "Import Subjects from CSV");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    var modal_footer = modal.find(".modal-footer");

    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var file_input_group = $("<div/>").addClass("row mb-3");
    var file_label =  $("<label/>").addClass("col-md-3 col-form-label").html("Select .csv file");
    var file_input = $("<input/>").addClass("form-control").attr("type","file").attr("id","inputFileSelect").attr("name","inputFile");
    file_input.attr("accept",".csv")

    // var file_upload_btn = $("<span/>").addClass("btn btn-outline-success form-control").attr("id","uploadBtn");
    // // file_upload_btn.html($("<span/>").addClass("bi bi-cloud-upload").append(" Upload"))
    // file_upload_btn.html($("<span/>").addClass("fa fa-cloud-upload").append(" Upload"))

    file_input_group.append(file_label);
    // file_input_group.append($("<div/>").addClass("col-md-6").append(file_input));
    file_input_group.append($("<div/>").addClass("col-md-9").append(file_input));
    // file_input_group.append($("<div/>").addClass("col-md-3").append(file_upload_btn));

    form.append(file_input_group);

    var study_selector = $("<div/>").addClass("row mt-3 mb-3");
    var study_dropdown = $("<select/>").addClass("form-control").attr("id","targetStudySelect").attr("type","text").prop("required",true);
    study_dropdown.append($("<option/>").html("Choose study...").prop('selected',true).attr("value",""));
    showAllDefs(study_dropdown,"studies","StudyID","StudyName");

    study_selector.append($("<label/>").attr("for","studySelect").addClass("col-form-label col-md-3").html("Select target Study: "));
    study_selector.append($("<div/>").addClass("col-md-9").append(study_dropdown));

    form.append(study_selector);

    var instructions_group = $("<div/>").addClass("mb-3");
    instructions_group.append($("<label/>").attr("for","instruction_textarea").addClass("form-label").html("Instructions"));
    var instructions = $("<textarea/>").attr("rows",5).prop("disabled",true).attr("id","instruction_textarea").addClass("form-control");
    $(instructions).val("Import a specific CSV table from your local drive. Subjects will be added to the selected study.\n\nAccepted columns: \n\tID, Name, Group, Container, Location, Status, Age, Sex, Weight, Height\n(Unknown column names or values will be ignored.)");
    instructions_group.append(instructions);
    form.append($("<div/>").addClass("row").append(instructions_group));

    var table = $("<table/>").attr("id","modalImportTable");
    table.attr("data-locale","hu-HU");

    var table_container = $("<div/>").addClass("mb-3");
    table_container.append(table);
    form.append(table_container);


    var submitForm = $("<div/>").addClass("row mb-3 text-center");
    var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Import Subjects");
    submitForm.append(submitButton);

    modal.find("#clear_form").remove();
    
    form.append(submitForm);
    modal_body.append(form);

    table.bootstrapTable();

    // file_input_group.find("#uploadBtn").on("click",function(){
    file_input.on("change",function(){
        const fileInput = document.getElementById("inputFileSelect");
        const selectedFiles = fileInput.files;

        if(selectedFiles.length==0){
            return;
        }
        
        const reader = new FileReader();

        reader.onload = function(res) {
            //parse csv data
            var data = res.target.result;

            var object_list = $.csv.toObjects(data);

            var columns = [];

            $.each(object_list[0], function( key, value ) {
                    var _item = {};
                    _item.field = key;
                    _item.title = key;
                    columns.push(_item);
            });

            $.each(object_list,function(index){
                let obj = object_list[index];
                $.each(obj,function(key,value){
                    if(value=="'-"){
                        object_list[index][key]="-";
                    }
                    else if(!isNaN(value)){
                        object_list[index][key] = +object_list[index][key];
                    }
                })
            });
            // console.log(object_list);

            table.bootstrapTable("destroy").bootstrapTable({
                "columns": columns,
                data: object_list
            });
            // console.log(table.bootstrapTable('getData'))
        };
        reader.readAsText(fileInput.files[0]);
    });

    form.on('submit',function(e){
        e.preventDefault();

        var data = table.bootstrapTable('getData');

        var selected_study = $(study_dropdown).val();
        var selected_study_name = getDefEntryFieldWhere("studies","StudyID",selected_study,"StudyName")

        bootbox.confirm({
            message: 'You are going to import '+ data.length +' subjects to study "'+ selected_study_name +'".<br>Do you want to proceed?',
            buttons: {
            confirm: {
            label: 'Yes',
            className: 'btn-outline-success'
            },
            cancel: {
            label: 'No',
            className: 'btn-outline-dark'
            }
            },
            callback: function (result) {
                if(result){
                    // validate data
                    
                    $.each(data,function(index){
                        let element = data[index];
                        
                        var validated_element = {};
                        validated_element["StudyID"] = selected_study;
                        validated_element["SubjectID"] = element["ID"];
                        
                        var safe_args = ["Name","Group","Container","Age","Weight","Height"];
                        $.each(safe_args,function(index,value){
                            if(element.hasOwnProperty(value))
                                validated_element[value] = element[value];
                        });

                        if(element.hasOwnProperty("Location"))
                            validated_element["Location"] = getDefEntryFieldWhere("location_definitions","LocationName",element["Location"],"LocationID");
                        
                        if(element.hasOwnProperty("Sex"))
                            validated_element["Sex"] = getDefEntryFieldWhere("sex_definitions","SexName",element["Sex"],"SexID");
                        
                        if(element.hasOwnProperty("Status"))
                            validated_element["Status"] = getDefEntryFieldWhere("subject_status_definitions","StatusName",element["Status"],"StatusID");
                        
                        // console.log(validated_element);

                        subject_insert_ajax(validated_element);
                    });


                    modal.modal('hide');
                    modal.on('hidden.bs.modal',function(e){
                                form[0].reset();
                                $('#'+subject_table_id).bootstrapTable('refresh');
                                });
                    }
            }
            });


    });
}

function subjects_table_events(){
    var table = $('#'+subject_table_id);
    table.on('check.bs.table check-all.bs.table check-some.bs.table uncheck.bs.table uncheck-all.bs.table uncheck-some.bs.table refresh.bs.table reset-view.bs.table',
    function(){
        var selection =  table.bootstrapTable('getSelections');

        if(selection.length>0){
            $(document).find(".needs-select").removeClass("disabled");
        }
        else{
            $(document).find(".needs-select").addClass("disabled");
        }
    });
}

function show_subject_manager(container){
    createSubjectTable(container,subject_table_id,730);  

    var table = $('#'+subject_table_id);

    var toolbar = container.find(".fixed-table-toolbar");

    subject_content = $("<div/>").attr("id","subjectManagerModalContainer");
    container.append(subject_content);

    initSubjectModalAdd(subject_content, table);
    toolbar.find("#toolbar_add").on("click", function(){
        $('#subject_modalAdd').modal('show');
        // $(document).trigger("_lock",["add"]);
    });

    toolbar.find("#toolbar_duplicate").on("click",function(e){
        var selected =table.bootstrapTable("getSelections");
        $.each(selected, function(index, entry){
            var data = {... entry};

            delete data["SubjectIndex"];
            delete data["state"];

            $.each(data,function(key){
                if(data[key]==null) delete data[key];
            })
            subject_insert_ajax(data,function(){table.bootstrapTable("refresh")});
        });
    })

    initSubjectBatchModalEdit(subject_content,table);
    toolbar.find("#toolbar_batch_edit").on("click", function(){
        $('#subjectBatchModalEdit').modal('show');
        // $(document).trigger("_lock",["batch_edit"]);
    });

    initSubjectModalImport(subject_content,table);
    toolbar.find("#toolbar_import").on("click", function(){
        $('#subject_modalImport').modal('show');
        // $(document).trigger("_lock",["import"]);
    });

    toolbar.find(".needs-select").addClass("disabled");

    subjects_table_events();
    

}

