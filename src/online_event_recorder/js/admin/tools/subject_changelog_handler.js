var subject_changelog_table_id = "subject_changelog_table";
var subject_changelog_content = {};
// var subject_changelog_content_name = "";
// var subject_changelog_lock_list = [];

var subject_changelog_visible_subject_indices = [];

var subject_changelog_final_status_lookup = {};
var subject_changelog_status_history_lookup = {};


function subject_changelog_retrieve_all_ajax(params) {
    // console.log("retrieve all subj: "+ JSON.stringify(params));
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "subject_change_log"}),
    success: function (result) {
        subject_changelog_visible_subject_indices = getColUnique(result,"SubjectIndex");
        update_subject_changelog_final_status(function(){
            params.success({"rows":result, "total":result.length});
        })
    },
    error: function (er) {
        subject_changelog_visible_subject_indices = [];
        update_subject_changelog_final_status(function(){
            params.error(er);
        })
    }});
}


function subject_changelog_retrieve_subjects_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_subject_changes.php',
    dataType: "json",
    data: ({subject_index: params.data.indices}),
    success: function (result) {
        subject_changelog_visible_subject_indices = getColUnique(result,"SubjectIndex");
        update_subject_changelog_final_status(function(){
            params.success({"rows":result, "total":result.length});
        })            
    },
    error: function (er) {
        params.error(er);
        subject_changelog_visible_subject_indices = [];
        update_subject_changelog_final_status(function(){
            params.error(er);
        })
        }
    });
}


function subject_changelog_entry_to_subject_format(entry){   
    if(!isObject(entry)) return entry;
    var data_tag = entry["SubjectData"];

    if(isString(data_tag)){
        data_tag=JSON.parse(data_tag);
    }


    var alike_object = {
        "SubjectID": data_tag["SubjectID"],
        "StudyID": data_tag["StudyID"],
        "Name": data_tag["Name"],
        "Group": data_tag["Group"],
        "Age": data_tag["Age"],
        "Sex": data_tag["Sex"],
        "Container": data_tag["Container"],
        "Weight": data_tag["Weight"],
        "Height": data_tag["Height"],
        "Location": data_tag["Location"],
        "Status": data_tag["Status"],

        // auxillary
        "ModifiedBy": data_tag["ModifiedBy"],
        "LastChange": data_tag["Timestamp"],

        // backward compatibility
        "SubjectChangeLogIndex" : entry["SubjectChangeLogIndex"],

    };

    return alike_object;

}


function subject_changelog_alike_formatter(alike_object){
    if(!isObject(alike_object)){
        return alike_object;
    }

    function format_value(value,col){
        switch (col) {
            case "StudyID":
                return studyFormatter(value,null);
                break;
            case "Sex":
                return sexFormatter(value,null);
                break;            
            case "Location":
                return locationFormatter(value,null);
                break;
            case "Status":
                return subjectStatusFormatter(value,null);
                break;            
            case "ModifiedBy":
                return userFormatter(value,null);
                break;            
        
            default:
                return value;
                break;
        }
    }

    var res  = {};
    $.each(alike_object,function(key,value){
        res[key] = format_value(value,key);
    })

    return res;
}

function update_subject_changelog_final_status(callback = null){
    // console.log(subject_changelog_visible_subject_indices);
    if(subject_changelog_visible_subject_indices.length==0){
        if(callback !== null){
            callback();
        }
    }

    subject_changelog_final_status_lookup = {};
    $.ajax({
        type: "GET",
        url: 'php/retrieve_table_where.php',
        dataType: "json",
        data: ({table_name: "subjects","where":{"SubjectIndex":subject_changelog_visible_subject_indices}}),
        success: function (result) {
            $.each(result,function(index,entry){
                var subject_index = entry["SubjectIndex"];
                delete entry["SubjectIndex"];
                subject_changelog_final_status_lookup[subject_index] = entry;
            });

            // console.log(subject_changelog_final_status_lookup);
            if(callback !== null){
                callback();
            }
            
        }
    }) 

}

function update_subject_changelog_status_list(data, callback = null){
    if(subject_changelog_visible_subject_indices.length==0) return;
    
    subject_changelog_status_history_lookup = {};
    $.each(subject_changelog_visible_subject_indices,function(index,subject_index){
        var _subjects = getEntriesWhere(data,"SubjectIndex",subject_index); // list of event changes corresponding to a given subject index
        $.each(_subjects,function(index,entry){
            _subjects[index] = subject_changelog_entry_to_subject_format(entry);
        })

        _subjects.sort((a, b) => {
            return a.SubjectChangeLogIndex - b.SubjectChangeLogIndex;
        });

        var order = getCol(_subjects,"SubjectChangeLogIndex"); // order of event changes
        var index_object = {};  // ordered index of the event change
        $.each(order,function(index,entry){
            index_object[entry] = index;
        })
        var subject_list = {"subject_info_list":_subjects, "order":order, "lookup":index_object, 
            "final_status": subject_changelog_final_status_lookup[subject_index]};
        subject_changelog_status_history_lookup[subject_index] = subject_list;
    })
}


function subject_changelog_get_versions(subject_index, subject_changelog_index){
    var pre_status = {};
    var this_status = {};
    var next_status = {};
    var final_status = {};

    if(!subject_changelog_status_history_lookup.hasOwnProperty(subject_index)){
        return {"pre_status":pre_status, "this_status":this_status, "next_status":next_status, "final_status":final_status}
    }

    var history = subject_changelog_status_history_lookup[subject_index];

    var order = history["order"];
    var lookup = history["lookup"];

    var status_index = lookup[subject_changelog_index];

    var pre_index = status_index>0 ? (status_index-1) : null;
    var next_index = status_index==order.length-1 ? null : (status_index+1);

    final_status = history["final_status"];
    pre_status = pre_index== null ? {} : history["subject_info_list"][pre_index];
    this_status = history["subject_info_list"][status_index];
    next_status = next_index== null ? history["final_status"] : history["subject_info_list"][next_index];

    var res = {"pre_status":pre_status, "this_status":this_status, "next_status":next_status, "final_status":final_status};

    // console.log(res);

    return res 
}



function subject_changelog_status_formatter(value,row){
    var row_data = null;
    var res = null;
    try {
        row_data = JSON.parse(row["SubjectData"]);
        var old_event_status = row_data["Status"];
        return eventStatusFormatter(old_event_status,row);

    } catch (error) {
        
    }

    return res;
}

function subject_changelog_operate_formatter(value, row, index) {
    var container = $("<div/>").addClass("lockable");
    var container = $("<div/>").addClass("lockable");

    var revert_btn = $("<button/>").addClass("btn btn-outline-primary btn-sm revert lockable me-1").append($("<i/>").addClass("fa fa-clock-rotate-left"))
    revert_btn.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Revert event to this version.");
    container.append(revert_btn);

    return container.prop("outerHTML");
}


window.subject_changelog_operate_events = {
    'click .revert': function (e, value, row, index) {

        var subject_index = row["SubjectIndex"];
        var subject_changelog_index = row["SubjectChangeLogIndex"];
    
        var versions = subject_changelog_get_versions(subject_index,subject_changelog_index);
        var this_version = subject_changelog_alike_formatter(versions.this_status);
        var final_version = subject_changelog_alike_formatter(versions.final_status);      
            
        var keys = _.without(Object.keys(final_version),"LastChange","ModifiedBy");

        var names = ["Parameter", "Actual 'Final' version", "New version"];
        var version_list = [final_version, this_version];

        var table = $("<table/>").addClass("w-100 table table-sm table-striped table-bordered border-secondary").attr("id","event_version_"+subject_changelog_index+"_table");
    
        var header_row = $("<tr/>");
        $.each(names,function(name_index,name){
            header_row.append($("<th/>").html(name).attr("scope","col").addClass("text-center"));
        })
        table.append($("<thead/>").addClass("table-dark").append(header_row));

        var change_count = 0;

        var table_body = $("<tbody/>");
        $.each(keys,function(key_index,key){
            var row = $("<tr/>");
            row.append($("<th/>").html(key).attr("scope","row").addClass("align-middle"));

            var _old = nullify_obj(final_version[key]);
            if(!isObject(_old)) _old = parse_val(_old);

            var _new = nullify_obj(this_version[key]);
            if(!isObject(_new)) _new = parse_val(_new);

            var is_changed = !isEqual(_old,_new);
            // console.log(_old + " -> " + _new + " ==> " + is_changed)
            

            $.each(version_list,function(_index,version){
                if(version==null){
                    row.append($("<td/>").html("-"));
                }
                else{
                    var version_val = nullify_obj(version[key]);
                    if(!isObject(version_val)){
                        var _val = parse_val(version_val);
                        row.append($("<td/>").html(_val == null ? "-":_val).addClass("align-middle"));
                    }
                    else{
                        var cell_data = $("<div/>");
                        $.each(version_val,function(_key,_val){
                            cell_data.append($("<b/>").append(_key))
                            cell_data.append("&emsp;"+_val + "<br/>");
                        })
                        row.append($("<td/>").append(cell_data));
                    }
                }    
            })
            
            if(is_changed){
                // row.css({'color':'red'});
                // row.children().css({'color':'red'});

                row.addClass('bg-danger bg-gradient');
                row.children().addClass('bg-danger bg-gradient');
                change_count+=1;
            }

            table_body.append(row);
        })

        table.append(table_body);
        var message = "";
        if(change_count>0){
            var message = "You are going to revert the selected subject to its '" + this_version["LastChange"] +"' status.<br/><br/>";
            message+= "Please confirm the planned changes!<br/><br/>";
            message+=$(table).prop("outerHTML");

            bootbox.confirm({
                size:'large',
                message: message +'<br/>Do you want to proceed?',
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
                        var subject_data = versions.this_status;
    
                        delete subject_data.SubjectChangeLogIndex;
                        delete subject_data.LastChange;
                        delete subject_data.ModifiedBy;
    
                        delete subject_data.SubjectIndex;
                        
                        var formatted_subject_data = {};
                        $.each(subject_data,function(key,value){
                            value = nullify_obj(value);
                            formatted_subject_data[key] = parse_val(value);
                        })
    
    
                        subject_update_ajax(subject_index,formatted_subject_data,function(){
                            $("#"+subject_changelog_table_id).bootstrapTable("refresh");
    
                        })
    
                    }
                }
                });
        }
        else{
            bootbox.alert('The selected version is identical with the final version.');
        }


        
    },
}


function subject_changelog_old_subject_data_formatter(value,row){
    var subject_index = row["SubjectIndex"];
    if(subject_changelog_status_history_lookup.hasOwnProperty(subject_index)){
        var subject_changelog_index = row["SubjectChangeLogIndex"];
        var versions = subject_changelog_get_versions(subject_index,subject_changelog_index);

        delete versions.this_status.SubjectChangeLogIndex;

        return jsonFormatter(subject_changelog_alike_formatter(versions.this_status),null);
    }

    var subject_data = JSON.parse(row["SubjectData"]);
    var old_info_string = jsonFormatter(subject_data,null);
    return old_info_string;
}


function subject_changelog_last_subject_data_formatter(value,row){
    var subject_index = row["SubjectIndex"];
    if(subject_changelog_final_status_lookup.hasOwnProperty(subject_index)){
        var final_info = {... subject_changelog_final_status_lookup[subject_index]};

        return jsonFormatter(subject_changelog_alike_formatter(final_info),null);;
    }
    return;
}

function subject_changelog_version_timestamp_formatter(value,row){
    // console.log(row);
    // timestamp of an entry in event_change_log is the dateteime when the change occured - not the timestamp of the old version
    try {
        var subject_data = JSON.parse(row["SubjectData"]);
        return subject_data["Timestamp"];
    } catch (error) {
        return;
    }

}


function subject_changelog_detail_view_formatter(index,row){
    var subject_index = row["SubjectIndex"];
    var subject_changelog_index = row["SubjectChangeLogIndex"];

    var versions = subject_changelog_get_versions(subject_index,subject_changelog_index);

    // console.log(versions);

    var pre_version = subject_changelog_alike_formatter(versions.pre_status);
    var this_version = subject_changelog_alike_formatter(versions.this_status);
    var next_version = subject_changelog_alike_formatter(versions.next_status);
    var final_version = subject_changelog_alike_formatter(versions.final_status);

    var names = ["Parameter","Prevoius version", "This version", "Next version", "Final version"];
    var version_list = [pre_version, this_version, next_version, final_version];
    var keys = Object.keys(final_version);

    var table = $("<table/>").addClass("w-100 table table-sm table-striped table-bordered border-secondary").attr("id","event_version_"+subject_changelog_index+"_table");
    
    var header_row = $("<tr/>");
    $.each(names,function(name_index,name){
        header_row.append($("<th/>").html(name).attr("scope","col").addClass("text-center"));
    })
    table.append($("<thead/>").addClass("table-dark").append(header_row));

    var table_body = $("<tbody/>");
    $.each(keys,function(key_index,key){
        var row = $("<tr/>");
        row.append($("<th/>").html(key).attr("scope","row"));
        $.each(version_list,function(_index,version){
            if(version==null){
                row.append($("<td/>").html("-"));
            }
            else{
                var version_val = nullify_obj(version[key]);
                if(!isObject(version_val)){
                    var _val = parse_val(version_val);
                    row.append($("<td/>").html(_val == null ? "-":_val));
                }
                else{
                    var cell_data = $("<div/>");
                    $.each(version_val,function(_key,_val){
 
                        cell_data.append($("<b/>").append(_key))
                        cell_data.append("&emsp;"+_val + "<br/>");
                        
                    })
                    row.append($("<td/>").append(cell_data));
                }
            }    
        })
        table_body.append(row);

    })

    table.append(table_body);

    var content = $("<div/>").addClass("mx-3 my-3").append(table);

    return content;
}


function subject_changelog_query_params(params){
    params.indices = subject_changelog_visible_subject_indices;
    return params
}

function create_subject_changelog_table(container, table_id, simplify = false, subject_index = null){
    var table = $("<table/>").attr("id",table_id);

    var toolbar = $("<div/>").attr("id",table_id+"_toolbar");

    var subject_selector_container = $("<div/>");
    
    if(subject_index==null){
        subjectSelectWidget(subject_selector_container,"all",
        function(subject_indices,subject_info){
            // console.log(subject_indices);
            // console.log(subject_info);

            var options = {};

            if(subject_indices=="all"){
                subject_changelog_visible_subject_indices = getCol(subject_info,"SubjectIndex");
                options["queryParams"] = function(params) { return params };
                options["ajax"] = subject_changelog_retrieve_all_ajax;
            }
            else{
                subject_changelog_visible_subject_indices = subject_indices;
                options["queryParams"] = subject_changelog_query_params;
                options["ajax"] = subject_changelog_retrieve_subjects_ajax;
            }

            table.bootstrapTable('refreshOptions',options);
            table.bootstrapTable("filterBy",{});

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
                {title: '', field: 'operate', align: 'center', sortable:false, searchable:false, clickToSelect : false,
                events: window.subject_changelog_operate_events, formatter: subject_changelog_operate_formatter, forceHide:true},
                {title: '#', field : 'SubjectChangeLogIndex', align:'center', sortable:true, searchable:false, visible:false, forceHide: true},

                {title: 'Version', field : 'OldLastChange', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "subject_changelog_version_timestamp_formatter", visible:true},
                
                // timestamp of an entry in subject_change_log is the dateteime when the change occured - not the timestamp of the old version
                {title: 'Changed @', field : 'Timestamp', align:'center', sortable:true, searchable:true,forceExport: false, formatter: "datetimeFormatter",visible:false},
               

                {title: 'Index', field : 'SubjectIndex', align:'center', sortable:true, searchable:false, visible:true, forceExport: true},
                {title: 'ID', field : 'NewSubjectID', align:'center', sortable:true, searchable:true,forceExport: true},
                {title: 'Name', field : 'NewSubjectName', align:'center', sortable:true, searchable:true,forceExport: true, },
                {title: 'Group', field : 'NewSubjectGroup', align:'center', sortable:true, searchable:true,forceExport: true},
                {title: 'Study', field : 'NewStudyID', align:'center', sortable:true, searchable:true, formatter: "studyFormatter", forceExport: true},
                {title: 'Status', field : 'NewSubjectStatus', align:'center', sortable:true, searchable:true, visible:true, forceExport: true, formatter:"subjectStatusFormatter"},


                {title: 'ModifiedBy', field : 'ModifiedBy', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "userFormatter",visible:false},
                
                // {title: 'Old timestamp', field : 'OldLastChange', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "subject_changelog_old_event_modified_at_formatter", visible:false},

                {title: 'Old Info', field : 'SubjectData', align:'center', sortable:false, searchable:false, forceExport: true, formatter: "subject_changelog_old_subject_data_formatter", visible:false},
                {title: 'Final Info', field : 'NewSubjectData', align:'center', sortable:false, searchable:false, forceExport: true, formatter: "subject_changelog_last_subject_data_formatter", visible:false},
                
              ],

            pagination:true,
            checkboxHeader:true,
            smartDisplay:true,
            detailFormatter: subject_changelog_detail_view_formatter,

            idField:"Subject_changelogIndex",

            showExport:!simplify,
            exportTypes: ['csv','json','excel','doc','txt','sql','xml',"pdf"],
            exportDataType: 'all'
        });

    if(subject_index!=null){
        table.bootstrapTable('refreshOptions', {queryParams:function(params){
                                                                params.indices=subject_index;
                                                                return params
                                                            }, 
                                                ajax: subject_changelog_retrieve_subjects_ajax});

        
    }

}



function show_subject_changelog_handler(container){

    create_subject_changelog_table(container,subject_changelog_table_id);

    var table = $('#'+subject_changelog_table_id);

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
        if(data.total>0) update_subject_changelog_status_list(data["rows"]);
    })

    // table.on('all.bs.table',function(args,name){
    //     console.log(name)
    // })


    var toolbar = container.find(".fixed-table-toolbar");

    subject_changelog_content = $("<div/>").attr("id","subject_changelogModalContainer");
    container.append(subject_changelog_content);

    toolbar.find(".needs-select").addClass("disabled");

}