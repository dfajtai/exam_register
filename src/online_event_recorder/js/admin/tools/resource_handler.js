var resource_handler_table_id = "resourceHandlerTable";
var resource_handler_content = {};


function resource_handler_retrieve_all_ajax(params) {
    // console.log("retrieve all subj");
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "resource_locks"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function resource_handler_free_resource(lock_id, callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/resource_lock_forced_release.php',
    dataType: "json",
    data: {lock_id:lock_id},
    success: function(result){
        callback();
    }
    });
}

function resource_handler_format_value(value,col){
    switch (col) {         
        case "resource_id":
            return resource_handler_json_formatter(value,null);
            break;
        case "valid":
            return datetimeFormatter(value,null);
            break;            
        case "user":
            return userFormatter(value,null);
            break;            
    
        default:
            return value;
            break;
    }
}

function resource_handler_formatter(subject_entry){
    if(!isObject(subject_entry)){
        return subject_entry;
    }

    var res  = {};
    $.each(subject_entry,function(key,value){
        res[key] = resource_handler_format_value(value,key);
    })

    return res;
}


function resource_handler_operate_formatter(value,row,index){
    var container = $("<div/>");


    if(row["valid"]!=null){
        var btn_release = $("<button/>").addClass("btn btn-outline-dark btn-sm release").append($("<i/>").addClass("fa fa-key"));
        btn_release.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Release locked resources");
        container.append(btn_release);
    }
    return container.prop("outerHTML");
  }

window.resource_handler_operate_events = {
    'click .release': function (e, value, row, index) {
        resource_handler_free_resource(row["lock_id"],function(){
            var table = $("#"+resource_handler_table_id);
            $(table).bootstrapTable("refresh");
        })
    },
}

function resource_handler_filter(row, filters){
    if(row["valid"] === null) return false;
    return true;
}

function resource_handler_json_formatter(value,row){
    var arr = JSON.parse(value);
    if(arr.length>0) return  arr.join(", ");
}

function create_resource_handler_table(container,table_id){
    var table = $("<table/>").attr("id",table_id);

    table.attr("data-toolbar","#"+table_id+"_toolbar");
    table.attr("data-toolbar-align","left");

    // table.attr("data-cache","false");

    table.attr("data-pagination","false");
    table.attr("data-show-pagination-switch","false");
    table.attr("data-page-list","[10, 25, 50, 100, all]");

    table.attr("data-show-footer","false");
    table.attr("data-show-refresh","true");
    table.attr("data-auto-refresh","true");
    table.attr("data-auto-refresh-status","false");
    table.attr("data-show-auto-refresh","true");
    table.attr("data-auto-refresh-interval","5");
    table.attr("data-auto-refresh-silent","true");

    table.attr("data-search","true");
    table.attr("data-regex-search","true");
    table.attr("data-visible-search","true");
    table.attr("data-search-highlight","true");
    table.attr("data-show-search-clear-button","true");

    table.attr("data-detail-view","true");

    table.attr("data-maintain-meta-data","true");

    table.attr("data-locale","hu-HU");

    table.attr("data-click-to-select","true");
    table.attr("data-single-select","false");
    table.attr("data-multiple-select-row","false");

    table.attr("data-sort-reset","true");

    container.append(table);

    table.bootstrapTable({
        columns : [
            {title: '', field: 'operate', align: 'center', sortable:false, searchable:false, clickToSelect : false,
            events: window.resource_handler_operate_events, formatter: resource_handler_operate_formatter, forceHide:true},
            {title: '#', field : 'lock_id', align:'center', sortable:true, searchable:false, visible:false, forceHide: true},

            {title: 'User', field : 'user', align:'center', sortable:true, searchable:true,forceExport: true, formatter: "userFormatter",visible:true},
            
            // timestamp of an entry in event_change_log is the dateteime when the change occured - not the timestamp of the old version
            {title: 'Valid until', field : 'valid', align:'center', sortable:true, searchable:true,forceExport: false, formatter: "datetimeFormatter",visible:true},
            {title: 'Resource', field : 'resource', align:'center', sortable:true, searchable:true,forceExport: true, visible:true},
            {title: 'Locked resources', field : 'resource_id', align:'center', sortable:true, searchable:true,forceExport: true, visible:true,
            formatter: "resource_handler_json_formatter"},

          ],

        pagination:true,
        smartDisplay:true,
        detailFormatter: function(index,row){return detail_as_table_formatter(index,row,resource_handler_formatter)},

        idField:"lock_id",

        showExport:false,
        exportTypes: ['csv','json','excel','doc','txt','sql','xml',"pdf"],
        exportDataType: 'all',
    });

    var options ={};
    options["ajax"] = resource_handler_retrieve_all_ajax;
    options["filterOptions"] = {'filterAlgorithm':function(row,filters){
        return resource_handler_filter(row,filters);
    }};
    table.bootstrapTable("refreshOptions",options);
    

}

function show_resource_handler(container){
    create_resource_handler_table(container,resource_handler_table_id);
    
    var table = $('#'+resource_handler_table_id);

}