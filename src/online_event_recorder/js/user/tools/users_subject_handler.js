var active_subject_locks_user = [];
var active_subject_lock_info_user = {};

var subjects_lock_interval_user = null;

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

    showCustomArgs(container,params);

    // var disabled_fields = ["SubjectID","StudyID"];
    // $.each(disabled_fields,function(index,field_name){
    //     $.each(container.find("[name='" + field_name + "']"),function(_index,field){
    //         $(field).addClass("user-cant-edit");
    //     })
    // })
}



function init_users_subject_handler(container){

    container.empty();

    var subject_handler_toolbar = $("<div/>").addClass("row col-md-12").attr("id","subject_handler_toolbar");
    var subject_search_tool_btn = $("<button/>").addClass("btn btn-outline-dark").html("Search");
    subject_search_tool_btn.attr("data-bs-toggle","collapse").attr("data-bs-target","#search_collapse");
    subject_handler_toolbar.append($("<div/>").addClass("col-md-3").append(subject_search_tool_btn.addClass("w-100")));
    

    var search_collapse = $("<div/>").addClass("collapse").attr("id","search_collapse");
    var search_collapse_card = $("<div/>").addClass("card card-body");
    var search_collapse_card_content = $("<div/>");

    search_collapse.append(search_collapse_card.append(search_collapse_card_content));
    subject_handler_toolbar.append(search_collapse);


    subject_handler_content = $("<div/>").addClass("subject-handler-content").addClass("container shadow px-2 py-2 my-2 mx-2");;

    container.append(subject_handler_toolbar);
    container.append(subject_handler_content);

    subjectSelectWidget(search_collapse_card_content,
                        statusFromStorage("activeStudy"),
                        function(new_indices,new_info){
                            if(new_indices.length>0){
                                let name = new_info[0].Name;
                                let id = new_info[0].SubjectID;
                                let index = new_info[0].SubjectIndex;
                                if(name==null){
                                    var title = $("<div/>").html("Subject " + id);
                                    var subtitle = $("<div/>").html("<small><i>nr."+index+"</i></small>");
                                }else{
                                    var title = $("<div/>").html("Subject "+name +" ["+ id+"]");
                                    var subtitle = $("<div/>").html("<small><i>nr."+index+"</i></small>");
                                }
                                users_subject_handler_view_subject($(subject_handler_content),new_indices[0],title,subtitle);

                                statusToUrl("subjectIndex",index);
                                $(search_collapse).toggle(false);
                            }
                        },
                        true
    )
}


function users_subject_handler_view_subject(container, subject_index, title, subtitle){
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
    }

    container.empty();
    var subject_card_title = $("<div/>").addClass("d-flex justify-content-between p-2 bg-dark text-white fs-3 mb-3");
    subject_card_title.append(title).append(subtitle);
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
                var entry = result[0];                

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

                var form = $("<form/>").attr("id","subject_card_form").addClass("needs-validation");
                subject_card_accordion_content.append(form);                
                subject_card_inputs(form);
                init_fields(form,entry);
                
                container.append(main_accordion);
            }
        },
        error: function(er){
            init_subject_handler(container);
            // unable to load subject ...
        }
    });
}

function show_users_subject_handler_tool(container){
    container.empty();

    init_users_subject_handler(container);
    
}

