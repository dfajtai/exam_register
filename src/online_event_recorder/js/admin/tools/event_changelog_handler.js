var event_changelog_table_id = "event_changelog_table";
var event_changelog_content = {};
// var event_changelog_content_name = "";
// var event_changelog_lock_list = [];

var event_changelog_visible_subjects = null;
var event_changelog_visible_subjects_info = null;
var event_changelog_subject_string_lookup = {};

var event_changelog_visible_event_indices = [];

var event_changelog_final_status_lookup = {};
var event_changelog_status_history_lookup = {};


function event_changelog_retrieve_all_ajax(params) {
    // console.log("retrieve all subj: "+ JSON.stringify(params));
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "event_change_log"}),
    success: function (result) {
        event_changelog_visible_event_indices = getColUnique(result,"EventIndex");
        update_event_changelog_final_status(function(){
            params.success({"rows":result, "total":result.length});
        })
    },
    error: function (er) {
        event_changelog_visible_event_indices = [];
        update_event_changelog_final_status(function(){
            params.error(er);
        })
    }});
}


function event_changelog_retrieve_subjects_ajax(params) {
    // console.log("retrieve some subj: "+ JSON.stringify(params));
    $.ajax({
    type: "GET",
    url: 'php/retrieve_subject_event_changes.php',
    dataType: "json",
    data: ({subject_index: params.data.indices}),
    success: function (result) { 
        event_changelog_visible_event_indices = getColUnique(result,"EventIndex");
        update_event_changelog_final_status(function(){
            params.success({"rows":result, "total":result.length});
        })
       },
    error: function (er) {
        event_changelog_visible_event_indices = [];
        update_event_changelog_final_status(function(){
            params.error(er);
        })
    }
    });
}

function event_changelog_retrieve_event_by_index_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table_where.php',
    dataType: "json",
    data: ({table_name: "event_change_log","where":{"EventIndex":params.data.event_index}}),
    success: function (result) {
        event_changelog_visible_event_indices = getColUnique(result,"EventIndex");
        update_event_changelog_final_status(function(){
            params.success({"rows":result, "total":result.length});
        })            
    },
    error: function (er) {
        params.error(er);
        event_changelog_visible_event_indices = [];
        update_event_changelog_final_status(function(){
            params.error(er);
        })
        }
    });
}

function event_changelog_revert_ajax(event_index, event_info, callback = null) {
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

function update_event_changelog_status_list(data, callback = null){
    if(event_changelog_visible_event_indices.length==0) return;
    
    event_changelog_status_history_lookup = {};
    $.each(event_changelog_visible_event_indices,function(index,event_index){
        var events = getEntriesWhere(data,"EventIndex",event_index); // list of event changes corresponding to a given event index
        $.each(events,function(index,entry){
            // events[index]["EventData"] = JSON.parse(events[index]["EventData"]);
            // events[index]["EventData"]["EventData"] = JSON.parse(events[index]["EventData"]["EventData"]);
            events[index] = event_changelog_entry_to_event_log_format(entry);
        })
        events.sort((a, b) => {
            return a.Event_changelogIndex - b.Event_changelogIndex;
        });

        var order = getCol(events,"Event_changelogIndex"); // order of event changes
        var index_object = {};  // ordered index of the event change
        $.each(order,function(index,entry){
            index_object[entry] = index;
        })
        var event_list = {event_info_list:events, order:order, index:index_object, 
            final_status: event_changelog_final_status_lookup[event_index]};
        event_changelog_status_history_lookup[event_index] = event_list;
    })
    console.log(event_changelog_status_history_lookup);

}

function event_changelog_entry_to_event_log_format(entry){   
    if(!isObject(entry)) return entry;
    var data_tag = entry["EventData"];

    var event_data = null;


    if(isString(data_tag)){
        data_tag=JSON.parse(data_tag);
        event_data = JSON.parse(data_tag["EventData"]);
    }
    else{
        event_data = data_tag["EventData"];
        if(isString(event_data)) event_data = JSON.parse(event_data);
    }


    var alike_object = {
        "EventID": data_tag["EventID"],
        "EventSubject": entry["EventSubject"],
        "EventStudy": entry["EventStudy"],
        "EventName": entry["EventName"],
        "EventLocation": data_tag["EventLocation"],
        "EventComment": data_tag["EventComment"],
        "EventStatus": data_tag["EventStatus"],
        "EventPlannedTime": data_tag["EventPlannedTime"],

        // auxillary
        "EventModifiedBy": data_tag["EventModifiedBy"],
        "EventModifiedAt": data_tag["EventModifiedAt"],

        "EventData": event_data
    };

    return alike_object;

}

function update_event_changelog_final_status(callback = null){
    // console.log(event_changelog_visible_event_indices);
    if(event_changelog_visible_event_indices.length==0){
        if(callback !== null){
            callback();
        }
    }

    event_changelog_final_status_lookup = {};
    $.ajax({
        type: "GET",
        url: 'php/retrieve_table_where.php',
        dataType: "json",
        data: ({table_name: "event_log","where":{"EventIndex":event_changelog_visible_event_indices}}),
        success: function (result) {
            $.each(result,function(index,entry){
                var event_index = entry["EventIndex"];
                delete entry["EventIndex"];
                entry["EventData"] = JSON.parse(entry["EventData"]);
                event_changelog_final_status_lookup[event_index] = entry;
            });

            // console.log(event_changelog_final_status_lookup);
            if(callback !== null){
                callback();
            }
            
        }
    }) 

}


function event_changelog_subjectFormatter(value,row){
    if(value==null) return;
    var res = null;
    if(event_changelog_visible_subjects.length==0) return res;

    if(event_changelog_visible_subjects.includes(value)){
        return event_changelog_subject_string_lookup[value];
    }
    return res;
}


function event_changelog_subjectFormatter(value,row){
    if(value==null) return;
    var res = null;

    if(event_changelog_visible_subjects == null){
        return 'Not resolved';
    }
    if(event_changelog_visible_subjects.length==0) return res;

    if(event_changelog_visible_subjects.includes(value)){
        return event_changelog_subject_string_lookup[value];
    }
    return res;
}


function event_changelog_template_formatter(value,row){
    var row_data = null;
    var res = null;
    try {
        row_data = JSON.parse(row["EventData"]);
        var old_event_id = row_data["EventID"];
        return eventFormatter(old_event_id,row);

    } catch (error) {
        
    }

    return res;
}

function event_changelog_status_formatter(value,row){
    var row_data = null;
    var res = null;
    try {
        row_data = JSON.parse(row["EventData"]);
        var old_event_status = row_data["EventStatus"];
        return eventStatusFormatter(old_event_status,row);

    } catch (error) {
        
    }

    return res;
}

function event_changelog_operate_formatter(value, row, index) {
    var container = $("<div/>").addClass("lockable");
    var container = $("<div/>").addClass("lockable");

    var revert_btn = $("<button/>").addClass("btn btn-outline-primary btn-sm edit lockable me-1").append($("<i/>").addClass("fa fa-clock-rotate-left"))
    revert_btn.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Evert to stage");
    container.append(revert_btn);

    return container.prop("outerHTML");
}


window.event_changelog_operate_events = {
    'click .revert': function (e, value, row, index) {
        alert("revert not iplemented");
    },
}


function event_changelog_old_event_data_formatter(value,row){
    var event_info = JSON.parse(row["EventData"]);
    var old_data = event_info["EventData"];

    var old_data_string = jsonFormatter(old_data,null);
    return old_data_string;
}

function event_changelog_old_event_info_formatter(value,row){
    var event_info = JSON.parse(row["EventData"]);
    delete event_info["EventData"];

    var old_info_string = jsonFormatter(event_info,null);
    return old_info_string;
}

function event_changelog_last_event_data_formatter(value,row){
    var event_index = row["EventIndex"];
    if(event_changelog_final_status_lookup.hasOwnProperty(event_index)){
        var final_data = event_changelog_final_status_lookup[event_index]["EventData"];
    
        var final_data_string = jsonFormatter(final_data,null);
        return final_data_string;
    }
    return;

}

function event_changelog_last_event_info_formatter(value,row){
    var event_index = row["EventIndex"];
    if(event_changelog_final_status_lookup.hasOwnProperty(event_index)){
        var final_info = {... event_changelog_final_status_lookup[event_index]};
        delete final_info["EventData"];

        var final_data_string = jsonFormatter(final_info,null);
        return final_data_string;
    }
    return;
}


function event_changelog_last_detail_view_formatter(index,row){
    var event_index = row["EventIndex"];
    var old_status = {};
    var final_status = {};

    var old_info = JSON.parse(row["EventData"]);    
    var old_data = JSON.parse(old_info["EventData"]);
    delete old_info["EventData"];

    console.log(row);
    console.log(old_info);
    console.log(old_data);

    if(event_changelog_final_status_lookup.hasOwnProperty(event_index)){
        var final_info = {... event_changelog_final_status_lookup[event_index]};
        var final_data = JSON.parse(final_info["EventData"]);
        delete final_info["EventData"];

        console.log(final_info);
        console.log(final_data);
    }
    return;
}


function event_changelog_query_params(params){
    params.indices = event_changelog_visible_subjects;
    return params
}

function create_event_changelog_table(container, table_id, simplify = false, event_index = null){
    var table = $("<table/>").attr("id",table_id);

    var toolbar = $("<div/>").attr("id",table_id+"_toolbar");

    var subject_selector_container = $("<div/>");
    
    if(event_index==null){
        subjectSelectWidget(subject_selector_container,"all",
        function(subject_indices,subject_info){
            // console.log(subject_indices);
            // console.log(subject_info);

            event_changelog_visible_subjects_info = subject_info;

            if(event_changelog_visible_subjects_info.length>0){
                $(toolbar).empty();

                var _filter_group = $("<div/>").addClass("input-group h-100");
                var event_filter = $("<input/>").attr("id","event_filter").addClass("form-control");
                _filter_group.append($("<label/>").addClass("input-group-text").attr("for","event_filter").html("Filter by EventIndex"));
                _filter_group.append(event_filter);
                _filter_group.append($("<button/>").addClass("btn btn-outline-secondary").attr("id","clear").attr("type","button").append($("<i/>").addClass("fa fa-solid fa-x")).attr("type","text"));
                toolbar.append($("<div/>").append(_filter_group));


                event_filter.on("change",function(){
                    console.log("filter changed");
                    var event_filter_text = parse_val($(this).val());
                    if(event_filter_text==null){
                        table.bootstrapTable("resetSearch");
                        table.bootstrapTable("refreshOptions",{"filterOptions": {'filterAlgorithm':function(){return true}}});
                        table.bootstrapTable("filterBy",{});
                    }
                    else{
                        table.bootstrapTable("resetSearch");
                        table.bootstrapTable("refreshOptions",{"filterOptions": {'filterAlgorithm':function(row,filters){
                            return row["EventIndex"]==event_filter_text;
                        }}});
                        table.bootstrapTable("filterBy",{});
                    }
                })
                _filter_group.find("#clear").on("click",function(){
                    toolbar.find("#event_filter").val(null).trigger("change");
                })
            }
            else{
                $(toolbar).empty();
            }

            var event_filter_text = parse_val($(event_filter).val());
            var options = {};
            if(event_filter_text == null){
                options["filterOptions"] = {'filterAlgorithm':function(){return true}};
            }
            else{
                options["filterOptions"] = {'filterAlgorithm':function(row,filters){
                    return row["EventIndex"]==event_filter_text;
                }};
            }


            if(subject_indices=="all"){
                event_changelog_visible_subjects = getCol(subject_info,"SubjectIndex");
                options["queryParams"] = function(params) { return params };
                options["ajax"] = event_changelog_retrieve_all_ajax;
            }
            else{
                event_changelog_visible_subjects = subject_indices;
                options["queryParams"] = event_changelog_query_params;
                options["ajax"] = event_changelog_retrieve_subjects_ajax;
            }

            table.bootstrapTable('refreshOptions',options);
            table.bootstrapTable("filterBy",{});

            event_changelog_subject_string_lookup = {};
            $.each(event_changelog_visible_subjects_info,function(index,val){
                event_changelog_subject_string_lookup[val.SubjectIndex] = val.Name + " [" + val.SubjectID + "]";
            });
        });
        container.append(subject_selector_container);
    }    

    table.attr("data-toolbar","#"+table_id+"_toolbar");
    table.attr("data-toolbar-align","left");

    // table.attr("data-cache","false");

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
                {field : 'state', checkbox: true, align:'center', forceHide:true},
                {title: '', field: 'operate', align: 'center', sortable:false, searchable:false, clickToSelect : false,
                events: window.event_changelog_operate_events, formatter: event_changelog_operate_formatter, forceHide:true},
                {title: '#', field : 'Event_changelogIndex', align:'center', sortable:true, searchable:false, visible:false, forceHide: true},
                {title: 'ModifiedAt', field : 'EventModifiedAt', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "datetimeFormatter",visible:true},
                {title: 'EventIndex', field : 'EventIndex', align:'center', sortable:true, searchable:false, visible:true, forceExport: true},
                {title: 'Subject', field : 'EventSubject', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "event_changelog_subjectFormatter"},
                {title: 'Study', field : 'EventStudy', align:'center', sortable:true, searchable:true, formatter: "studyFormatter", forceExport: true},
                {title: 'Event Template', field : 'EventTemplate', align:'center', sortable:true, searchable:true, visible:true, forceExport: true, formatter:"event_changelog_template_formatter"},
                {title: 'Event Status', field : 'EventStatus', align:'center', sortable:true, searchable:true, visible:true, forceExport: true, formatter:"event_changelog_status_formatter"},

                {title: 'Event Name', field : 'EventName', align:'center', sortable:true, searchable:true,forceExport: true},

                {title: 'ModifiedBy', field : 'EventModifiedBy', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "userFormatter",visible:false},

                {title: 'Old Info', field : 'OldEventInfo', align:'center', sortable:false, searchable:false, forceExport: true, formatter: "event_changelog_old_event_info_formatter", visible:false},
                {title: 'Last Info', field : 'LastEventInfo', align:'center', sortable:false, searchable:false, forceExport: true, formatter: "event_changelog_last_event_info_formatter", visible:false},
                {title: 'Old Data', field : 'OldEventData', align:'center', sortable:false, searchable:false, forceExport: true, formatter: "event_changelog_old_event_data_formatter", visible:false},
                {title: 'Last Data', field : 'LastEventData', align:'center', sortable:false, searchable:false, forceExport: true, formatter: "event_changelog_last_event_data_formatter", visible:false},

              ],

            pagination:true,
            checkboxHeader:true,
            smartDisplay:true,
            detailFormatter: event_changelog_last_detail_view_formatter,

            idField:"Event_changelogIndex",

            showExport:!simplify,
            exportTypes: ['csv','json','excel','doc','txt','sql','xml',"pdf"],
            exportDataType: 'all'
        });

    if(event_index!=null){
        table.bootstrapTable('refreshOptions', {    queryParams:function(params){
            params.event_index=event_index;
            params.callback = function(res){
                if(res.length>0){
                    var call_refresh = event_changelog_visible_subjects == null;

                    var subject_indices = getColUnique(res,"EventSubject");
                    event_changelog_visible_subjects = subject_indices;

                    $.ajax({
                        type: "GET",
                        url: 'php/retrieve_subject_info.php',
                        dataType: "json",
                        data: ({subject_index: event_changelog_visible_subjects}),
                        success: function (result) {
                            event_changelog_visible_subjects_info = result;
                            event_changelog_subject_string_lookup = {};
                            $.each(event_changelog_visible_subjects_info,function(index,val){
                                event_changelog_subject_string_lookup[val.SubjectIndex] = val.Name + " [" + val.SubjectID + "]";
                            });

                            if(call_refresh){
                                table.bootstrapTable("resetView");
                                table.bootstrapTable("refresh");
                            }
                        },
                    });
                }
            }
            return params
        }, 
        ajax: event_changelog_retrieve_event_by_index_ajax});

        
    }

}


function event_changelog_subject_select_from_pool(container, subject_pool, subject_index = null){
    var subject_select =  $("<div/>").addClass("row mb-2").attr("id","event_changelog_subject_input_block");

    var subject_label =  $("<label/>").addClass("col-md-3 col-form-label").html("Subject");
    var subject_select_dropdow = $("<select/>").addClass("form-select").attr("type","text").attr("id","subjectSelect").attr("name","EventSubject");
    subject_select_dropdow.prop('required',true).addClass("data-required border border-2 border-dark").attr("data-name","EventSubject");

    $.each(subject_pool,function(index,entry){
        if(!entry.hasOwnProperty("SubjectIndex")) return;
        let subject_index = entry["SubjectIndex"];
        subject_select_dropdow.append($("<option/>").html(event_changelog_subject_string_lookup[subject_index]).attr("value",subject_index));
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


function show_event_changelog_handler(container){

    create_event_changelog_table(container,event_changelog_table_id);

    var table = $('#'+event_changelog_table_id);

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

    table.on('load-success.bs.table',function(status,data){
        if(data.total>0) update_event_changelog_status_list(data["rows"]);
    })

    // table.on('all.bs.table',function(args,name){
    //     console.log(name)
    // })


    var toolbar = container.find(".fixed-table-toolbar");

    event_changelog_content = $("<div/>").attr("id","event_changelogModalContainer");
    container.append(event_changelog_content);

    toolbar.find(".needs-select").addClass("disabled");

}