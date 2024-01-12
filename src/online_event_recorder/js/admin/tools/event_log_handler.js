var eventlog_table_id = "eventlogTable";
var eventlog_content = {};
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
        dataType: "json",
        data: ({event_info:params}),
        success: function(result){
            callback();
        }
    });
}

function eventlog_update_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/update_event.php',
        dataType: "json",
        data: ({event_info:params}),
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
    container.append($("<button/>").addClass("btn btn-outline-primary btn-sm edit me-2 lockable").append($("<i/>").addClass("fa fa-edit")))
    // container.append($("<button/>").addClass("btn btn-outline-primary btn-sm status argeditor-lockable").append($("<i/>").addClass("fa fa-solid fa-signs-post")))

    // if(_lock_list.length>0){
    //     container.find("button").addClass("disabled");
    // }

    return container.prop("outerHTML");
  }


window.eventlog_operate_events = {
    'click .edit': function (e, value, row, index) {
        // var modal_id = initSubjectModalEdit(subject_content,$("#"+subject_table_id),index);
        // var modal_edit = $("#"+modal_id);
        // if(modal_edit.length>0){
        //     $(modal_edit[0]).modal('show');
        //     // _content_name = "edit";
        //     // $( document ).trigger( "_lock", [ "edit"] );
        // }
    },
}

function eventlog_query_params(params){
    params.indices = eventlog_visible_subjects;
    // console.log(eventlog_visible_subjects);
    return params
}

function create_eventlog_table(container, table_id, simplify = false){
    var table = $("<table/>").attr("id",table_id);
    
    var subject_selector_container = $("<div/>");
    subjectSelectWidget(subject_selector_container,"all",
        function(subject_indices,subject_info){
            // console.log(subject_indices);
            // console.log(subject_info);

            eventlog_visible_subjects_info = subject_info;
            
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

    var toolbar = $("<div/>").attr("id",table_id+"_toolbar");

    
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

    
    // study_dropdown.on("change", function(){
    //     var selected = $(this).val();

    //     if(selected == "all"){
    //         table.bootstrapTable('uncheckAll');
    //         table.bootstrapTable('refreshOptions', { ajax: subject_retrieve_all_ajax });
    //         table.bootstrapTable('resetSearch');
    //     }
    //     else{
    //         table.bootstrapTable('uncheckAll');
    //         table.bootstrapTable('refreshOptions', { ajax: function(params){
    //             params.study_id = selected;
    //             subject_retrieve_ajax(params);
    //         } });
    //         table.bootstrapTable('resetSearch');
    //     }
    //     subjects_table_events();
    // })
  
   
}





function show_event_log_handler(container){

    create_eventlog_table(container,eventlog_table_id);
    
    var table = $('#'+eventlog_table_id);

    var toolbar = container.find(".fixed-table-toolbar");

    eventlog_content = $("<div/>").attr("id","eventlogModalContainer");
    container.append(eventlog_content);

    

}