var users_eventlog_table_id = "users_eventlogTable";
var users_eventlog_content = {};

var users_eventlog_visible_subjects = null;
var users_eventlog_visible_subjects_info = null;
var users_eventlog_subject_string_lookup = {};

var users_eventlog_locks = [];
var users_eventlog_lock_info = {};

var users_eventlog_lock_interval = null;

var user_eventlog_show_delete = true;

function users_eventlog_retrieve_subjects_ajax(params) {
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


function users_eventlog_insert_ajax(event_info,callback = null) {
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

function users_eventlog_update_ajax(event_index, event_info, callback = null, return_ajax = false) {
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


function update_users_eventlog_locks(){
    var $table = $('#'+users_eventlog_table_id);

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

        if(!isEqual(locked_indices,users_eventlog_locks)){
            users_eventlog_locks = locked_indices;
            users_eventlog_lock_info = resource_lock_info;

            var options = $table.bootstrapTable("getOptions");
            var page_number = options.pageNumber;
            $table.bootstrapTable('selectPage', page_number);
        }
    })
}


function users_eventlog_subjectFormatter(value,row){
    value = parse_val(value);
    if(value==null) return;
    var res = null;
    if(users_eventlog_visible_subjects.length==0) return res;
    if(users_eventlog_visible_subjects.includes(value)){
        return users_eventlog_subject_string_lookup[value];
    }
    return res;
}

function users_eventlog_operate_formatter(value, row, index) {
    var container = $("<div/>").addClass("lockable");
    var container = $("<div/>").addClass("lockable");

    var edit_btn = $("<button/>").addClass("btn btn-outline-dark btn-sm edit lockable me-1").append($("<i/>").addClass("fa fa-edit"))
    edit_btn.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Edit event");
    container.append(edit_btn);

    if(user_eventlog_show_delete){
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
    }

    // container.append($("<button/>").addClass("btn btn-outline-dark btn-sm status argeditor-lockable").append($("<i/>").addClass("fa fa-solid fa-signs-post")))

    // if(_lock_list.length>0){
    //     container.find("button").addClass("disabled");
    // }

    if(users_eventlog_locks.includes(row["EventIndex"])){
        container.find(".lockable").prop("disabled",true);
    }

    return container.prop("outerHTML");
  }

  function users_eventlog_lock_check(entries, candidate_indices, callback){
    if(!isArray(candidate_indices)) candidate_indices = [candidate_indices];
    if(!isArray(entries)) entries = [entries];

    getLocks("users_eventlog",function(locked_indices,locks){
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
                message+="<br>"+ object_to_table_formatter(entries[entry_index],users_eventlog_row_formatter).prop("outerHTML");
                bootbox.alert(message);
            }
        })
        
        if(!resource_already_locked){
            callback();
        }
    })        
}

window.users_eventlog_operate_events = {
    'click .edit': function (e, value, row, index) {
        var entry = $('#'+users_eventlog_table_id).bootstrapTable('getData')[index];
        var candidate_index = entry.EventIndex;

        users_eventlog_lock_check([entry],[candidate_index],function(){
            show_users_eventlog_modal_edit(users_eventlog_content,$("#"+users_eventlog_table_id),index);
        })
        
        // users_eventlog_content_name = "edit";
        // $( document ).trigger( "_lock", [ "edit"] );
    },
    'click .remove': function (e, value, row, index) {
        var entry = $('#'+users_eventlog_table_id).bootstrapTable('getData')[index];
        var candidate_index = entry.EventIndex;

        users_eventlog_lock_check([entry],[candidate_index],function(){
            users_eventlog_update_ajax(event_index = parse_val(row["EventIndex"]),
            event_info = {"EventStatus":event_deleted_status},
            function(){
                $('#'+users_eventlog_table_id).bootstrapTable('refresh');
                $('#'+users_eventlog_table_id).bootstrapTable('resetView');
            });
        })

    },
    'click .restore': function (e, value, row, index) {
        var entry = $('#'+users_eventlog_table_id).bootstrapTable('getData')[index];
        var candidate_index = entry.EventIndex;
        users_eventlog_lock_check([entry],[candidate_index],function(){
            users_eventlog_update_ajax(event_index = parse_val(row["EventIndex"]),
            event_info = {"EventStatus":event_planned_status},
            function(){
                $('#'+users_eventlog_table_id).bootstrapTable('refresh');
                $('#'+users_eventlog_table_id).bootstrapTable('resetView');
            });
        })
        
    },
}

function users_eventlog_query_params(params){
    params.indices = users_eventlog_visible_subjects;
    return params
}


function users_eventlog_format_value(value,col){
    switch (col) {
        case "EventStudy":
            return studyFormatter(value,null);
            break;
        case "EventSubject":
            return users_eventlog_subjectFormatter(value,null);
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

function users_eventlog_row_formatter(row){
    if(!isObject(row)){
        return row;
    }
    var res  = {};
    $.each(row,function(key,value){
        res[key] = users_eventlog_format_value(value,key);
    })

    return res;
}


function users_eventlog_lock_formatter(value,row){
    if(users_eventlog_locks.includes(row["EventIndex"])){
        var content = $("<span/>").addClass("bi bi-lock-fill text-danger");
        var _info = users_eventlog_lock_info[row["EventIndex"]];
        content.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Event has been locked by '"+ userFormatter(_info["user"]) +"' until "+ _info["valid"] +".")
        return content.prop("outerHTML");
    }

    var content = $("<span/>").addClass("bi bi-unlock-fill text-success");
    content.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Event can be edited.")

    return content.prop("outerHTML");
}

function users_eventlog_checkbox_formatter(value,row, index){
    if(users_eventlog_locks.includes(row["EventIndex"])){
        return {disabled: true, checked:false}
    }
    return {disabled: false};
}

function users_eventlog_status_filter(row, filters, visible_status = null){
    // console.log(filters);
    if(visible_status == null) return true;
    if(!isArray(visible_status)) return true;
    if(row["EventStatus"] == null) return true;
    if(!visible_status.includes(row["EventStatus"])) return false;
    return true;
}


function create_users_eventlog_table(container, table_id, subject_info){
    var table = $("<table/>").attr("id",table_id);

    var toolbar = $("<div/>").attr("id",table_id+"_toolbar");

    var subject_index = subject_info.SubjectIndex;

    users_eventlog_visible_subjects = [subject_index];
    users_eventlog_visible_subjects_info = [subject_info];
    users_eventlog_subject_string_lookup[subject_index] = subject_info.Name + " [" + subject_info.SubjectID + "]";


    var options = {};
    options["queryParams"] = users_eventlog_query_params;
    options["ajax"] = users_eventlog_retrieve_subjects_ajax;
   
    $(toolbar).empty();
    toolbar.append($("<button/>").attr("id","toolbar_add").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-plus me-2").attr("aria-hidden","true")).append("Add New"));
    toolbar.append($("<button/>").attr("id","toolbar_duplicate").addClass("btn btn-outline-dark admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-solid fa-copy me-2").attr("aria-hidden","true")).append("Duplicate").attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Duplicate selected events."));

    var status_filter = statusFilterWidget("event",[event_deleted_status],
        function(vals){
            options["filterOptions"] = {'filterAlgorithm':function(row,filters){
                return users_eventlog_status_filter(row,filters,vals);
            }};

            table.bootstrapTable("resetSearch");
            table.bootstrapTable("refreshOptions",options);
            table.bootstrapTable("filterBy",{});

    });
    
    status_filter.addClass("admin-table-toolbar-btn");
    toolbar.append(status_filter);

    toolbar.find("#toolbar_add").on("click", function(){
        show_users_eventlog_modal_add(users_eventlog_content, table);

        // $(document).trigger("_lock",["add"]);
        // users_eventlog_content_name = "add";
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
        users_eventlog_insert_ajax(data,function(){table.bootstrapTable("refresh")});
    })

    table.attr("data-toolbar","#"+table_id+"_toolbar");
    table.attr("data-toolbar-align","left");


    table.attr("data-pagination","false");
    table.attr("data-show-pagination-switch","false");
    table.attr("data-page-list","[10, 25, 50, 100, all]");

    table.attr("data-show-footer","false");

    table.attr("data-show-refresh","true");

    table.attr("data-show-fullscreen","true");
    table.attr("data-auto-refresh","true");
    table.attr("data-auto-refresh-status","false");
    table.attr("data-show-auto-refresh","true");
    table.attr("data-auto-refresh-interval","10");
    table.attr("data-auto-refresh-silent","true");
    table.attr("data-minimum-count-columns","2");
    table.attr("data-show-columns","true");
    table.attr("data-show-columns-toggle-all","true");

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
                {field : 'state', checkbox: true, align:'center', forceHide:true, formatter: "users_eventlog_checkbox_formatter"},
                {title: '', field : 'locked', align:'center', forceHide:true,formatter: "users_eventlog_lock_formatter"},
                {title: '', field: 'operate', align: 'center', sortable:false, searchable:false, clickToSelect : false,
                events: window.users_eventlog_operate_events, formatter: users_eventlog_operate_formatter, forceHide:true},
                {title: '#', field : 'EventIndex', align:'center', sortable:true, searchable:false, visible:false, forceHide: true},
                {title: 'Subject', field : 'EventSubject', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "users_eventlog_subjectFormatter"},
                {title: 'Study', field : 'EventStudy', align:'center', sortable:true, searchable:true, formatter: "studyFormatter", forceExport: true, visible:false},
                {title: 'Event Name', field : 'EventName', align:'center', sortable:true, searchable:true,forceExport: true},
                {title: 'Status', field : 'EventStatus', align:'center', sortable:true, searchable:true,forceExport: true,formatter: "eventStatusFormatter",},
                {title: 'Template', field : 'EventTemplate', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "eventFormatter",},
                {title: 'Location', field : 'EventLocation', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "locationFormatter",},
                {title: 'ModifiedAt', field : 'EventModifiedAt', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "datetimeFormatter",visible:false},
                {title: 'ModifiedBy', field : 'EventModifiedBy', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "userFormatter",visible:false},
                {title: 'Data', field : 'EventData', align:'center', sortable:false, searchable:false, forceExport: true, formatter: "jsonFormatter", visible:false},

              ],

            pagination:true,
            checkboxHeader:true,
            smartDisplay:true,

            idField:"EventIndex",
        });

    $(toolbar.find("#status_filter_widget").find("input")[0]).trigger("change");
}

function users_eventlog_add_form_inputs(form, subject_pool, subject_index = null){
    // var event_param_block =  $("<div/>").addClass("container shadow py-3 my-3");
    var event_param_block =  $("<div/>").addClass("row md-3").attr("id","users_eventlog_event_param_block");

    event_param_block.append($("<p/>").append($("<b/>").html("Event parameters")));

    var event_params_config =  [
        {"FieldName":"EventName","FieldLabel":"Event Name","FieldType":"input","FieldDataType":'text', "FieldRequired":true},
        {"FieldName":"EventTemplate","FieldLabel":"Event template","FieldType":"select","FieldSource":"event", "FieldRequired":true},
        {"FieldName":"EventStatus","FieldLabel":"Status","FieldType":"select","FieldSource":"event_status", "FieldRequired":true, "FieldDefaultValue":event_planned_status},
        {"FieldName":"EventLocation","FieldLabel":"Location","FieldType":"select","FieldSource":"location", "FieldRequired":false},
        {"FieldName":"EventComment","FieldLabel":"Comment","FieldType":"input","FieldDataType":'longtext', "FieldRequired":false},
        ]
    showCustomArgs(event_param_block,event_params_config,false);

    event_param_block.find('[name="EventPlannedTime"]').val(null);
    // event_param_block.find('[name="EventTemplate"]').parent().parent().remove();

    form.append(event_param_block);


    var event_data_block =  $("<div/>").addClass("data-edit").attr("id","users_eventlog_event_data_block").prop("hidden","true");
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
        showCustomArgs(event_form_container,JSON.parse(event_params),false);
        $(document).find("#dataeditSwitch").trigger("change");
    });


}

function show_users_eventlog_modal_add(container, table){
    var modal_id = "users_eventlog_modalAdd";
    var form_id = modal_id+"Form";

    container.find("#"+modal_id).remove();

    users_eventlog_modal(container, modal_id, "Add new event from scratch");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    var modal_footer = modal.find(".modal-footer");

    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var submitForm = $("<div/>");
    var submitButton = $("<button/>").addClass("btn btn-outline-dark w-100").attr("type","submit").html("Add event");
    submitForm.append(submitButton);

    users_eventlog_add_form_inputs(form, users_eventlog_visible_subjects_info );
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
        event_params["EventStudy"] = getEntryFieldWhere(users_eventlog_visible_subjects_info,"SubjectIndex",event_params["EventSubject"],"StudyID");

        // console.log(event_params);
        // console.log(event_data);

        users_eventlog_insert_ajax(event_params,function(){table.bootstrapTable('refresh')});

        modal.modal('hide');
    });

    modal_footer.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
        $(modal_body).find(".form-check-input").trigger("change");
    })


    modal.modal('show');
}

function users_eventlog_edit_form_inputs(form, event_id){
    form.empty();

    
    var event_data_block = $("<div/>").addClass("data-edit");
    event_data_block.append($("<p/>").append($("<b/>").html("Event data")));
    var event_data_params = getDefEntryFieldWhere('event_template_definitions','EventTemplateID', event_id,'EventFormJSON');
    if(event_data_params!==null){
        showCustomArgs(event_data_block,JSON.parse(event_data_params));
    }

    event_data_block.append($("<hr/>").addClass("my-3"));
    form.append(event_data_block);

    var event_status_block = $("<div/>").addClass("status-edit");
    showCustomArgs(event_status_block,[
        {"FieldName":"EventComment","FieldLabel":"Comment","FieldType":"input","FieldDataType":'longtext', "FieldRequired":false},
        {"FieldName":"EventStatus","FieldLabel":"Status","FieldType":"select","FieldSource":"event_status", "FieldRequired":true}]);

    form.append(event_status_block);


    // form.find('[name]').prop('required',false).removeClass("border-2 border-dark");

}


function show_users_eventlog_modal_edit(container, table, index){
    var modal_id = "users_eventlog_modalEdit";
    var form_id = modal_id+"Form";

    if(index>table.bootstrapTable('getData').length){
        return
    }
    var entry = table.bootstrapTable('getData')[index];
    // console.log(entry);

    setLock("event_log",[entry["EventIndex"]],update_users_eventlog_locks);

    container.find("#"+modal_id).remove();

    users_eventlog_modal(container, modal_id, "Edit event");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");

    var modal_footer = modal.find(".modal-footer");
    modal_footer.prepend($("<button/>").addClass("btn btn-outline-dark").attr("id","revert_form").attr("aria-label","Revert").html($("<i/>").addClass("fa fa-rotate-right me-2").attr("aria-hidden","true")).append("Revert"));
    modal_footer.prepend($("<button/>").addClass("btn btn-outline-dark").attr("id","add_copy").attr("aria-label","Add as copy").html($("<i/>").addClass("fa fa-copy me-2").attr("aria-hidden","true")).append("Add as copy"));

    modal_footer.find("#clear_form").remove();

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


    users_eventlog_edit_form_inputs(form,entry["EventTemplate"]);

    form.append(submitForm);

    modal_body.append(form);

    $(modal).on('hidden.bs.modal',function(){
        // $( document ).trigger("_release",["edit"]);
        releaseLock("event_log",update_users_eventlog_locks);
        form[0].reset();
    });

    form.on('submit',function(e, as_copy=false){
        e.preventDefault();

        if(! form[0].checkValidity()){
            form[0].reportValidity();
            return;
        }

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

        $.each(event_def_keys,function(index,field){
            if(!(field in event_params)){
                event_params[field] = parse_val(entry[field]);
            }
        })


        event_params["EventData"] = nullify_obj(event_data);


        if(as_copy){
            users_eventlog_insert_ajax(event_params,function(){
                table.bootstrapTable('refresh');
                modal.modal('hide');
            });
        }
        else{
            checkOwnLock("event_log",entry["EventIndex"],
                function(){
                    users_eventlog_update_ajax(event_index = parse_val(entry["EventIndex"]),
                    event_info = event_params,
                    function(){
                        table.bootstrapTable('refresh');
                        modal.modal('hide');
                    
                });
                },
                function(){
                    var message = 'Resource lock has expired or taken.'
                    bootbox.alert(message);
                }
                )
            
        }

        
    });

    modal_footer.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })


    modal_footer.find("#add_copy").click(function(){
        if (! $(form)[0].checkValidity()) {
            $(form)[0].reportValidity();
        }
        else{
            form.trigger("submit",true);
        }
    });

    $(modal).on('show.bs.modal', function () {
        init_fields(form,entry);
    })

    modal_footer.find("#revert_form").click(function(){
        $(modal_body).find('form')[0].reset();

        $.each(form.find(".data-edit").find("[name]"),function(index,entry){
            $(entry).attr("name",$(entry).attr("data-name"));
        })
        form.find(".data-edit").prop("hidden",false);
        form.find(".data-edit").find(".data-required").prop('required',true);

        // initialize every named fields with the original values
        init_fields(form,entry);

        // trigger switch to remove names
    });



    modal.modal('show');
}


function users_eventlog_modal(container, modal_id, title){
    var modal_root = $("<div/>").addClass("modal fade").attr("id",modal_id).attr("tabindex","-1");
    var modal_dialog = $("<div/>").addClass("modal-dialog modal-xl");
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


function start_users_eventlog_lock_timer(){
    if(users_eventlog_lock_interval!= null){
        clearInterval(users_eventlog_lock_interval)
    }
    users_eventlog_lock_interval = setInterval(update_users_eventlog_locks,5000);
}    

function stop_users_eventlog_lock_timer(){
    if(users_eventlog_lock_interval!= null){
        clearInterval(users_eventlog_lock_interval)
        users_eventlog_lock_interval = null;
    }
}   

function show_users_eventlog_handler(container, subject_info){

    create_users_eventlog_table(container,users_eventlog_table_id, subject_info);

    var table = $('#'+users_eventlog_table_id);

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

    table.on('load-success.bs.table',function(params){
        update_users_eventlog_locks();
    })

    var toolbar = container.find(".fixed-table-toolbar");

    users_eventlog_content = $("<div/>").attr("id","users_eventlogModalContainer");
    container.append(users_eventlog_content);

    toolbar.find(".needs-select").addClass("disabled");

    // start_users_eventlog_lock_timer();
}