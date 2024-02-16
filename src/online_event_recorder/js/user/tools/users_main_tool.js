var active_subject_locks_user = [];
var active_subject_lock_info_user = {};

var users_main_tool_content = null;


function users_update_subject_locks(callback){
    getLocks("subjects",function(locked_indices,locks){
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

        if(!isEqual(locked_indices,active_subject_locks)){
            active_subject_locks_user = locked_indices;
            active_subject_lock_info_user = resource_lock_info;
        }
    })
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

    })
    return $("<div/>").addClass("ms-3").append(clear_btn);
}



function init_users_main_tool(container){
    container.empty();

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

    subjectSelectWidget(search_collapse_card_content,
        statusFromStorage("activeStudy"),
        function(new_indices,new_info){
            if(new_indices.length>0){
                var titles = users_subject_title(new_info[0]);
                $(users_main_tool_content).prop("hidden",false);
                users_subject_view($(users_main_tool_content),new_indices[0],titles[0],titles[1]);
                var index = new_info[0].SubjectIndex;
                statusToUrl("subjectIndex",index);
                setTimeout(function(){
                    bs_search_collapse.toggle();
                },500)
            }
        },
        true
    )

    subject_handler_toolbar.append(subject_search_tool_btn);

    // subject select from pool

    var subject_select_tool_btn = $("<button/>").addClass("btn btn-outline-dark px-5 flex-lg-fill mb-1 mb-lg-0").html("Select subject");
    subject_select_tool_btn.attr("data-bs-toggle","collapse").attr("data-bs-target","#select_collapse");

    var select_collapse = $("<div/>").addClass("collapse").attr("id","select_collapse");
    var select_collapse_card = $("<div/>").addClass("card card-body");
    var select_collapse_card_content = $("<div/>");

    select_collapse.append(select_collapse_card.append(select_collapse_card_content));


    subject_handler_toolbar.append(subject_select_tool_btn);
    
    users_main_tool_content = $("<div/>").addClass("subject-handler-content").addClass("container shadow px-2 py-2").attr("hidden","true");

    container.append(subject_handler_toolbar);
    container.append(search_collapse);
    container.append(users_main_tool_content);

}



function users_subject_view(container, subject_index, title = null, subtitle = null){
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

    container.empty();
    var subject_card_title = $("<div/>").addClass("d-flex p-2 bg-dark text-white fs-3 mb-3");
    
    container.append(subject_card_title);
    var main_accordion = $("<div/>").addClass("accordion").attr("id","main_accordion");    
    var subject_card_accordion = $("<div/>").addClass("accordion-item");
    main_accordion.append(subject_card_accordion);


    $.ajax({
        type: "GET",
        url: 'php/retrieve_table_where.php',
        dataType: "json",
        data: ({table_name:"subjects",where:{"SubjectIndex": subject_index}}),
        success: function (result) {
            if(result.length==1){
                subject_card_title.empty();

                var entry = result[0];
                var titles = users_subject_title(entry);     

                if(titles[0]!=null) subject_card_title.append(titles[0]);
                if(titles[1]!=null) subject_card_title.append(titles[1]);
                subject_card_title.append(users_clear_content_btn());

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

                // subject data resource status bar

                var subject_card_accordion_toolbar = $("<div/>").addClass("d-flex flex-column flex-lg-row mb-2");
                var resource_lock_indicator_group = $("<div/>").addClass("input-group-text flex-lg-fill me-lg-2 mb-lg-0 mb-2").append($("<div/>").append("Write protection"));
                var resource_lock_indicator = $("<div/>").addClass("ms-3");
                resource_lock_indicator_group.append(resource_lock_indicator)
                subject_card_accordion_toolbar.append(resource_lock_indicator_group);

                var resource_edit_switch = $("<input/>").addClass("form-check-input").attr("type","checkbox").attr("id","subjectEditSwitch");
                var resource_edit_switch_group = $("<div/>").addClass("form-check form-switch");
                resource_edit_switch_group.append(resource_edit_switch);
                resource_edit_switch_group.append($("<label/>").addClass("form-check-label").attr("for","subjectEditSwitch").html("Edit subject data"));
                subject_card_accordion_toolbar.append($("<div/>").addClass("input-group-text flex-lg-fill").append(resource_edit_switch_group));               

                subject_card_accordion_content.append(subject_card_accordion_toolbar)
               
                var form = $("<form/>").attr("id","subject_card_form").addClass("needs-validation");
                subject_card_accordion_content.append(form);           
                subject_card_inputs(form);
                init_fields(form,entry);
                var submit_subject_data_btn = $("<button/>").attr("type","submit").addClass("btn btn-outline-dark w-100").html("Update data");
                form.append(submit_subject_data_btn);
                
                resource_edit_switch.on("change",function(){
                    var checked = $(this).prop("checked");
                    if(checked){
                        $(form).find(".subject-resource").each(function(){$(this).prop("disabled",false)});
                        $(submit_subject_data_btn).prop("disabled",false);
                    }
                    else{
                        $(form).find(".subject-resource").each(function(){$(this).prop("disabled",true)});
                        $(submit_subject_data_btn).prop("disabled",true);
                    }
                })
                resource_edit_switch.trigger("change");

                container.append(main_accordion);
            }
            else{
                subject_card_title.empty();
                if(title!=null) subject_card_title.append(title);
                if(subtitle!=null) subject_card_title.append(subtitle);
                subject_card_title.append(users_clear_content_btn());
            }
        },
        error: function(er){
            init_users_main_tool(container);
            // unable to load subject ...
        }
    });
}

function show_users_main_tool(container){
    container.empty();
    init_users_main_tool(container);
    
    var target_subject = statusFromUrl("subjectIndex");
    var target_event = statusFromUrl("eventIndex");

    if(target_subject!=null){
        $(users_main_tool_content).prop("hidden",false);
        users_subject_view(users_main_tool_content,target_subject);
    }

}

