var eventlog_table_id = "eventlogTable";
var eventlog_content = {};
// var eventlog_content_name = "";
// var eventlog_lock_list = [];

var eventlog_visible_subjects = null;
var eventlog_visible_subjects_info = null;
var eventlog_subject_string_lookup = {};


function eventlog_retrieve_all_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "event_log"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}


function eventlog_retrieve_subjects_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_subject_events.php',
    dataType: "json",
    data: ({subject_index: params.data.indices}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    },
    error: function (er) {
        params.error(er);
    }
    });
}


function eventlog_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_event.php',
        // dataType: "json",
        data: {event_info:params},
        success: function(result){
            callback();
        }
    });
}

function eventlog_update_ajax(event_index, event_info,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/update_event.php',
        // dataType: "json",
        data: {event_index: event_index, event_info:event_info},
        success: function(result){
            callback();
        }
    });
}


function subjectFormatter(value,row){
    if(value==null) return;
    var res = null;
    if(eventlog_visible_subjects.length==0) return res;
    
    if(eventlog_visible_subjects.includes(value)){
        return eventlog_subject_string_lookup[value];
    }
    return res;
}

function eventlog_operate_formatter(value, row, index) {
    var container = $("<div/>").addClass("lockable");
    var container = $("<div/>").addClass("lockable");
    
    var edit_btn = $("<button/>").addClass("btn btn-outline-primary btn-sm edit lockable").append($("<i/>").addClass("fa fa-edit"))
    edit_btn.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Edit event");
    container.append(edit_btn);

    // container.append($("<button/>").addClass("btn btn-outline-primary btn-sm status argeditor-lockable").append($("<i/>").addClass("fa fa-solid fa-signs-post")))

    // if(_lock_list.length>0){
    //     container.find("button").addClass("disabled");
    // }

    return container.prop("outerHTML");
  }


window.eventlog_operate_events = {
    'click .edit': function (e, value, row, index) {
        show_eventlog_modal_edit(eventlog_content,$("#"+eventlog_table_id),index);
        // eventlog_content_name = "edit";
        // $( document ).trigger( "_lock", [ "edit"] );
    },

}

function eventlog_query_params(params){
    params.indices = eventlog_visible_subjects;
    // console.log(eventlog_visible_subjects);
    return params
}

function create_eventlog_table(container, table_id, simplify = false){
    var table = $("<table/>").attr("id",table_id);
    
    var toolbar = $("<div/>").attr("id",table_id+"_toolbar");

    var subject_selector_container = $("<div/>");
    subjectSelectWidget(subject_selector_container,"all",
        function(subject_indices,subject_info){
            // console.log(subject_indices);
            // console.log(subject_info);

            eventlog_visible_subjects_info = subject_info;
            
            if(eventlog_visible_subjects_info.length>0){
                $(toolbar).empty();
                toolbar.append($("<button/>").attr("id","toolbar_add").addClass("btn btn-success admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-plus me-2").attr("aria-hidden","true")).append("Add New"));
                toolbar.append($("<button/>").attr("id","toolbar_duplicate").addClass("btn btn-primary admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-solid fa-copy me-2").attr("aria-hidden","true")).append("Duplicate Selected"));
                // toolbar.append($("<button/>").attr("id","toolbar_removeSelected").addClass("btn btn-danger admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-trash fa-solid me-2").attr("aria-hidden","true")).append("Remove Selected"));
                toolbar.append($("<button/>").attr("id","toolbar_batch_edit").addClass("btn btn-outline-primary admin-table-toolbar-btn lockable needs-select").html($("<i/>").addClass("fa fa-pen-to-square me-2").attr("aria-hidden","true")).append("Batch edit selected"));
                

                toolbar.find("#toolbar_add").on("click", function(){
                    show_eventlog_modal_add(eventlog_content, table);
            
                    // $(document).trigger("_lock",["add"]);
                    // eventlog_content_name = "add";
                });

                toolbar.find("#toolbar_duplicate").on("click",function(e){
                    var selected =table.bootstrapTable("getSelections");
                    $.each(selected, function(index, entry){
                        var data = {... entry};
            
                        delete data["EventIndex"];
                        delete data["state"];
            
                        $.each(data,function(key){
                            if(data[key]==null) delete data[key];
                        })
                        eventlog_insert_ajax(data,function(){table.bootstrapTable("refresh")});
                    });
                })

            }
            else{
                $(toolbar).empty();
                table.bootstrapTable('refreshOptions', {  toolbar:toolbar});
            }

            
            if(subject_indices=="all"){
                eventlog_visible_subjects = getCol(subject_info,"SubjectIndex");
                table.bootstrapTable('refreshOptions', { queryParams:null, ajax: eventlog_retrieve_all_ajax });
            }
            else{
                eventlog_visible_subjects = subject_indices;
                table.bootstrapTable('refreshOptions', {  queryParams:eventlog_query_params, ajax: eventlog_retrieve_subjects_ajax});
                
            }

            eventlog_subject_string_lookup = {};
            $.each(eventlog_visible_subjects_info,function(index,val){
                eventlog_subject_string_lookup[val.SubjectIndex] = val.Name + " [" + val.SubjectID + "]";
            })

            
            
        });

    container.append(subject_selector_container);
        
    table.attr("data-toolbar","#"+table_id+"_toolbar");
    table.attr("data-toolbar-align","left");
    

    table.attr("data-pagination","false");
    table.attr("data-show-pagination-switch","false");
    table.attr("data-page-list","[10, 25, 50, 100, all]");

    table.attr("data-show-footer","false");

    if(!simplify){
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

        table.attr("data-detail-view","true");
    }
    
    table.attr("data-search","true");
    table.attr("data-visible-search","true");
    table.attr("data-search-highlight","true");
    table.attr("data-show-search-clear-button","true");

    table.attr("data-maintain-meta-data","true");

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
                events: window.eventlog_operate_events, formatter: eventlog_operate_formatter, forceHide:true},
                {title: '#', field : 'EventIndex', align:'center', sortable:true, searchable:false, visible:false, forceHide: true},
                {title: 'Subject', field : 'EventSubject', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "subjectFormatter"},
                {title: 'Study', field : 'EventStudy', align:'center', sortable:true, searchable:true, formatter: "studyFormatter", forceExport: true},
                {title: 'Event Name', field : 'EventName', align:'center', sortable:true, searchable:true,forceExport: true},
                {title: 'Status', field : 'EventStatus', align:'center', sortable:true, searchable:true,forceExport: true,formatter: "eventStatusFormatter",},
                {title: 'Template', field : 'EventID', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "eventFormatter",},
                {title: 'Location', field : 'EventLocation', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "locationFormatter",},
                {title: 'Changed', field : 'EventModifiedAt', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "datetimeFormatter",},
                {title: 'Planned', field : 'EventPlannedTime', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "datetimeFormatter",},
                
              ],
            
            pagination:true,
            checkboxHeader:true,
            smartDisplay:true,
            detailFormatter:simpleFlatFormatter,
            
            idField:"SubjectIndex",

            showExport:!simplify,
            exportTypes: ['csv','json','excel','doc','txt','sql','xml',"pdf"],
            exportDataType: 'all'
        });

}


function eventlog_add_form_inputs(form, subject_index = null){    
    var subject_select =  $("<div/>").addClass("row mb-3").attr("id","eventlog_subject_input_block");

    var subject_label =  $("<label/>").addClass("col-md-3 col-form-label").html("Subject");
    var subject_select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id","subjectSelect").attr("name","EventSubject");
    subject_select_dropdow.prop('required',true).addClass("border border-2 border-dark");
    
    $.each(eventlog_visible_subjects_info,function(index,entry){
        if(!entry.hasOwnProperty("SubjectIndex")) return;
        let subject_index = entry["SubjectIndex"];
        subject_select_dropdow.append($("<option/>").html(eventlog_subject_string_lookup[subject_index]).attr("value",subject_index));
    });

    if(eventlog_visible_subjects_info.length>1){
        subject_select_dropdow.prepend($("<option/>").html("Choose subject...").prop('selected',true).attr("value",""));
    }

    subject_select.append(subject_label);
    subject_select.append($("<div/>").addClass("col-md-9").append(subject_select_dropdow));
    form.append(subject_select);

    subject_select_dropdow.on("change",function(){
        subject_index = $(this).val();
        // console.log(subject_index);
    })
    if(subject_index!==null){
        subject_select_dropdow.val(subject_index);
        subject_select.prop("hidden",true);
    }

    // var event_param_block =  $("<div/>").addClass("container shadow py-3 my-3");
    var event_param_block =  $("<div/>").addClass("row md-3").attr("id","eventlog_event_param_block");
    var planned_eventStatusID = getDefEntryFieldWhere("event_status_definitions","EventStatusName","planned","EventStatusID");
    var event_params_config =  [
        {"FieldName":"EventName","FieldLabel":"Event Name","FieldType":"input","FieldDataType":'text', "FieldRequired":true},
        {"FieldName":"EventID","FieldLabel":"Event template","FieldType":"select","FieldSource":"event", "FieldRequired":true},
        {"FieldName":"EventStatus","FieldLabel":"Status","FieldType":"select","FieldSource":"event_status", "FieldRequired":true, "FieldDefaultValue":planned_eventStatusID},
        {"FieldName":"EventPlannedTime","FieldLabel":"Planned Time","FieldType":"input","FieldDataType":'datetime', "FieldRequired":false},
        {"FieldName":"EventLocation","FieldLabel":"Location","FieldType":"select","FieldSource":"location", "FieldRequired":false},
        {"FieldName":"EventComment","FieldLabel":"Comment","FieldType":"input","FieldDataType":'longtext', "FieldRequired":false},
        ]
    showCustomArgs(event_param_block,event_params_config);

    event_param_block.find('[name="EventPlannedTime"]').val(null);
    // event_param_block.find('[name="EventID"]').parent().parent().remove();

    form.append(event_param_block);


    var event_data_block =  $("<div/>").addClass("row").attr("id","eventlog_event_data_block");
    var fill_switch_group = $("<div/>").addClass("form-check form-switch");
    var fill_switch = $("<input/>").addClass("form-check-input").attr("type","checkbox").attr("id","fillDataSwitch");
    fill_switch_group.append(fill_switch);
    fill_switch_group.append($("<label/>").addClass("form-check-label").attr("for","fillDataSwitch").html("Fill event data"));
    event_data_block.append($("<div/>").addClass("row mb-2 ms-1").append(fill_switch_group));
    

    var event_form_container = $("<div/>");
    event_data_block.append(event_form_container);
    form.append(event_data_block);

    var event_template = null;
    event_param_block.find('[name="EventID"]').on("change",function(){
        event_template = $(this).val();
        fill_switch.trigger("change");
    });

    fill_switch.on("change",function(){
        var show_data = fill_switch.is(":checked");
        if(show_data){
            if(event_template===null){
                event_form_container.empty().removeClass("row mb-3");
                return;
            };
            var event_params = getDefEntryFieldWhere('event_definitions','EventID', event_template,'EventFormJSON');
            if(event_params===null){
                event_form_container.empty().removeClass("row mb-3");
                return;
            };

            event_form_container.empty().addClass("row mb-3");
            showCustomArgs(event_form_container,JSON.parse(event_params));

        }
        else{
            event_form_container.empty().removeClass("row mb-3");
        }
        

    })

}

function show_eventlog_modal_add(container, table){
    var modal_id = "eventlog_modalAdd";
    var form_id = modal_id+"Form";

    container.find("#"+modal_id).remove();

    eventlog_modal(container, modal_id, "Add new event from scratch");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    var modal_footer = modal.find(".modal-footer");
    
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var submitForm = $("<div/>").addClass("row mb-3 text-center");
    var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Add event");
    submitForm.append(submitButton);

    eventlog_add_form_inputs(form);
    form.append(submitForm);

    
    $(modal).on('hidden.bs.modal',function(){
        $( document ).trigger("_release",["add"]);
    })

    form.on('submit',function(e){
        e.preventDefault();

        var event_data = {};
        var event_params = {};
        var event_def_keys = ["EventID","EventName","EventStatus","EventPlannedTime","EventComment","EventStudy","EventSubject","EventLocation"];

        $.each($(this).serializeArray(), function(i, field) {
            if(!(field.value==""||field.value==null)) {
                if(event_def_keys.includes(field.name)){
                    event_params[field.name] = field.value;
                }
                else{
                    event_data[field.name] = field.value;
                }
            }
        });
        event_params["EventData"] = event_data;

        event_params["EventStudy"] = getEntryFieldWhere(eventlog_visible_subjects_info,"SubjectIndex",event_params["EventSubject"],"StudyID");

        // console.log(event_params);
        // console.log(event_data);

        eventlog_insert_ajax(event_params,function(){table.bootstrapTable('refresh')});

        modal.modal('hide');
        form[0].reset();
    });

    modal_footer.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
        $(modal_body).find(".form-check-input").trigger("change");
    })
    modal_body.append(form);

    modal.modal('show');
}

function eventlog_edit_form_inputs(form, event_id){
    form.empty();

    var event_params =   [
        {"FieldName":"EventName","FieldLabel":"Event Name","FieldType":"input","FieldDataType":'text', "FieldRequired":false},
        {"FieldName":"EventLocation","FieldLabel":"Location","FieldType":"select","FieldSource":"location", "FieldRequired":false},
        {"FieldName":"EventComment","FieldLabel":"Comment","FieldType":"input","FieldDataType":'longtext', "FieldRequired":false},
        {"FieldName":"EventPlannedTime","FieldLabel":"Planned Time","FieldType":"input","FieldDataType":'datetime', "FieldRequired":false},
    ]

    var event_data_params = getDefEntryFieldWhere('event_definitions','EventID', event_id,'EventFormJSON');
    if(event_data_params===null){
        return;
    }
    event_params = listAppend(event_params,JSON.parse(event_data_params));
    event_params = listAppend(event_params,[{"FieldName":"EventStatus","FieldLabel":"Status","FieldType":"select","FieldSource":"event_status", "FieldRequired":false}]);

        
    showCustomArgs(form,event_params);

    form.find('[name]').prop('required',false).removeClass("border-2 border-dark");

}   


function show_eventlog_modal_edit(container, table, index){
    var modal_id = "eventlog_modalEdit";
    var form_id = modal_id+"Form";

    if(index>table.bootstrapTable('getData').length){
        return
    }
    var entry = table.bootstrapTable('getData')[index];
    // console.log(entry);

    container.find("#"+modal_id).remove();

    eventlog_modal(container, modal_id, "Edit event data");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    var modal_footer = modal.find(".modal-footer");
    var modal_footer = modal.find(".modal-footer");
    modal_footer.prepend($("<button/>").addClass("btn btn-outline-danger").attr("id","revert_form").attr("aria-label","Clear").html($("<i/>").addClass("fa fa-rotate-right me-2").attr("aria-hidden","true")).append("Revert"));


    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var submitForm = $("<div/>").addClass("row mb-3 text-center");
    var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Update event");
    submitForm.append(submitButton);


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
                $(this).val(entry[name]).trigger("change");
            }
        });

        if(!entry.hasOwnProperty("EventData")) return;

        var event_data = JSON.parse(entry["EventData"]);
        if(event_data===null) return;

        $(form).find("input[name]").each(function(){
            var name = $(this).attr("name");
            if(name in event_data){
                $(this).val(event_data[name]).trigger("change");
            }
        });
        $(form).find("textarea[name]").each(function(){
            var name = $(this).attr("name");
            if(name in event_data){
                if(name.includes("JSON")){
                    $(this).val(event_data[name]);
                }
                else{
                    $(this).val(event_data[name]);
                }
            }
        });
        
        $(form).find("select[name]").each(function(){
            var name = $(this).attr("name");
            if(name in event_data){
                $(this).val(event_data[name]).trigger("change");
            }
        });
    }
    
    eventlog_edit_form_inputs(form,entry["EventID"]);

    form.append(submitForm);

    
    $(modal).on('hidden.bs.modal',function(){
        $( document ).trigger("_release",["edit"]);
    })

    form.on('submit',function(e){
        e.preventDefault();

        var event_data = {};
        var event_params = {};
        var event_def_keys = ["EventID","EventName","EventStatus","EventPlannedTime","EventComment","EventStudy","EventSubject","EventLocation"];

        $.each($(this).serializeArray(), function(i, field) {
            // if(!(field.value==""||field.value==null)) {
                if(event_def_keys.includes(field.name)){
                    event_params[field.name] = parse_val(field.value==""?null:field.value);
                }
                else{
                    event_data[field.name] = parse_val(field.value==""?null:field.value);
                }
            // }
        });

        event_params["EventData"] =event_data;
        event_params["EventID"] = parse_val(entry["EventID"]);
        event_params["EventSubject"] = parse_val(entry["EventSubject"]);


        event_params["EventStudy"] = getEntryFieldWhere(eventlog_visible_subjects_info,"SubjectIndex",entry["EventSubject"],"StudyID");



        console.log(event_params);

        eventlog_update_ajax(event_index = parse_val(entry["EventIndex"]),
                             event_info = event_params,
                             function(){table.bootstrapTable('refresh')});

        modal.modal('hide');
        form[0].reset();
    });

    modal_footer.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })


    $(modal).on('show.bs.modal', function () {                   
        init_fields(form,entry);
    })

    modal_footer.find("#revert_form").click(function(){
        $(modal_body).find('form')[0].reset();
        init_fields(form,entry);
    })

    modal_body.append(form);

    modal.modal('show');
}




function eventlog_modal(container, modal_id, title){
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


function show_event_log_handler(container){

    create_eventlog_table(container,eventlog_table_id);
    
    var table = $('#'+eventlog_table_id);

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

    var toolbar = container.find(".fixed-table-toolbar");


    eventlog_content = $("<div/>").attr("id","eventlogModalContainer");
    container.append(eventlog_content);

    toolbar.find(".needs-select").addClass("disabled");
}