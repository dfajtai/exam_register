var eventlog_table_id = "eventlogTable";
var eventlog_content = {};
// var eventlog_content_name = "";
// var eventlog_lock_list = [];

var eventlog_visible_subjects = null;
var eventlog_visible_subjects_info = null;
var eventlog_subject_string_lookup = {};


var active_eventlog_locks = [];
var active_eventlog_lock_info = {};

var eventlog_lock_interval = null;


function eventlog_retrieve_all_ajax(params) {
    // console.log("retrieve all subj");
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
    // console.log("retrieve some subj");
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


function eventlog_insert_ajax(event_info,callback = null) {
    if(callback === null){
        callback = function(){};
    }

    var data = {};
    data["event_info"]=event_info;
    if(!isObject(event_info)){
        data["multiple"] = true;
    }
    
    $.ajax({
        type: "POST",
        url: 'php/insert_event.php',
        // dataType: "json",
        data: data,
        success: function(result){
            callback();
        }
    });
}

function eventlog_update_ajax(event_index, event_info, callback = null, return_ajax = false) {
    if(callback === null){
        callback = function(){};
    }
    var ajax = $.ajax({
        type: "POST",
        url: 'php/update_event.php',
        // dataType: "json",
        data: {event_index: event_index, event_info:event_info},
        success: function(result){
            callback();
        }
    });
    if(return_ajax) return ajax;
    $.when(ajax);
}


function update_eventlog_locks(){
    getLocks("event_log",function(locked_indices,locks){
        var resource_lock_info = {};
        $.each(locked_indices,function(index,resource_id){
            var user = null;
            var valid = null;

            $.each(locks,function(index, lock_info){
                if(lock_info.resources.includes(resource_id)){
                    user = lock_info.user;
                    valid = lock_info.valid;
                    return false;
                }
            })
            resource_lock_info[resource_id] = {user:user,valid:valid};
        });

        if(!isEqual(locked_indices,active_eventlog_locks)){
            active_eventlog_locks = locked_indices;
            active_eventlog_lock_info = resource_lock_info;

            $('#'+eventlog_table_id).bootstrapTable('filterBy',{});
        }
    })
}


function eventlog_subjectFormatter(value,row){
    value = parse_val(value);
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

    var edit_btn = $("<button/>").addClass("btn btn-outline-dark btn-sm edit lockable me-1").append($("<i/>").addClass("fa fa-edit"))
    edit_btn.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Edit event");
    container.append(edit_btn);

    if(row["EventStatus"]!=event_deleted_status){
        var btn_remove = $("<button/>").addClass("btn btn-outline-danger btn-sm remove lockable").append($("<i/>").addClass("fa fa-trash"));
        btn_remove.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Set status to 'deleted'");
        container.append(btn_remove);
    }
    else{
        var btn_resotre = $("<button/>").addClass("btn btn-outline-primary btn-sm restore lockable").append($("<i/>").addClass("fa fa-trash-arrow-up"));
        btn_resotre.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Set status to 'planned'");
        container.append(btn_resotre);
    }

    // container.append($("<button/>").addClass("btn btn-outline-dark btn-sm status argeditor-lockable").append($("<i/>").addClass("fa fa-solid fa-signs-post")))

    // if(_lock_list.length>0){
    //     container.find("button").addClass("disabled");
    // }

    if(active_eventlog_locks.includes(row["EventIndex"])){
        container.find(".lockable").prop("disabled",true);
    }

    return container.prop("outerHTML");
  }

  function eventlog_lock_check(entries, candidate_indices, callback){
    if(!isArray(candidate_indices)) candidate_indices = [candidate_indices];
    if(!isArray(entries)) entries = [entries];

    getLocks("event_log",function(locked_indices,locks){
        var resource_already_locked = false;
        $.each(candidate_indices,function(entry_index,candidate_index){
            if(locked_indices.includes(candidate_index)){
                var user = null;
                var valid = null;
                $.each(locks,function(index, lock_info){
                    if(lock_info.resources.includes(candidate_index)){
                        user = lock_info.user;
                        valid = lock_info.valid;
                        return false;
                    }
                })
                resource_already_locked = true;
                var message = 'Event is locked by <b>'+userFormatter(user) + '</b> until <b>' + valid + '</b> - or until it gets released.'
                message+="<br>"+ object_to_table_formatter(entries[entry_index],eventlog_row_formatter).prop("outerHTML");
                bootbox.alert(message);
            }
        })
        
        if(!resource_already_locked){
            callback();
        }
    })        
}

window.eventlog_operate_events = {
    'click .edit': function (e, value, row, index) {
        var entry = $('#'+eventlog_table_id).bootstrapTable('getData')[index];
        var candidate_index = entry.EventIndex;

        eventlog_lock_check([entry],[candidate_index],function(){
            show_eventlog_modal_edit(eventlog_content,$("#"+eventlog_table_id),index);
        })
        
        // eventlog_content_name = "edit";
        // $( document ).trigger( "_lock", [ "edit"] );
    },
    'click .remove': function (e, value, row, index) {
        var entry = $('#'+eventlog_table_id).bootstrapTable('getData')[index];
        var candidate_index = entry.EventIndex;

        eventlog_lock_check([entry],[candidate_index],function(){
            eventlog_update_ajax(event_index = parse_val(row["EventIndex"]),
            event_info = {"EventStatus":event_deleted_status},
            function(){
                $('#'+eventlog_table_id).bootstrapTable('refresh');
                $('#'+eventlog_table_id).bootstrapTable('resetView');
            });
        })

    },
    'click .restore': function (e, value, row, index) {
        var entry = $('#'+eventlog_table_id).bootstrapTable('getData')[index];
        var candidate_index = entry.EventIndex;
        eventlog_lock_check([entry],[candidate_index],function(){
            eventlog_update_ajax(event_index = parse_val(row["EventIndex"]),
            event_info = {"EventStatus":event_planned_status},
            function(){
                $('#'+eventlog_table_id).bootstrapTable('refresh');
                $('#'+eventlog_table_id).bootstrapTable('resetView');
            });
        })
        
    },
}

function eventlog_query_params(params){
    params.indices = eventlog_visible_subjects;
    // console.log(eventlog_visible_subjects);
    return params
}


function eventlog_format_value(value,col){
    switch (col) {
        case "EventStudy":
            return studyFormatter(value,null);
            break;
        case "EventSubject":
            return eventlog_subjectFormatter(value,null);
            break;
        case "EventModifiedBy":
            return userFormatter(value,null);
            break;
        case "EventTemplate":
            return eventFormatter(value,null);
            break;
        case "EventLocation":
            return locationFormatter(value,null);
            break;            
        case "EventStatus":
            return eventStatusFormatter(value,null);
            break;         
              
        default:
            return value;
            break;
    }
}

function eventlog_row_formatter(row){
    if(!isObject(row)){
        return row;
    }
    var res  = {};
    $.each(row,function(key,value){
        res[key] = eventlog_format_value(value,key);
    })

    return res;
}

function eventlog_detail_view_formatter(index, row) {
    var detail_view_content = $('<div/>');
    
    var detail_info = $('<p/>').append($("<b/>").html("Event parameters<br/>"));
    var hidden_keys = ["state","EventData"]
    $.each(eventlog_row_formatter(row), function (key, value) {
        if(!(hidden_keys.includes(key))){
            detail_info.append($("<b/>").html(key+": "));
            detail_info.append(value+"&emsp;");  
        }

    })

    detail_view_content.append($("<div/>").addClass("me-3").append(detail_info));

    var event_data = JSON.parse(row["EventData"]);
    
    var detail_data_info = $('<p/>').append($("<b/>").html("Event data<br/>"));
    detail_view_content.append($("<div/>").addClass("me-3").append(detail_data_info));
    
    if(event_data!==null && isObject(event_data)){
        $.each(event_data, function (key, value) {
            detail_data_info.append($("<b/>").html(key+": "));
            detail_data_info.append(value+"&emsp;");    
        })
    }
    else{
        detail_data_info.append($("<i/>").html("Event data is not defined yet."));
    }

    var detail_view_data_form = $('<form/>').addClass("needs-validation");
    detail_view_content.append(detail_view_data_form);

    var event_params = getDefEntryFieldWhere('event_template_definitions','EventTemplateID', row['EventTemplate'],'EventFormJSON');
    showCustomArgs(detail_view_data_form,JSON.parse(event_params));

    var update_data_btn = $("<button/>").addClass("btn btn-outline-dark my-2 w-100").attr("type","submit").html("Update event data");
    detail_view_data_form.append(update_data_btn);

    if(active_eventlog_locks.includes(row["EventIndex"])){
        update_data_btn.prop("disabled",true);
    }

    detail_view_data_form.on('submit',function(e){
        e.preventDefault();
        
        var event_data = {};
        $.each($(this).serializeArray(), function(i, field) {
            // console.log(field);
            event_data[field.name] = get_readable_value(detail_view_data_form,field.name,field.value);
        });

        event_data = nullify_obj(event_data);
        eventlog_update_ajax(event_index = parse_val( parse_val(row["EventIndex"])),
            event_info = {"EventData":event_data},
            function(){$('#'+eventlog_table_id).bootstrapTable('refresh')});
    })

    // show values
    if(event_data!==null && isObject(event_data)){
        $(detail_view_data_form).find("input[name]").each(function(){
            var name = $(this).attr("name");
            if(name in event_data){
                $(this).val(event_data[name]).trigger("change");
            }
        });
        $(detail_view_data_form).find("textarea[name]").each(function(){
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

        $(detail_view_data_form).find("select[name]").each(function(){
            var name = $(this).attr("name");
            if(name in event_data){
                set_with_value($(this),event_data[name]);
                $(this).trigger("change");
            }
        });
    }

    // return detail_view_content.prop("outerHTML");
    return detail_view_content
}

function eventlog_lock_formatter(value,row){
    if(active_eventlog_locks.includes(row["EventIndex"])){
        var content = $("<span/>").addClass("bi bi-lock-fill text-danger");
        var _info = active_eventlog_lock_info[row["EventIndex"]];
        content.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Event has been locked by '"+ userFormatter(_info["user"]) +"' until "+ _info["valid"] +".")
        return content.prop("outerHTML");
    }
    return $("<span/>").addClass("bi bi-unlock-fill text-success").prop("outerHTML");
}

function eventlog_checkbox_formatter(value,row, index){
    if(active_eventlog_locks.includes(row["EventIndex"])){
        return {disabled: true, checked:false}
    }
    return {disabled: false};
}

function eventlog_status_filter(row, filters, visible_status = null){
    // console.log(filters);
    if(visible_status == null) return true;
    if(!isArray(visible_status)) return true;
    if(row["EventStatus"] == null) return true;
    if(!visible_status.includes(row["EventStatus"])) return false;
    return true;
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

            var options = {};

            if(eventlog_visible_subjects_info.length>0){
                $(toolbar).empty();
                toolbar.append($("<button/>").attr("id","toolbar_add").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-plus me-2").attr("aria-hidden","true")).append("Add New"));
                toolbar.append($("<button/>").attr("id","toolbar_duplicate").addClass("btn btn-outline-dark admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-solid fa-copy me-2").attr("aria-hidden","true")).append("Duplicate").attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Duplicate selected events."));
                toolbar.append($("<button/>").attr("id","toolbar_batch_edit").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable needs-select").html($("<i/>").addClass("fa fa-pen-to-square me-2").attr("aria-hidden","true")).append("Batch edit").attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Batch edit selected events."));

                var status_filter = statusFilterWidget("event",[event_deleted_status],
                    function(vals){
                        options["filterOptions"] = {'filterAlgorithm':function(row,filters){
                            return eventlog_status_filter(row,filters,vals);
                        }};

                        table.bootstrapTable("resetSearch");
                        table.bootstrapTable("refreshOptions",options);
                        table.bootstrapTable("filterBy",{});

                });
                
                status_filter.addClass("admin-table-toolbar-btn");
                toolbar.append(status_filter);

                toolbar.find("#toolbar_add").on("click", function(){
                    show_eventlog_modal_add(eventlog_content, table);

                    // $(document).trigger("_lock",["add"]);
                    // eventlog_content_name = "add";
                });

                
                toolbar.find("#toolbar_duplicate").on("click",function(e){
                    var selected =table.bootstrapTable("getSelections");

                    var data = [];
                    $.each(selected, function(index, entry){
                        var _data = {... entry};

                        delete _data["EventIndex"];
                        delete _data["state"];

                        $.each(_data,function(key){
                            // if(_data[key]==null) delete _data[key];
                            _data[key] = parse_val(_data[key]);
                        })
                        if(_data["EventData"])  _data["EventData"] = JSON.parse(_data["EventData"]);

                        data.push(_data);
                        
                    });
                    eventlog_insert_ajax(data,function(){table.bootstrapTable("refresh")});
                })

                toolbar.find("#toolbar_batch_edit").on("click", function(){
                    show_eventlog_batch_edit(eventlog_content, table);

                });

            }
            else{
                $(toolbar).empty();
            }

            $(toolbar.find("#status_filter_widget").find("input")[0]).trigger("change");

            if(subject_indices=="all"){
                eventlog_visible_subjects = getCol(subject_info,"SubjectIndex");
                options["queryParams"] = function(params) { return params };
                options["ajax"] = eventlog_retrieve_all_ajax;
            }
            else{
                eventlog_visible_subjects = subject_indices;
                options["queryParams"] = eventlog_query_params;
                options["ajax"] = eventlog_retrieve_subjects_ajax;
            }

            table.bootstrapTable('refreshOptions',options);
            table.bootstrapTable("filterBy",{});


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
    table.attr("data-regex-search","true");
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
                {field : 'state', checkbox: true, align:'center', forceHide:true, formatter: "eventlog_checkbox_formatter"},
                {title: '', field : 'locked', align:'center', forceHide:true,formatter: "eventlog_lock_formatter"},
                {title: '', field: 'operate', align: 'center', sortable:false, searchable:false, clickToSelect : false,
                events: window.eventlog_operate_events, formatter: eventlog_operate_formatter, forceHide:true},
                {title: '#', field : 'EventIndex', align:'center', sortable:true, searchable:false, visible:false, forceHide: true},
                {title: 'Subject', field : 'EventSubject', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "eventlog_subjectFormatter"},
                {title: 'Study', field : 'EventStudy', align:'center', sortable:true, searchable:true, formatter: "studyFormatter", forceExport: true},
                {title: 'Event Name', field : 'EventName', align:'center', sortable:true, searchable:true,forceExport: true},
                {title: 'Status', field : 'EventStatus', align:'center', sortable:true, searchable:true,forceExport: true,formatter: "eventStatusFormatter",},
                {title: 'Template', field : 'EventTemplate', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "eventFormatter",},
                {title: 'Location', field : 'EventLocation', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "locationFormatter",},
                {title: 'ModifiedAt', field : 'EventModifiedAt', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "datetimeFormatter",visible:false},
                {title: 'ModifiedBy', field : 'EventModifiedBy', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "userFormatter",visible:false},
                {title: 'Planned', field : 'EventPlannedTime', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "datetimeFormatter",},
                {title: 'Data', field : 'EventData', align:'center', sortable:false, searchable:false, forceExport: true, formatter: "jsonFormatter", visible:false},

              ],

            pagination:true,
            checkboxHeader:true,
            smartDisplay:true,
            detailFormatter:eventlog_detail_view_formatter,

            idField:"EventIndex",

            showExport:!simplify,
            exportTypes: ['csv','json','excel','doc','txt','sql','xml',"pdf"],
            exportDataType: 'all'
        });

}


function eventlog_subject_select_from_pool(container, subject_pool, subject_index = null){
    var subject_select =  $("<div/>").addClass("row mb-2").attr("id","eventlog_subject_input_block");

    var subject_label =  $("<label/>").addClass("col-md-3 col-form-label").html("Subject");
    var subject_select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id","subjectSelect").attr("name","EventSubject");
    subject_select_dropdow.prop('required',true).addClass("data-required data-required-style").attr("data-name","EventSubject");

    $.each(subject_pool,function(index,entry){
        if(!entry.hasOwnProperty("SubjectIndex")) return;
        let subject_index = entry["SubjectIndex"];
        subject_select_dropdow.append($("<option/>").html(eventlog_subject_string_lookup[subject_index]).attr("value",subject_index));
    });

    if(subject_pool.length>1){
        subject_select_dropdow.prepend($("<option/>").html("Choose subject...").prop('selected',true).attr("value",""));
    }

    subject_select.append(subject_label);
    subject_select.append($("<div/>").addClass("col-md-9").append(subject_select_dropdow));
    container.append($("<div/>").append(subject_select));

    subject_select_dropdow.on("change",function(){
        subject_index = $(this).val();
        // console.log(subject_index);
    })

    if(subject_index!==null){
        subject_select_dropdow.val(subject_index);
        subject_select.prop("hidden",true);
    }
}


function eventlog_add_form_inputs(form, subject_pool, subject_index = null){
    // var event_param_block =  $("<div/>").addClass("container shadow py-3 my-3");
    var event_param_block =  $("<div/>").addClass("row md-3").attr("id","eventlog_event_param_block");

    event_param_block.append($("<p/>").append($("<b/>").html("Event parameters")));
    eventlog_subject_select_from_pool(event_param_block,subject_pool, subject_index = null)

    var event_params_config =  [
        {"FieldName":"EventName","FieldLabel":"Event Name","FieldType":"input","FieldDataType":'text', "FieldRequired":true},
        {"FieldName":"EventTemplate","FieldLabel":"Event template","FieldType":"select","FieldSource":"event", "FieldRequired":true},
        {"FieldName":"EventStatus","FieldLabel":"Status","FieldType":"select","FieldSource":"event_status", "FieldRequired":true, "FieldDefaultValue":event_planned_status},
        {"FieldName":"EventPlannedTime","FieldLabel":"Planned Time","FieldType":"input","FieldDataType":'datetime', "FieldRequired":false},
        {"FieldName":"EventLocation","FieldLabel":"Location","FieldType":"select","FieldSource":"location", "FieldRequired":false},
        {"FieldName":"EventComment","FieldLabel":"Comment","FieldType":"input","FieldDataType":'longtext', "FieldRequired":false},
        ]
    showCustomArgs(event_param_block,event_params_config);

    event_param_block.find('[name="EventPlannedTime"]').val(null);
    // event_param_block.find('[name="EventTemplate"]').parent().parent().remove();

    form.append(event_param_block);


    var event_data_block =  $("<div/>").addClass("data-edit").attr("id","eventlog_event_data_block").prop("hidden","true");
    event_data_block.append($("<hr/>").addClass("my-3"));
    event_data_block.append($("<p/>").append($("<b/>").html("Event data")));

    var event_form_container = $("<div/>");
    event_data_block.append(event_form_container);
    form.append(event_data_block);

    var event_template = null;
    event_param_block.find('[name="EventTemplate"]').on("change",function(){
        event_template = $(this).val();
        if(event_template===null){
            event_form_container.empty();
            return;
        };
        var event_params = getDefEntryFieldWhere('event_template_definitions','EventTemplateID', event_template,'EventFormJSON');
        if(event_params===null){
            event_form_container.empty();
            return;
        };
        event_form_container.empty();
        showCustomArgs(event_form_container,JSON.parse(event_params));
        $(document).find("#dataeditSwitch").trigger("change");
    });


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

    var submitForm = $("<div/>");
    var submitButton = $("<button/>").addClass("btn btn-outline-dark w-100").attr("type","submit").html("Add event");
    submitForm.append(submitButton);

    eventlog_add_form_inputs(form, eventlog_visible_subjects_info );
    form.append(submitForm);

    var _switch_group = $("<div/>").addClass("form-check form-switch");
    var dataedit_switch = $("<input/>").addClass("form-check-input").attr("type","checkbox").attr("id","dataeditSwitch");
    _switch_group.append(dataedit_switch);
    _switch_group.append($("<label/>").addClass("form-check-label").attr("for","dataeditSwitch").html("Add data to event"));
    modal_body.append($("<div/>").addClass("input-group-text  mb-3").append(_switch_group));

    dataedit_switch.on("change",function(){
        var is_checked = $(dataedit_switch).is(":checked");
        if(is_checked) {
            form.find(".data-edit").prop("hidden",false);
            $.each(form.find(".data-edit").find("[data-name]"),function(index,entry){
                $(entry).attr("name",$(entry).attr("data-name"));
            })
            form.find(".data-edit").find(".data-required").prop('required',true);

        }
        else{
            form.find(".data-edit").prop("hidden",true);
            form.find(".data-edit").find(".data-required").removeAttr("name").prop("required",false);
        }
    })

    modal_body.append(form);

    $(modal).on('hidden.bs.modal',function(){
        $( document ).trigger("_release",["add"]);
        form[0].reset();
    })

    form.on('submit',function(e){
        e.preventDefault();

        var event_data = {};
        var event_params = {};
        var event_def_keys = ["EventTemplate","EventName","EventStatus","EventPlannedTime","EventComment","EventStudy","EventSubject","EventLocation"];

        $.each($(this).serializeArray(), function(i, field) {
            if(event_def_keys.includes(field.name)){
                event_params[field.name] = parse_val(field.value==""?null:field.value);
            }
            else{
                event_data[field.name] = get_readable_value(form,field.name,field.value);
            }
        });

        event_params["EventData"] = nullify_obj(event_data);
        event_params["EventStudy"] = getEntryFieldWhere(eventlog_visible_subjects_info,"SubjectIndex",event_params["EventSubject"],"StudyID");

        // console.log(event_params);
        // console.log(event_data);

        eventlog_insert_ajax(event_params,function(){table.bootstrapTable('refresh')});

        modal.modal('hide');
    });

    modal_footer.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
        $(modal_body).find(".form-check-input").trigger("change");
    })


    modal.modal('show');
}

function eventlog_edit_form_inputs(form, event_id, expert_edit = false){
    form.empty();

    var event_param_block = $("<div/>").addClass("expert-edit");
    event_param_block.append($("<p/>").append($("<b/>").html("Event parameters")));
    eventlog_subject_select_from_pool(event_param_block,eventlog_visible_subjects_info);
    var event_params =   [
        {"FieldName":"EventName","FieldLabel":"Event Name","FieldType":"input","FieldDataType":'text', "FieldRequired":false},
        {"FieldName":"EventTemplate","FieldLabel":"Event template","FieldType":"select","FieldSource":"event", "FieldRequired":true},
        {"FieldName":"EventLocation","FieldLabel":"Location","FieldType":"select","FieldSource":"location", "FieldRequired":false},
        {"FieldName":"EventComment","FieldLabel":"Comment","FieldType":"input","FieldDataType":'longtext', "FieldRequired":false},
        {"FieldName":"EventPlannedTime","FieldLabel":"Planned Time","FieldType":"input","FieldDataType":'datetime', "FieldRequired":false},
    ]
    showCustomArgs(event_param_block,event_params);

    event_param_block.append($("<hr/>").addClass("my-3"));
    form.append(event_param_block);

    if(!expert_edit){event_param_block.prop("hidden",true);}

    var event_data_block = $("<div/>").addClass("data-edit");
    event_data_block.append($("<p/>").append($("<b/>").html("Event data")));
    var event_data_params = getDefEntryFieldWhere('event_template_definitions','EventTemplateID', event_id,'EventFormJSON');
    if(event_data_params!==null){
        showCustomArgs(event_data_block,JSON.parse(event_data_params));
    }

    event_data_block.append($("<hr/>").addClass("my-3"));
    form.append(event_data_block);

    var event_status_block = $("<div/>").addClass("status-edit");
    showCustomArgs(event_status_block,[{"FieldName":"EventStatus","FieldLabel":"Status","FieldType":"select","FieldSource":"event_status", "FieldRequired":true}]);

    form.append(event_status_block);


    // form.find('[name]').prop('required',false).removeClass("border-2 border-dark");


    event_param_block.find('[name="EventTemplate"]').on("change",function(){
        var new_event_id = $(this).val();
        var event_data_params = getDefEntryFieldWhere('event_template_definitions','EventTemplateID', new_event_id,'EventFormJSON');
        event_data_block.empty();
        if(event_data_params!==null){
            showCustomArgs(event_data_block,JSON.parse(event_data_params));
            // event_data_block.find('[name]').prop('required',false).removeClass("border-2 border-dark");
            event_data_block.append($("<hr/>").addClass("my-3"));
        }
    });

}


function show_eventlog_modal_edit(container, table, index){
    var modal_id = "eventlog_modalEdit";
    var form_id = modal_id+"Form";

    if(index>table.bootstrapTable('getData').length){
        return
    }
    var entry = table.bootstrapTable('getData')[index];
    // console.log(entry);

    setLock("event_log",[entry["EventIndex"]],update_eventlog_locks);

    container.find("#"+modal_id).remove();

    eventlog_modal(container, modal_id, "Edit event");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");

    var modal_footer = modal.find(".modal-footer");
    modal_footer.prepend($("<button/>").addClass("btn btn-outline-dark").attr("id","revert_form").attr("aria-label","Revert").html($("<i/>").addClass("fa fa-rotate-right me-2").attr("aria-hidden","true")).append("Revert"));
    modal_footer.prepend($("<button/>").addClass("btn btn-outline-dark").attr("id","clear_data").attr("aria-label","Remove data").html($("<i/>").addClass("fa fa-text-slash me-2").attr("aria-hidden","true")).append("Empty event data"));
    modal_footer.prepend($("<button/>").addClass("btn btn-outline-dark").attr("id","add_copy").attr("aria-label","Add as copy").html($("<i/>").addClass("fa fa-copy me-2").attr("aria-hidden","true")).append("Add as copy"));


    modal_footer.find("#clear_form").html("Clear everything");

    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var submitForm = $("<div/>");
    var submitButton = $("<button/>").addClass("btn btn-outline-dark w-100").attr("type","submit").html("Update event");
    submitForm.append(submitButton);


    function init_fields(form,entry, trigger_select_change = false){
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
                set_with_value($(this),entry[name]);
                if(trigger_select_change) $(this).trigger("change");
            }
        });

        if(!entry.hasOwnProperty("EventData")) return;

        var event_data = JSON.parse(entry["EventData"]);
        if(event_data===null) return;
        if(!isObject(event_data)) return;

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
                set_with_value($(this),event_data[name]);
                if(trigger_select_change) $(this).trigger("change");
            }
        });
    }


    eventlog_edit_form_inputs(form,entry["EventTemplate"]);

    form.append(submitForm);

    var _switch_group = $("<div/>").addClass("form-check form-switch");
    var expertedit_switch = $("<input/>").addClass("form-check-input").attr("type","checkbox").attr("id","experteditSwitch");
    _switch_group.append(expertedit_switch);
    _switch_group.append($("<label/>").addClass("form-check-label").attr("for","experteditSwitch").html("Show event parameters"));
    modal_body.append($("<div/>").addClass("input-group-text  mb-3").append(_switch_group));

    // hide event parameter inputs (subject, EventTemplate, ...)
    expertedit_switch.on("change",function(){
        var is_checked = $(expertedit_switch).is(":checked");
        if(is_checked) {
            form.find(".expert-edit").prop("hidden",false);
            $.each(form.find(".expert-edit").find("[data-name]"),function(index,entry){
                $(entry).attr("name",$(entry).attr("data-name"));
            })
            form.find(".expert-edit").find(".data-required").prop('required',true);

            // modal_footer.find("#add_copy").prop("disabled",false).prop("hidden",false);
        }
        else {
            form.find(".expert-edit").prop("hidden","true");
            form.find(".expert-edit").find("[name]").removeAttr("name").prop('required',false);

            // modal_footer.find("#add_copy").prop("disabled",true).prop("hidden","true");
        }
    });

    modal_body.append(form);

    $(modal).on('hidden.bs.modal',function(){
        // $( document ).trigger("_release",["edit"]);
        releaseLock("event_log",update_eventlog_locks);
        form[0].reset();
    });

    form.on('submit',function(e, as_copy=false){
        e.preventDefault();

        var event_data = {};
        var event_params = {};
        var event_def_keys = ["EventTemplate","EventName","EventStatus","EventPlannedTime","EventComment","EventStudy","EventSubject","EventLocation"];

        $.each($(this).serializeArray(), function(i, field) {
            // if(!(field.value==""||field.value==null)) {
                if(event_def_keys.includes(field.name)){
                    event_params[field.name] = parse_val(field.value==""?null:field.value);
                }
                else{
                    event_data[field.name] = get_readable_value(form,field.name,field.value);
                }
            // }
        });

        event_params["EventData"] = nullify_obj(event_data);
        // event_params["EventTemplate"] = parse_val(entry["EventTemplate"]);
        // event_params["EventSubject"] = parse_val(entry["EventSubject"]);

        event_params["EventStudy"] = getEntryFieldWhere(eventlog_visible_subjects_info,"SubjectIndex",entry["EventSubject"],"StudyID");

        // console.log(event_params);

        if(as_copy){
            eventlog_insert_ajax(event_params,function(){table.bootstrapTable('refresh')});
        }
        else{
            eventlog_update_ajax(event_index = parse_val(entry["EventIndex"]),
            event_info = event_params,
            function(){table.bootstrapTable('refresh')});
        }

        modal.modal('hide');
    });

    modal_footer.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })

    modal_footer.find("#clear_data").click(function(){
        form.find(".data-edit").find("[name]").removeAttr("name").prop('required',false);
        form.find(".data-edit").prop("hidden",true);
    });

    modal_footer.find("#add_copy").click(function(){
        $.each(form.find(".expert-edit").find("[data-name]"),function(index,entry){
            $(entry).attr("name",$(entry).attr("data-name"));
        })
        form.find(".expert-edit").find(".data-required").prop('required',true);          

        if (! $(form)[0].checkValidity()) {
            
            $.each(form.find(".expert-edit").find("[data-name]"),function(index,entry){
                if($(entry).prop('required')&& ($(entry).val()==null || $(entry).val()=="")){
                    expertedit_switch.prop("checked",true).trigger("change");
                    return false;
                }
            })

            $(form)[0].reportValidity();
        }
        else{
            form.trigger("submit",true);
            expertedit_switch.trigger("change");
        }
    });

    $(modal).on('show.bs.modal', function () {
        init_fields(form,entry);
        expertedit_switch.trigger("change");
    })

    modal_footer.find("#revert_form").click(function(){
        $(modal_body).find('form')[0].reset();

        // reset expert-edit block
        form.find(".expert-edit").prop("hidden",false);
        $.each(form.find(".expert-edit").find("[data-name]"),function(index,entry){
            $(entry).attr("name",$(entry).attr("data-name"));
        })
        form.find(".expert-edit").find(".data-required").prop('required',true);
        

        // reset data-edit block
        $.each(form.find(".data-edit").find("[name]"),function(index,entry){
            $(entry).attr("name",$(entry).attr("data-name"));
        })
        form.find(".data-edit").prop("hidden",false);
        form.find(".data-edit").find(".data-required").prop('required',true);

        // initialize every named fields with the original values
        init_fields(form,entry);

        // trigger switch to remove names
        expertedit_switch.trigger("change");
    });



    modal.modal('show');
}

function show_eventlog_batch_edit(container, table){
    var modal_id = "eventlog_modalEdit";
    var form_id = modal_id+"Form";

    var selected =table.bootstrapTable("getSelections");

    if(selected.length==0){
        return
    }

    var candidate_indices = getCol(selected,"EventIndex");
    setLock("event_log",candidate_indices,update_eventlog_locks);

    container.find("#"+modal_id).remove();

    eventlog_modal(container, modal_id, "Batch edit selected events");
    
    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");

    var modal_footer = modal.find(".modal-footer");
    modal_footer.find("#clear_form").remove();

    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");
    
    var event_param_block =  $("<div/>").addClass("row md-3").attr("id","eventlog_event_param_block");
    event_param_block.append($("<p/>").append($("<b/>").html("Event parameters")));
    if(eventlog_visible_subjects.length>1){
        eventlog_subject_select_from_pool(event_param_block, eventlog_visible_subjects_info, subject_index = null);
        $(event_param_block.find("label")[0]).html("New subject");
    }

    var event_params_config =  [
        {"FieldName":"EventName","FieldLabel":"New event name","FieldType":"input","FieldDataType":'text', "FieldRequired":true},
        {"FieldName":"EventTemplate","FieldLabel":"New event template","FieldType":"select","FieldSource":"event", "FieldRequired":true},
        {"FieldName":"EventStatus","FieldLabel":"New status","FieldType":"select","FieldSource":"event_status", "FieldRequired":true},
        {"FieldName":"EventPlannedTime","FieldLabel":"New planned time","FieldType":"input","FieldDataType":'datetime', "FieldRequired":false},
        {"FieldName":"EventLocation","FieldLabel":"New location","FieldType":"select","FieldSource":"location", "FieldRequired":false},
        {"FieldName":"EventComment","FieldLabel":"New comment","FieldType":"input","FieldDataType":'longtext', "FieldRequired":false},
        ];

    showCustomArgs(event_param_block,event_params_config);
       
    event_param_block.find('.data-required').prop("required",false).removeClass("data-required-style");
    event_param_block.find('[name="EventPlannedTime"]').val(null);
    
    var nullable_elements = $(event_param_block).find(":not(.data-required)[name]");
    // iterate over nullable elments
    $.each(nullable_elements,function(index, element){
        var element_name = $(element).prop("name");
        var switch_id = "remove"+element_name+"Switch";

        var remove_prop_switch_group = $("<div/>").addClass("form-check form-switch");
        var remove_prop_switch = $("<input/>").addClass("form-check-input").attr("type","checkbox").attr("id",switch_id);
        remove_prop_switch.addClass("prop-remove").attr("prop-name",element_name);
        remove_prop_switch_group.append(remove_prop_switch);
        remove_prop_switch_group.append($("<label/>").addClass("form-check-label").attr("for",switch_id).html("Set '"+ element_name +"' parameter to 'NULL'."));
        event_param_block.append($("<div/>").addClass("mb-1").append(remove_prop_switch_group));
    })


    event_param_block.append($("<hr/>").addClass("my-3"));
    var remove_data_switch_group = $("<div/>").addClass("form-check form-switch");
    var remove_data_switch = $("<input/>").addClass("form-check-input").attr("type","checkbox").attr("id","removedataSwitch");
    remove_data_switch_group.append(remove_data_switch);
    remove_data_switch_group.append($("<label/>").addClass("form-check-label").attr("for","removedataSwitch").html("Remove data - use this on your own responsibility"));
    event_param_block.append($("<div/>").addClass("mb-3").append(remove_data_switch_group));


    form.append(event_param_block);
    modal_body.append(form);
    
    var modal_body_btns = $("<div/>").addClass("row");
    var btn_batch_duplicate = $("<button/>").addClass("btn btn-outline-dark w-100").attr("id","batch_duplicate").attr("aria-label","Duplicate events with new parameters").html($("<i/>").addClass("fa fa-copy me-2").attr("aria-hidden","true")).append("Duplicate events with new parameters");
    var btn_batch_update =$("<button/>").addClass("btn btn-outline-dark w-100").attr("id","batch_update").attr("aria-label","Update selected events").html($("<i/>").addClass("fa fa-arrows-spin me-2").attr("aria-hidden","true")).append("Update selected events");
    modal_body_btns.append($("<div/>").addClass("col-md-6").append(btn_batch_duplicate));
    modal_body_btns.append($("<div/>").addClass("col-md-6").append(btn_batch_update));
    modal_body.append($("<div/>").append(modal_body_btns));

    function read_settings(){
        var remove_data = remove_data_switch.prop("checked");
        var event_params = {};

        $.each($(form).serializeArray(), function(i, field) {
            // console.log(field);

            // if it is not required it can be empty
            var element = $(event_param_block).find(":not(.data-required)[name='"+field.name+"']");
            if(element.length>0){
                // but only if it is allowed to...
                var checkbox = $(event_param_block).find(".prop-remove[prop-name='"+field.name+"']");
                if(checkbox.length>0){
                    var allow_remove = $(checkbox[0]).prop("checked");
                    if(allow_remove){
                        event_params[field.name] = null;
                        return true;
                    }
                }
            }
            // except null values are skipped
            var parsed_val = parse_val(field.value);
            if(parsed_val!=null)
                event_params[field.name] = field.value;

            // console.log(event_params[field.name]);
        });
        
        if(remove_data){ 
            event_params["EventData"] = null;
        }

        return event_params;
    }

    btn_batch_duplicate.on("click",function(){

        var update_params = read_settings();
        // console.log(update_params);

        var message = 'You are going to duplicate the selected';
        message += selected.length == 1 ? ' event': ' <b>'+ selected.length +'</b> events';
        if(Object.entries(update_params).length>0){
            message+=', with the following parameters updated:<br/>';
            // $.each(update_params,function(key,value){
            //     message += "<i>"+key+"</i>: "+ eventlog_format_value(value,key)+"<br/>"; 
            // });

            var update_table = batch_update_formatter(update_params,eventlog_row_formatter);
            message+=$(update_table).prop("outerHTML");
        }
        else{
            message+=".";
        }

        bootbox.confirm({
            message: message + '<br/>Do you want to proceed?',
            buttons: {
            confirm: {
            label: 'Yes',
            className: 'btn-outline-danger'
            },
            cancel: {
            label: 'No',
            className: 'btn-outline-dark'
            }
            },
            callback: function (result) {
                if(result){
                    var event_info_list = []
                    $.each(selected,function(index,entry){
                        var event_info = {... entry};
                        delete event_info.EventIndex;
                        delete event_info.EventModifiedAt;
                        delete event_info.EventModifiedBy;
                        delete event_info.state;

                        event_info["EventData"] = JSON.parse(event_info["EventData"]);

                        $.each(update_params,function(key,value){
                            event_info[key]=value;
                        });

                        event_info_list.push(event_info);
                    })
                    event_insert_ajax(event_info_list,function(){
                        table.bootstrapTable("refresh");
                        modal.modal("hide");
                    });
                }
            }
            });
    })

    btn_batch_update.on("click",function(){

        var update_params = read_settings();
        // console.log(update_params);

        var message = 'You are going to update the selected';
        message += selected.length == 1 ? ' event': ' <b>'+ selected.length +'</b> events';
        if(Object.entries(update_params).length>0){
            message+=', with the following parameters updated:<br/>';
            // $.each(update_params,function(key,value){
            //     message += "<i>"+key+"</i>: "+ eventlog_format_value(value,key)+"<br/>"; 
            // });

            var update_table = batch_update_formatter(update_params,eventlog_row_formatter);
            message+=$(update_table).prop("outerHTML");
        }
        else{
            message+=".";
        }

        bootbox.confirm({
            message: message + '<br/>Do you want to proceed?',
            buttons: {
            confirm: {
            label: 'Yes',
            className: 'btn-outline-danger'
            },
            cancel: {
            label: 'No',
            className: 'btn-outline-dark'
            }
            },
            callback: function (result) {
                if(result){
                    // bundle multiple update together
                    var ajax_list = [];
                    $.each(selected,function(index,entry){
                        var ajax = eventlog_update_ajax(parse_val(entry.EventIndex), update_params,function(){
                            // console.log(parse_val(entry.EventIndex));
                        },true);
                        ajax_list.push(ajax);
                    });
                    $.when.apply(this,ajax_list).then(function(){
                        // console.log("DONE!");
                        table.bootstrapTable("refresh");
                        modal.modal("hide");
                    })
                }
            }
            });
    })

    $(modal).on('hidden.bs.modal',function(){
        form[0].reset();
        releaseLock("event_log",update_eventlog_locks);
    });

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
    // modal_footer.append($("<button/>").addClass("btn btn-outline-dark").attr("id","copy_selected").attr("aria-label","Copy Selected").html($("<i/>").addClass("fa fa-copy").attr("aria-hidden","true")).append(" Copy Selected"));
    modal_footer.append($("<button/>").addClass("btn btn-outline-dark").attr("id","clear_form").attr("aria-label","Clear").html($("<i/>").addClass("fa fa-eraser me-2").attr("aria-hidden","true")).append("Clear"));
    modal_footer.append($("<button/>").addClass("btn btn-outline-dark").attr("data-bs-dismiss","modal").attr("aria-label","Close").html("Close"));

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

    // table.on('refresh-options.bs.table',function(options){
    //     console.log(options);
    // })

    // table.on('refresh.bs.table',function(params){
    //     console.log(params);
    // })

    var toolbar = container.find(".fixed-table-toolbar");

    eventlog_content = $("<div/>").attr("id","eventlogModalContainer");
    container.append(eventlog_content);

    toolbar.find(".needs-select").addClass("disabled");

    eventlog_lock_interval = setInterval(update_eventlog_locks,5000);
}