var event_batch_table_id = "eventBatchTable";
var event_batch_content = {};

var event_batch_content_name = "";
var event_batch_lock_list = [];


function event_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_event.php',
        dataType: "json",
        data: ({event_info:params}),
        success: function(result){
            callback();
        }
    });
}

window.event_batch_operate_events = {
    'click .move_up': function (e, value, row, index) {
        if(index==0){
            return
        }
        var data = table.bootstrapTable('getData');
        var upper_data = {... data[index-1]};
        upper_data.state = upper_data.state===undefined ? false : upper_data.state;
        $('#'+event_batch_table_id).bootstrapTable('updateRow',{index:index-1,row:row});
        $('#'+event_batch_table_id).bootstrapTable('updateRow',{index:index, row:upper_data});
    },
    'click .move_down': function (e, value, row, index) {
        var data = $('#'+event_batch_table_id).bootstrapTable('getData');
        if(index==data.length-1){
            return
        }
        var lower_data = {... data[index+1]};
        lower_data.state = lower_data.state === undefined ? false : lower_data.state;
        $('#'+event_batch_table_id).bootstrapTable('updateRow',{index:index+1,row:row});
        $('#'+event_batch_table_id).bootstrapTable('updateRow',{index:index, row:lower_data});
    },
    'click .edit': function (e, value, row, index) {
        show_event_batch_modal_edit(event_batch_content,$("#"+event_batch_table_id),index);
        event_batch_content_name = "edit";
        $( document ).trigger( "_lock", [ "edit"] );
    },
    'click .remove': function (e, value, row, index) {
        bootbox.confirm({
            message: 'You are going to the selected event: "'+ row["EventName"] +'".<br>Do you want to proceed?',
            buttons: {
            confirm: {
            label: 'Yes',
            className: 'btn-outline-danger'
            },
            cancel: {
            label: 'No',
            className: 'btn-outline-success'
            }
            },
            callback: function (result) {
                if(result){
                    $('#'+event_batch_table_id).bootstrapTable('remove', {
                        field: '$index',
                        values: [index]
                        });
                    statusToStorage("eventBatchEditorHistory",JSON.stringify($('#'+event_batch_table_id).bootstrapTable('getData')));
                }
            }
            });
    }
}

function eventBatchOperateFormatter(value, row, index) {
    var container = $("<div/>").addClass("lockable");
    var up_down_gorup = $("<div/>").addClass("btn-group me-3 ");
    var btn_up = $("<button/>").attr("type","button").addClass("btn btn-outline-secondary btn-sm move_up lockable").append($("<i/>").addClass("fa fa-angle-up"));
    var btn_down = $("<button/>").attr("type","button").addClass("btn btn-outline-secondary btn-sm move_down lockable").append($("<i/>").addClass("fa fa-angle-down"));
    btn_up.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Move up");
    btn_down.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Move down");

    up_down_gorup.append(btn_up)
    up_down_gorup.append(btn_down)
    container.append(up_down_gorup);

    var btn_edit = $("<button/>").addClass("btn btn-outline-primary btn-sm edit me-2 lockable").append($("<i/>").addClass("fa fa-edit"));
    var btn_remove = $("<button/>").addClass("btn btn-outline-danger btn-sm remove lockable").append($("<i/>").addClass("fa fa-trash"))
    btn_edit.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Edit");
    btn_remove.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Remove");
    
    container.append(btn_edit)
    container.append(btn_remove)

    
    if (index==0){
        btn_up.addClass("disabled").removeClass("lockable");
    }
    if(index==$('#'+event_batch_table_id).bootstrapTable('getData').length-1){
        btn_down.addClass("disabled").removeClass("lockable");
    }

    if(event_batch_lock_list.length>0){
        container.find("button").addClass("disabled");
    }

    return container.prop("outerHTML");
}



 function eventbatch_detail_view_formatter(index, row) {
    var detail_view_content = $('<div/>');
    var detail_view_preview = $('<div/>');
    
    var detail_info = $('<p/>');
    var hidden_keys = ["state"]
    $.each(row, function (key, value) {
        if(!(hidden_keys.includes(key))){
            detail_info.append($("<b/>").html(key+": "));
            detail_info.append(value+" ");
        }

    })

    detail_view_content.append($("<div/>").addClass("me-3").append(detail_info));

    var event_params = getDefEntryFieldWhere('event_definitions','EventID', row['EventID'],'EventFormJSON');
    showCustomArgs(detail_view_preview,JSON.parse(event_params));

    detail_view_content.append(detail_view_preview);

    return detail_view_content.prop("outerHTML");
}


function createBatchTable(container, table_id, height){
    // var table_with_controls = $("<div/>");

   
    var table = $("<table/>").attr("id",table_id);

    var toolbar = $("<div/>").attr("id",table_id+"_toolbar");
    toolbar.append($("<button/>").attr("id","toolbar_add").addClass("btn btn-success admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-plus me-2").attr("aria-hidden","true")).append("Add New"));
    toolbar.append($("<button/>").attr("id","toolbar_duplicate").addClass("btn btn-primary admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-solid fa-copy me-2").attr("aria-hidden","true")).append("Duplicate Selected"));
    toolbar.append($("<button/>").attr("id","toolbar_removeSelected").addClass("btn btn-danger admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-trash fa-solid me-2").attr("aria-hidden","true")).append("Remove Selected"));
    toolbar.append($("<button/>").attr("id","toolbar_json_import").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-file-import fa-solid me-2").attr("aria-hidden","true")).append("Import"));
    toolbar.append($("<button/>").attr("id","toolbar_json_export").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-code fa-solid me-2").attr("aria-hidden","true")).append("Export"));
    toolbar.append($("<button/>").attr("id","toolbar_make_events").addClass("btn btn-outline-success admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-gears fa-solid me-2").attr("aria-hidden","true")).append("Make events"));


    table.attr("data-height",String(height));

    table.attr("data-toolbar","#"+table_id+"_toolbar");
    table.attr("data-toolbar-align","left");
    

    table.attr("data-pagination","false");
    table.attr("data-show-pagination-switch","false");
    table.attr("data-page-list","[10, 25, 50, 100, all]");

    table.attr("data-show-footer","false");

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

    var table_container = $("<div/>").addClass("row mt-2")
    table_container.append(table);
    table_container.append(toolbar);
    container.append(table_container)

    table.bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: '', field: 'operate', align: 'center', sortable:false, searchable:false, clickToSelect : false,
                events: window.event_batch_operate_events, formatter: eventBatchOperateFormatter},
                {title: 'Name', field : 'EventName', align:'center', sortable:true, searchable:true},
                {title: 'Template', field : 'EventID', align:'center', sortable:true, searchable:true, formatter: eventFormatter},
                {title: 'Type', field : 'EventType', align:'center', sortable:true, searchable:true, formatter: eventTypeFormatter},
                {title: 'Comment', field : 'EventComment', align:'center', sortable:true, searchable:true},
                {title: 'Status', field : 'EventStatus', align:'center', sortable:true, searchable:true, formatter: eventStatusFormatter},
                {title: 'Planned Time', field : 'EventPlannedTime', align:'center', sortable:true, searchable:true, formatter: datetimeFormatter},
                {title: 'Location', field : 'EventLocation', align:'center', sortable:true, searchable:true, formatter: locationFormatter},
            ],
            pagination:true,
            checkboxHeader:true,
            smartDisplay:true,
            detailFormatter: eventbatch_detail_view_formatter
            // detailFormatter: simpleFlatFormatter
        });    
}

function eventBatchInput(container){
    var planned_eventStatusID = getDefEntryFieldWhere("event_status_definitions","EventStatusName","planned","EventStatusID");

    var params =  [
        {"FieldName":"EventName","FieldLabel":"Event Name","FieldType":"input","FieldDataType":'text', "FieldRequired":true},
        {"FieldName":"EventID","FieldLabel":"Event template","FieldType":"select","FieldSource":"event", "FieldRequired":true},
        {"FieldName":"EventStatus","FieldLabel":"Status","FieldType":"select","FieldSource":"event_status", "FieldRequired":true, "FieldDefaultValue":planned_eventStatusID},
        {"FieldName":"EventPlannedTime","FieldLabel":"Planned Time","FieldType":"input","FieldDataType":'datetime', "FieldRequired":false},
        {"FieldName":"EventLocation","FieldLabel":"Location","FieldType":"select","FieldSource":"location", "FieldRequired":false},
        {"FieldName":"EventComment","FieldLabel":"Comment","FieldType":"input","FieldDataType":'longtext', "FieldRequired":false},
        ]    
    showCustomArgs(container,params);    
}

function eventBatchModal(container, modal_id, title){
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


function show_event_batch_modal_add(container, table){
    var modal_id = "eventBatchModalAdd";
    var form_id = modal_id+"Form";

    container.find("#"+modal_id).remove();

    eventBatchModal(container, modal_id, "Add event");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var submitForm = $("<div/>").addClass("row mb-3 text-center");
    var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Add event");
    submitForm.append(submitButton);

    eventBatchInput(form);
    form.append(submitForm);
    
    $(modal).on('hide.bs.modal',function(){
        $( document ).trigger("_release",["add"]);
        event_batch_content_name = "";
    });

    $(modal).on('hidden.bs.modal',function(){
        $( document ).trigger("_release",["add"]);
    });

    $(modal).on('show.bs.modal',function(){
        form.find('input[type=datetime-local]').val(null);
    })

    form.on('submit',function(e){
        e.preventDefault();
        var values = {};
        $.each($(this).serializeArray(), function(i, field) {
            if(!(field.value==""||field.value==null)) values[field.name]= field.value;
        });
        values["EventType"] = getDefEntryFieldWhere("event_definitions","EventID",values["EventID"],"EventType")

        table.bootstrapTable("append",values);
        statusToStorage("eventBatchEditorHistory",JSON.stringify(table.bootstrapTable('getData')));

        modal.modal('hide');
        form[0].reset();
    });

    container.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })
    
    modal_body.append(form);

    modal.modal('show');
}


function show_event_batch_modal_edit(container, table, index){
    var modal_id = "eventBatchModalEdit";
    var form_id = modal_id+"Form";

    if(index>table.bootstrapTable('getData').length){
        return
    }
    var entry = table.bootstrapTable('getData')[index];

    container.find("#"+modal_id).remove();

    eventBatchModal(container, modal_id, "Edit event");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");

    var modal_footer = modal.find(".modal-footer");
    modal_footer.prepend($("<button/>").addClass("btn btn-outline-danger").attr("id","revert_form").attr("aria-label","Clear").html($("<i/>").addClass("fa fa-rotate-right me-2").attr("aria-hidden","true")).append("Revert"));


    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var submitForm = $("<div/>").addClass("row mb-3 text-center");
    var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Alter event");
    submitForm.append(submitButton);

    eventBatchInput(form);
    form.append(submitForm);

    
    $(modal).on('hide.bs.modal',function(){
        $( document ).trigger("_release",["edit"]);
        event_batch_content_name = "";
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

        if(entry["EventPlannedTime"]==null | entry["EventPlannedTime"]=="")
            $(form).find('input[type=datetime-local]').val("");
    }

    $(modal).on('show.bs.modal', function () {                   
        init_fields(form,entry);
        // console.log(entry);
    })

    modal_footer.find("#revert_form").click(function(){
        init_fields(form,entry);
    })


    modal_footer.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })  


    form.off('submit').on('submit',function(e){
        e.preventDefault();

        var values = {};
        $.each($(this).serializeArray(), function(i, field) {
            if(!(field.value==""||field.value==null)) values[field.name]= field.value;
        });
        values["EventType"] = getDefEntryFieldWhere("event_definitions","EventID",values["EventID"],"EventType")
        
        table.bootstrapTable("updateRow",{
            index: index,
            row: values
            });


        statusToStorage("eventBatchEditorHistory",JSON.stringify(table.bootstrapTable('getData')));

        modal.modal('hide');
        form[0].reset();
    });

    container.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })
    modal_body.append(form);

    modal.modal('show');
} 

function show_event_batch_modal_json_import(container, table){
    var modal_id = "eventBatchModalJSONImport";
    var form_id = modal_id+"Form";

    container.find("#"+modal_id).remove();

    eventBatchModal(container, modal_id, "Import JSON");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");
    var input_div = $("<div/>").addClass("mb-3");
    input_div.append($("<label/>").addClass("form-label").attr("for","json_input_textarea").html("Insert your JSON text"));
    var textarea  = $("<textarea/>").addClass("form-control").attr("id","json_input_textarea").attr("name","json_text").attr("rows",15);
    input_div.append(textarea);
    form.append(input_div);

    var submitForm = $("<div/>").addClass("row mb-3 text-center");
    var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Import");
    submitForm.append(submitButton);

    form.append(submitForm);
    
    
    $(modal).on('hide.bs.modal',function(){
        $( document ).trigger("_release",["json_import"]);
        event_batch_content_name = "";
    })

    form.on('submit',function(e){
        e.preventDefault();

        var json_text = $(textarea).val();
        var json = JSON.parse(json_text);
        table.bootstrapTable('append',json);
        statusToStorage("eventBatchEditorHistory",JSON.stringify(table.bootstrapTable('getData')));

        modal.modal('hide');
        form[0].reset();
    });

    container.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })
    modal_body.append(form);

    modal.modal('show');
}

function show_event_batch_modal_json_export(container, table){
    var modal_id = "eventBatchModalJSONExport";
    var form_id = modal_id+"Form";

    container.find("#"+modal_id).remove();

    eventBatchModal(container, modal_id, "Export JSON");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var modal_footer = modal.find(".modal-footer");
    modal_footer.empty();


    var input_div = $("<div/>").addClass("mb-3");
    input_div.append($("<label/>").addClass("form-label").attr("for","json_export_textarea").html("The JSON equivalent of the current event batch"));
    var textarea = $("<textarea/>").addClass("form-control").attr("id","json_export_textarea").attr("name","json_text").attr("rows",15);
    input_div.append(textarea);
    form.append(input_div);


    // var submitForm = $("<div/>").addClass("row mb-3 text-center");
    // var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Import");
    // submitForm.append(submitButton);

    // form.append(submitForm);
    
    
    $(modal).on('hide.bs.modal',function(){
        $( document ).trigger("_release",["json_export"]);
        event_batch_content_name = "";
    })

    $(modal).on('show.bs.modal',function(){
        var data = table.bootstrapTable('getData');

        var filtered_data = [];
        $.each(data,function(index,row){
            var _data = {... row};
            delete _data.state;
            filtered_data.push(_data);
        })
    
        $(textarea).text(JSON.stringify(filtered_data));
    })


    container.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })
    modal_body.append(form);

    modal.modal('show');
} 



function show_event_batch_modal_make(container, table){
    if(table.bootstrapTable("getData").length==0){
        alert("Please add at least one event to the batch.");
        return;
    }

    var modal_id = "eventBatchModalGenerateEvents";
    var form_id = modal_id+"Form";

    container.find("#"+modal_id).remove();

    eventBatchModal(container, modal_id, "Create events for subjects");

    var modal = container.find("#"+modal_id);

    var dialog = modal.find(".modal-dialog");
    if(dialog){
        dialog.removeClass("modal-lg").addClass("modal-xl");
    }

    var modal_body = modal.find(".modal-body");

    var modal_footer = modal.find(".modal-footer");
    modal_footer.empty();
    
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var subject_container = $("<div/>").attr("id","subject_selector").addClass("mb-3 container");
    var subject_selector_table_id = "subjectSelectorTable";

    var submitForm = $("<div/>").addClass("row mb-3 text-center px-5");
    var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Make events for selected subjects");
    submitForm.append(submitButton);


    form.append(subject_container);
    form.append(submitForm);
    
    
    $(modal).on('hide.bs.modal',function(){
        // $( document ).trigger("_release",["make_events"]);
        // event_batch_content_name = "";
    })

    $(modal).on('show.bs.modal',function(){
        createSubjectTable(subject_container,subject_selector_table_id,true);
        
        var subject_table = subject_container.find("#"+subject_selector_table_id);
        subject_table.bootstrapTable("resetView");
        subject_table.bootstrapTable('hideColumn', 'operate');
        
    });


    form.on('submit',function(e){
        e.preventDefault();

        var subject_table = subject_container.find("#"+subject_selector_table_id);
        var selected_subjects = $(subject_table).bootstrapTable("getSelections");

        if(selected_subjects.length==0){
            alert("Please select at least one subject.");
            return;
        }

        var current_event_batch = $(table).bootstrapTable("getData");      

        var message = 'You are going to make '+current_event_batch.length+' events (as a batch) for the following subject(s) [N = '+ selected_subjects.length+']:<br>';
        var subjects = [];
        $.each(selected_subjects,function(index,subject_info){
            subjects.push("Name: " + subject_info["Name"] + " | ID: "+subject_info["SubjectID"]+" | Study: "+ 
            getDefEntryFieldWhere("studies","StudyID",subject_info["StudyID"],"StudyName") +"<br>");
        });
        message = message+subjects.join("");
        message = message+'<br><br>Do you want to proceed?';

        bootbox.confirm({
            message: message,
            buttons: {
            confirm: {
            label: 'Yes',
            className: 'btn-outline-danger'
            },
            cancel: {
            label: 'No',
            className: 'btn-outline-success'
            }
            },
            callback: function (result) {
                if(result){
                    $.each(selected_subjects,function(selected_subject_index,subject_info){
                        // console.log(subject_info);
                        $.each(current_event_batch,function(_event_index,event_info){
                            // console.log(event_info);

                            var event_data = {"EventName":event_info["EventName"],
                                              "EventStatus":event_info["EventStatus"],
                                              "EventPlannedTime":event_info["EventPlannedTime"],
                                              "EventID":event_info["EventID"],
                                              "EventLocation":event_info["EventLocation"],
                                              "EventComment":event_info["EventComment"]?event_info["EventComment"]:'',
                                              "EventStudy":subject_info["StudyID"],
                                              "EventSubject":subject_info["SubjectIndex"]
                                            }
                            event_insert_ajax(event_data);
                        });
                    });
                }
            }
            });


        modal.modal('hide');
        form[0].reset();
    });

    container.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })
    modal_body.append(form);

    modal.modal('show');
} 

function showEventBatchEditor(container){
    createBatchTable(container,event_batch_table_id,750);
    var table = $('#'+event_batch_table_id);
    
    if(statusInStorage("eventBatchEditorHistory")){
        table.bootstrapTable('append',JSON.parse(statusFromStorage("eventBatchEditorHistory")));
    }

    var toolbar = container.find(".fixed-table-toolbar");
    
    toolbar.find(".needs-select").addClass("disabled");
    
    event_batch_content = $("<div/>").addClass("pt-3");
    container.append(event_batch_content);

    table.on('all.bs.table',
    // table.on('check.bs.table check-all.bs.table check-some.bs.table uncheck.bs.table uncheck-all.bs.table uncheck-some.bs.table',
        function(){
            if(event_batch_lock_list.length>0) return;

            var selection =  table.bootstrapTable('getSelections');
            if(selection.length>0 && event_batch_lock_list.length==0){
                toolbar.find(".needs-select").removeClass("disabled");
            }
            else{
                toolbar.find(".needs-select").addClass("disabled");
            }
        }
    )

    table.on('search.bs.table',function(e,text){
        if(text!=""){
            $( document ).trigger( "_lock", [ "search"] );
        }
        else{
            $( document ).trigger( "_release", [ "search"] );
        }
    }
    )

    table.on('sort.bs.table',function(e,name,order){
        if(order){
            $( document ).trigger( "_lock", [ "sort"] );
        }else{
            $( document ).trigger( "_release", [ "sort"] );
        }
    }
    )



    toolbar.find("#toolbar_add").on("click", function(){
        show_event_batch_modal_add(container,table);

        $(document).trigger("_lock",["add"]);
        event_batch_content_name = "add";
    });


    toolbar.find("#toolbar_make_events").on("click", function(){
        show_event_batch_modal_make(container,table);

        // $(document).trigger("_lock",["make_events"]);
        // event_batch_content_name = "make_events";
    });


    toolbar.find("#toolbar_json_import").on("click", function(){
        show_event_batch_modal_json_import(container,table);

        $(document).trigger("_lock",["json_import"]);
        event_batch_content_name = "json_import";
    });

    toolbar.find("#toolbar_json_export").on("click", function(){
        show_event_batch_modal_json_export(container,table);

        $(document).trigger("_lock",["json_export"]);
        event_batch_content_name = "json_export";
    });


    toolbar.find("#toolbar_duplicate").on("click",function(e){
        var selected = $('input[name="btSelectItem"]:checked');
        if(selected.length>1){
            $('input[name="btSelectItem"]:checked').each(function () {
                let index = $(this).data('index');
                var data = table.bootstrapTable('getData');
                var _data = {... data[index]};
                _data["state"] = false;
                table.bootstrapTable("append",_data);
            })
            
            statusToStorage("eventBatchEditorHistory",JSON.stringify(table.bootstrapTable('getData')));
        }
        else{
            $('input[name="btSelectItem"]:checked').each(function () {
                let index = $(this).data('index');
                var data = table.bootstrapTable('getData');
                var _data = {... data[index]};
                _data["state"] = false;
                table.bootstrapTable("insertRow",{index:index+1,row:_data});
            })
            statusToStorage("eventBatchEditorHistory",JSON.stringify(table.bootstrapTable('getData')));
        }

        table.bootstrapTable("resetSearch"); // to call the formatter...
    });

    toolbar.find("#toolbar_removeSelected").on("click",function(e){
        bootbox.confirm({
            message: 'You are going to remove the selected events from the batch. Do you want to proceed?',
            buttons: {
            confirm: {
            label: 'Yes',
            className: 'btn-outline-danger'
            },
            cancel: {
            label: 'No',
            className: 'btn-outline-success'
            }
            },
            callback: function (result) {
                if(result){
                    var indices = [];


                    $('input[name="btSelectItem"]:checked').each(function(){
                        indices.push($(this).data('index'));
                    })
                    // console.log(indices);
                    table.bootstrapTable("remove",{field:"$index",values:indices});
                    statusToStorage("eventBatchEditorHistory",JSON.stringify(table.bootstrapTable('getData')));

                    $('#'+event_batch_table_id).bootstrapTable("resetSearch"); // to call the formatter...
                    $('#'+event_batch_table_id).bootstrapTable("uncheckAll");
                }
            }
            });


    })

    $( document ).on( "operate_lock", {},
        function( event ) {
            if(event_batch_lock_list.length!=0){
                $(document).find(".lockable").addClass("disabled");
                if(!event_batch_lock_list.includes("search")) $(document).find(".search-input").prop( "disabled", true );
                $(document).find(".sortable").prop( "disabled", true );
            }
            else{
                $(event_batch_content).empty();
                $(document).find(".lockable").not(".needs-select").removeClass("disabled");
                if(!event_batch_lock_list.includes("search")) $(document).find(".search-input").prop( "disabled", false );
                $(document).find(".sortable").prop( "disabled", false );
            }
        });

    $( document ).on( "_lock", {},
        function( event, lock_name ) {
            if(!(lock_name == "" || lock_name == null )){
                event_batch_lock_list.push(lock_name);
                // console.log("Lock ["+lock_name+"] acquired.");
                $(this).trigger("operate_lock",[]);
            }
        });

    $( document ).on( "_release", {},
    function( event, lock_name ) {
        if(!(lock_name == "" || lock_name == null )){
            event_batch_lock_list = _.without(event_batch_lock_list,lock_name);
            // console.log("Lock ["+lock_name+"] released.");
            $(this).trigger("operate_lock",[]);
        }
    });
            

}