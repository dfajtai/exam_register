var users_main_tool_content = null;

var users_subject_card_content = null;
var users_event_content = null;

var users_current_subject = null;
var users_subject_refresh_interval = null;
var users_subject_lock_interval = null;

var users_current_subjects_lock = null;

function users_subject_retrieve_ajax(subject_index,callback,error_calback) {
    if(callback === null){
        callback = function(){};
    }

    if(error_calback === null){
        error_calback = function(){};
    }

    $.ajax({
        type: "GET",
        url: 'php/retrieve_table_where.php',
        dataType: "json",
        data: ({table_name:"subjects",where:{"SubjectIndex": subject_index}}),
        success: function (result) {
            callback(result);
        },
        error: function(er){
            error_calback()
        }
    });
}

function users_subject_update_ajax(subject_index,subject_info,callback,return_ajax = false) {
    if(callback === null){
        callback = function(){};
    }
    var ajax = $.ajax({
        type: "POST",
        url: 'php/update_subject.php',
        // dataType: "json",
        data: ({subject_index:subject_index, subject_info:subject_info}),
        success: function(result){
            callback();
        }
    });
    if(return_ajax) return ajax;
    $.when(ajax);
}




function subject_card_inputs(container){
    var params =  [
    // {"FieldName":"SubjectID","FieldLabel":"Subject ID","FieldDataType":"text","FieldType":"input","FieldRequired":true},
    // {"FieldName":"StudyID","FieldLabel":"Study","FieldType":"select","FieldSource":"study","FieldRequired":true},
    {"FieldName":"Name","FieldLabel":"Name","FieldDataType":"text","FieldType":"input","FieldRequired":false},
    {"FieldName":"Group","FieldLabel":"Group","FieldDataType":"text","FieldType":"input","FieldRequired":false},
    {"FieldName":"Batch","FieldLabel":"Batch","FieldDataType":"text","FieldType":"input","FieldRequired":false},
    {"FieldName":"Age","FieldLabel":"Age","FieldType":"input","FieldDataType":"numeric", "FieldDataStep":"1","FieldUnit":"year","FieldRequired":false},
    {"FieldName":"Sex","FieldLabel":"Sex","FieldType":"select","FieldSource":"sex","FieldRequired":false},
    {"FieldName":"Container","FieldLabel":"Box","FieldType":"input","FieldDataType":"range", "FieldDataStep":"1","FieldDataMin":"1","FieldDataMax":"30","FieldRequired":false},
    {"FieldName":"Weight","FieldLabel":"Weight","FieldType":"input","FieldDataType":"numeric", "FieldDataStep":"0.01","FieldUnit":"kg","FieldRequired":false},
    {"FieldName":"Height","FieldLabel":"Height","FieldType":"input","FieldDataType":"numeric", "FieldDataStep":"0.01","FieldUnit":"cm","FieldRequired":false},
    {"FieldName":"Location","FieldLabel":"Location","FieldType":"select","FieldSource":"location"},
    {"FieldName":"Comment","FieldLabel":"Comment","FieldType":"input","FieldDataType":"longtext"},
    {"FieldName":"Status","FieldLabel":"Status","FieldType":"select","FieldSource":"subject_status","FieldDefaultValue":subject_planned_status}
    ]

    showCustomArgs(container,params,true);

    // var disabled_fields = ["SubjectID","StudyID"];
    // $.each(disabled_fields,function(index,field_name){
    //     $.each(container.find("[name='" + field_name + "']"),function(_index,field){
    //         $(field).addClass("user-cant-edit");
    //     })
    // })
}


function users_subject_title(entry){
    var title = null;
    var subtitle = null;

    let name = entry.Name;
    let id = entry.SubjectID;
    let index = entry.SubjectIndex;
    if(name==null){
        title = $("<div/>").addClass("flex-grow-1").html("Subject " + id);
    }else{
        title = $("<div/>").addClass("flex-grow-1").html("Subject "+name +" ["+ id+"]");
    }
    subtitle = $("<div/>").html("<small><i>nr."+index+"</i></small>");

    return [title, subtitle]
}

function users_clear_content_btn(){
    var clear_btn = $("<button/>").addClass("btn btn-outline-light").attr("type","text").append($("<i/>").addClass("fa fa-solid fa-x"));

    $(clear_btn).on("click",function(){
        $(users_main_tool_content).empty().prop("hidden",true);
        users_subject_card_content = null;
        users_event_content = null;
        stop_users_subjectlock_timer();
        stop_users_eventlog_lock_timer();
    })
    return $("<div/>").addClass("ms-3").append(clear_btn);
}



function init_users_main_tool(container){
    container.empty();

    users_subject_card_content = null;
    users_event_content = null;
    stop_users_subjectlock_timer();
    stop_users_eventlog_lock_timer();

    var subject_handler_toolbar = $("<div/>").addClass("d-flex flex-column flex-lg-row justify-content-evenly").attr("id","subject_handler_toolbar");
    
    // subject search
    var subject_search_tool_btn = $("<button/>").addClass("btn btn-outline-dark me-lg-2 px-5 flex-lg-fill mb-1 mb-lg-0").html("Search subject");
    subject_search_tool_btn.attr("data-bs-toggle","collapse").attr("data-bs-target","#search_collapse");

    var search_collapse = $("<div/>").addClass("collapse").attr("id","search_collapse");
    var search_collapse_card = $("<div/>").addClass("card card-body");
    var search_collapse_card_content = $("<div/>");

    var bs_search_collapse = new bootstrap.Collapse($(search_collapse), {
        toggle: false
    })

    search_collapse.append(search_collapse_card.append(search_collapse_card_content));

    subjectSearchWidget(search_collapse_card_content,
        statusFromStorage("activeStudy"),
        function(new_indices,new_info){
            if(new_indices.length>0){
                search_collapse.on("hidden.bs.collapse",function(){
                    users_subject_card_content = null;
                    users_event_content = null;
                    stop_users_subjectlock_timer();
                    stop_users_eventlog_lock_timer();
                
                    var titles = users_subject_title(new_info[0]);
                    $(users_main_tool_content).prop("hidden",false);
                    users_main_tools_view($(users_main_tool_content),new_indices[0],titles[0],titles[1]);
                    var index = new_info[0].SubjectIndex;
                    statusToUrl("subjectIndex",index);
                    search_collapse.off("hidden.bs.collapse");
                })
                setTimeout(function(){
                    bs_search_collapse.hide();
                },500);
            }
        },
        true
    )

    subject_handler_toolbar.append(subject_search_tool_btn);

    // subject select from pool

    var subject_select_tool_btn = $("<button/>").addClass("btn btn-outline-dark px-5 flex-lg-fill mb-1 mb-lg-0").html("Select from pool");
    subject_select_tool_btn.attr("data-bs-toggle","collapse").attr("data-bs-target","#select_collapse");

    var select_collapse = $("<div/>").addClass("collapse").attr("id","select_collapse");
    var select_collapse_card = $("<div/>").addClass("card card-body");
    var select_collapse_card_content = $("<div/>").addClass("w-100");

    var bs_select_collapse = new bootstrap.Collapse($(select_collapse), {
        toggle: false
    })

    select_collapse.append(select_collapse_card.append(select_collapse_card_content));
    select_collapse.on("show.bs.collapse",function(){
        subjectSelectFromPoolWidget(select_collapse_card_content, function(new_index,new_info){
            
            if(new_index!==null){
                setTimeout(function(){
                    bs_select_collapse.hide();
                },500);
                select_collapse.on("hidden.bs.collapse",function(){
                    users_subject_card_content = null;
                    users_event_content = null;
                    stop_users_subjectlock_timer();
                    stop_users_eventlog_lock_timer();
                
                    var titles = users_subject_title(new_info);
                    $(users_main_tool_content).prop("hidden",false);
                    users_main_tools_view($(users_main_tool_content),new_index,titles[0],titles[1]);
     
                    statusToUrl("subjectIndex",new_index);
                    select_collapse.off("hidden.bs.collapse");
                })
            }
        });
    });   

    select_collapse.on("shown.bs.collapse",function(){
        select_collapse_card_content.trigger("show-indicator");
    }); 


    subject_handler_toolbar.append(subject_select_tool_btn);

    subject_search_tool_btn.on("click",function(){
        bs_select_collapse.hide();
    })

    subject_select_tool_btn.on("click",function(){
        bs_search_collapse.hide();
    })
    
    users_main_tool_content = $("<div/>").addClass("subject-handler-content").addClass("container shadow px-2 py-2").attr("hidden","true");

    container.append(subject_handler_toolbar);
    container.append(search_collapse);
    container.append(select_collapse);
    container.append(users_main_tool_content);

}

function users_update_subject_lock_indicator(){ 
    checkLock("subjects",users_current_subject,
    // resource is free
    function(){
        users_subject_lock_indicator_free();

        var new_lock = null;
        if(!isEqual(new_lock,users_current_subjects_lock)){
            users_current_subjects_lock = new_lock;
            $(users_subject_card_content).trigger("lock_change");
        }     
    },
    // locked by others
    function(lock){
        if(lock["user"]==current_user){
            users_subject_lock_indicator_used_by_user(lock);
        }
        else{
            users_subject_lock_indicator_used_by_other(lock);
        }

        var new_lock = parse_val(lock["user"]);
        if(!isEqual(new_lock,users_current_subjects_lock)){
            users_current_subjects_lock = new_lock;
            $(users_subject_card_content).trigger("lock_change");
        }
    })
}

function users_subject_lock_indicator_free(){
    var indicator = $(users_subject_card_content).find(".resource-indicator").first();
    indicator.empty();

    var content = $("<span/>").addClass("bi bi-unlock-fill text-success opacity-100");
    content.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right");
    content.attr("title","Subject can be edited.");


    indicator.append(content);
}

function users_subject_lock_indicator_used_by_other(lock){
    var indicator = $(users_subject_card_content).find(".resource-indicator").first();
    indicator.empty();

    var content = $("<span/>").addClass("bi bi-lock-fill text-danger opacity-100");
    content.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right");
    content.attr("title","Subject has been locked by '"+ userFormatter(lock["user"]) +"' until "+ lock["valid"] +".");


    indicator.append(content);
}

function users_subject_lock_indicator_used_by_user(lock){
    var indicator = $(users_subject_card_content).find(".resource-indicator").first();
    indicator.empty();
    var content = $("<span/>").addClass("bi bi-lock-fill text-danger");
    content.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right");
    content.attr("title","Subject has been locked by you until "+ lock["valid"] +".");

    indicator.append(content);
}

function start_users_subjectlock_timer(){
    if(users_subject_lock_interval!=null){
        clearInterval(users_subject_lock_interval);
    }
    // users_update_subject_lock_indicator();
    users_subject_lock_interval = setInterval(users_update_subject_lock_indicator, 5000);
}

function stop_users_subjectlock_timer(){
    if(users_subject_lock_interval!=null){
        clearInterval(users_subject_lock_interval);
        users_subject_lock_interval = null;
    }
}

function users_subject_card(container,entry){
    function init_fields(form,entry){
        $(form).find("input[name]").each(function(){
            var name = $(this).attr("name");
            if(name in entry){
                if($(this).attr("data-value")!=undefined){
                    //this is a range input
                    if(entry[name]===null){
                        $(this).val(entry[name]);
                    }
                    else{
                        $(this).val(entry[name]).trigger("change");
                    }
                }
                else{
                    $(this).val(entry[name]).trigger("change");
                }
                
            }
        });
        $(form).find("textarea[name]").each(function(){
            var name = $(this).attr("name");
            if(name in entry){
                $(this).val(entry[name]);
            }
        });
        
        $(form).find("select[name]").each(function(){
            var name = $(this).attr("name");
            if(name in entry){
                $(this).val(entry[name]);
            }
        });

        $(form).find("input,select,textarea").each(function(){$(this).addClass("subject-resource")});
    }

    function refresh_subject(){
        users_subject_retrieve_ajax(users_current_subject,function(result){
            if(result.length==1){    
                var entry = result[0];
                init_fields(form,entry);
            }
            else{
                container.empty();
            }
        })

    }

    container.empty();

    users_subject_card_content = container;

    var toolbar = $("<div/>").addClass("toolbar d-flex flex-column flex-xl-row mb-2");
    
    var edit_group = $("<div/>").addClass("d-flex flex-fill flex-row mb-2 w-xl-50");
    
    var resource_lock_indicator_group = $("<div/>").addClass("input-group-text me-2 mb-xl-0 mb-2");
    var resource_lock_indicator = $("<div/>").addClass("resource-indicator");
    resource_lock_indicator.append($("<span/>").addClass("bi bi-unlock-fill text-success opacity-0"));
    resource_lock_indicator_group.append(resource_lock_indicator);
    edit_group.append(resource_lock_indicator_group);


    var resource_edit_switch = $("<input/>").addClass("form-check-input").attr("type","checkbox").attr("id","subjectEditSwitch");
    var resource_edit_switch_group = $("<div/>").addClass("form-check form-switch");
    resource_edit_switch_group.append(resource_edit_switch);
    resource_edit_switch_group.append($("<label/>").addClass("form-check-label").attr("for","subjectEditSwitch").html("Edit subject data"));
    edit_group.append($("<div/>").addClass("input-group-text flex-grow-1 flex-xl-fill me-xl-2 mb-xl-0 mb-2").append(resource_edit_switch_group));
    
    toolbar.append(edit_group);


    var refresh_group = $("<div/>").addClass("d-flex flex-fill flex-row mb-2 w-xl-50");

    var refresh_btn = $("<button/>").addClass("btn btn-outline-dark refresh");
    refresh_btn.html($("<i/>").addClass("fa fa-arrows-rotate").attr("aria-hidden","true"));
    refresh_btn.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Refresh data.");
    refresh_group.append($("<div/>").addClass("me-2").append(refresh_btn));

    var auto_refresh_switch = $("<input/>").addClass("form-check-input").attr("type","checkbox").attr("id","autoRefreshSwitch");
    var auto_refresh_switch_group = $("<div/>").addClass("form-check form-switch");
    auto_refresh_switch_group.append(auto_refresh_switch);
    auto_refresh_switch_group.append($("<label/>").addClass("form-check-label").attr("for","autoRefreshSwitch").html("Auto refresh data"));
    refresh_group.append($("<div/>").addClass("flex-grow-1 input-group-text").append(auto_refresh_switch_group)); 

    toolbar.append(refresh_group);

    refresh_btn.on("click",function(){
        refresh_subject();
    })


    container.append(toolbar)
    
    var form = $("<form/>").attr("id","subject_card_form").addClass("needs-validation");
    container.append(form);           
    subject_card_inputs(form);
    init_fields(form,entry);
    var submit_subject_data_btn = $("<button/>").attr("type","submit").addClass("btn btn-outline-dark w-100").html("Update data");
    form.append(submit_subject_data_btn);

    resource_edit_switch.on("change",function(){
        var checked = $(this).prop("checked");
        if(checked){
            $(form).find(".subject-resource").each(function(){$(this).prop("disabled",false)});
            $(submit_subject_data_btn).prop("disabled",false);
            setLock("subjects",[users_current_subject],function(){
                users_update_subject_lock_indicator();
            });
            
        }
        else{
            $(form).find(".subject-resource").each(function(){$(this).prop("disabled",true)});
            $(submit_subject_data_btn).prop("disabled",true);
            releaseLock("subjects",function(){
                users_update_subject_lock_indicator();
            });
        }
    })
    resource_edit_switch.trigger("change");

    auto_refresh_switch.on("change",function(){
        var checked = $(this).prop("checked");
        if(checked){
            users_subject_refresh_interval = setInterval(refresh_subject,5000);
        }
        else{
            if(users_subject_refresh_interval!=null){

                clearInterval(users_subject_refresh_interval);
                users_subject_refresh_interval=null;
            }
        }
    })
    auto_refresh_switch.trigger("change");

    $(form).on("submit",function(e){
        e.preventDefault();

        if(! form[0].checkValidity()){
            form[0].reportValidity();
            return;
        }

        var values = {};
        $.each($(form).serializeArray(), function(i, field) {
            var entries = $(form).find("[name='"+field.name+"'][data-value]");
            if(entries.length>0){
                var _entry = entries[0];
                var data_val = $(_entry).prop("data-value");
                values[field.name] = parse_val(data_val==""?null:data_val);
            }
            else{
                values[field.name] = parse_val(field.value==""?null:field.value);
                // values[field.name] = get_readable_value(form,field.name,field.value);
            }
        });

        checkOwnLock("subjects",entry["SubjectIndex"],
                function(){
                    users_subject_update_ajax(entry["SubjectIndex"],values,function(){
                        // what to do when update is succesful...?
                        resource_edit_switch.prop("checked",false).trigger("change");
                        
                    });
                },
                function(){
                    var message = 'Resource lock has expired or taken.'
                    bootbox.alert(message);
                }
                )
    })



    $(users_subject_card_content).on("lock_change", function(){
        if(users_current_subjects_lock===null){
            // current subject can be edited

            resource_edit_switch.prop("disabled",false);
            auto_refresh_switch.prop("disabled",false);
            refresh_btn.prop("disabled",false);

            if(resource_edit_switch.prop("checked")){
                var message = 'Resource lock has expired or taken.';
                bootbox.alert(message);
                resource_edit_switch.prop("checked",false).trigger("change");
            }

            return;
        }
        if(users_current_subjects_lock == current_user){
            if(resource_edit_switch.prop("checked")==false){
                resource_edit_switch.prop("checked",true).trigger("change");
            }

            // can be released
            resource_edit_switch.prop("disabled",false);

            refresh_btn.prop("disabled",true);
            auto_refresh_switch.prop("disabled",true);

            if(auto_refresh_switch.prop("checked")){
                auto_refresh_switch.prop("checked",true).trigger("change");
            }
        }
        else{
            // cant be edited
            resource_edit_switch.prop("disabled",true);
            auto_refresh_switch.prop("disabled",false);
            refresh_btn.prop("disabled",false);

            if(resource_edit_switch.prop("checked")){
                var message = 'Resource lock has expired or taken.';
                bootbox.alert(message);
                resource_edit_switch.prop("checked",false).trigger("change");
            }
        }
    })

    start_users_subjectlock_timer();
}

function users_events_card(container, subject_info){
    show_users_eventlog_handler(container, subject_info);
    users_event_content = container.find(":first-child");
}

function users_main_tools_view(container, subject_index, title = null, subtitle = null){
    container.empty();

    users_current_subject = subject_index;

    var subject_title = $("<div/>").addClass("d-flex p-2 bg-dark text-white fs-3 mb-3");
    
    container.append(subject_title);
    var main_accordion = $("<div/>").addClass("accordion accordion-flush").attr("id","main_accordion");    
    var subject_card_accordion = $("<div/>").addClass("accordion-item");
    var event_card_accordion = $("<div/>").addClass("accordion-item");
    main_accordion.append(subject_card_accordion);
    main_accordion.append(event_card_accordion);

    users_subject_retrieve_ajax(subject_index,function(result){
        if(result.length==1){
            subject_title.empty();

            var entry = result[0];
            var titles = users_subject_title(entry);     

            if(titles[0]!=null) subject_title.append(titles[0]);
            if(titles[1]!=null) subject_title.append(titles[1]);
            subject_title.append(users_clear_content_btn());

            // subject data handling
            var subject_card_accordion_header = $("<h2/>").addClass("accordion-header").attr("id","subject_card_accordion_header");
            var subject_card_accordion_header_content = $("<button/>").addClass("accordion-button collapsed").attr("type","button").attr("data-bs-toggle","collapse");
            subject_card_accordion_header_content.attr("data-bs-target","#subject_card_accordion_content").attr("aria-expanded","false");
            subject_card_accordion_header_content.html("Subject data");

            subject_card_accordion_header.append(subject_card_accordion_header_content);

            var subject_card_accordion_content_container = $("<div/>").addClass("accordion-collapse collapse");
            subject_card_accordion_content_container.attr("id","subject_card_accordion_content").attr("data-bs-parent","#main_accordion");
            
            subject_card_accordion.append(subject_card_accordion_header);
            subject_card_accordion.append(subject_card_accordion_content_container);
            
            var subject_card_accordion_content = $("<div/>").addClass("accordion-body");
            
            subject_card_accordion_content_container.append(subject_card_accordion_content);

            subject_card_accordion_content_container.on('show.bs.collapse', function () {
                if(users_subject_card_content==null){
                    users_subject_card(subject_card_accordion_content,entry);
                }
                // users_update_subject_lock_indicator();
                start_users_subjectlock_timer();
            });

            subject_card_accordion_content_container.on('hide.bs.collapse', function () {
                stop_users_subjectlock_timer();
            });

            // subject data resource status bar
            
            
            // subject's events handling

            var event_card_accordion_header = $("<h2/>").addClass("accordion-header").attr("id","event_card_accordion_header");
            var event_card_accordion_header_content = $("<button/>").addClass("accordion-button collapsed").attr("type","button").attr("data-bs-toggle","collapse");
            event_card_accordion_header_content.attr("data-bs-target","#event_card_accordion_content").attr("aria-expanded","false");
            event_card_accordion_header_content.html("Event list");

            event_card_accordion_header.append(event_card_accordion_header_content);

            var event_card_accordion_content_container = $("<div/>").addClass("accordion-collapse collapse");
            event_card_accordion_content_container.attr("id","event_card_accordion_content").attr("data-bs-parent","#main_accordion");
            
            event_card_accordion.append(event_card_accordion_header);
            event_card_accordion.append(event_card_accordion_content_container);
            
            var event_card_accordion_content = $("<div/>").addClass("accordion-body");
            
            event_card_accordion_content_container.append(event_card_accordion_content);

            event_card_accordion_content_container.on('show.bs.collapse', function () {
                if(users_event_content==null){
                    users_events_card(event_card_accordion_content,entry);
                }
                start_users_eventlog_lock_timer();
            });
            
            subject_card_accordion_content_container.on('hide.bs.collapse', function () {
                stop_users_eventlog_lock_timer();

            });

            container.append(main_accordion);
        }
        else{
            subject_title.empty();
            users_subject_card_content = null;

            if(title!=null) subject_title.append(title);
            if(subtitle!=null) subject_title.append(subtitle);
            subject_title.append(users_clear_content_btn());

            stop_users_subjectlock_timer();
        }
    },
    function(){
        init_users_main_tool(container);
            // unable to load subject ...
    });

}

function show_users_main_tool(container){
    container.empty();
    init_users_main_tool(container);
    
    var target_subject = statusFromUrl("subjectIndex");
    var target_event = statusFromUrl("eventIndex");

    if(target_subject!=null){
        $(users_main_tool_content).prop("hidden",false);
        users_main_tools_view(users_main_tool_content,target_subject);
    }

}

