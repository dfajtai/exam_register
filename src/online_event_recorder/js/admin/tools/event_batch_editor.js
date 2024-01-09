var event_batch_table_id = "eventBatchTable";
var event_batch_content = {};

var event_batch_content_name = "";
var event_batch_lock_list = [];


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
        // showArgEditorEditForm(_content,"edit_form", $('#'+_table_id),index);
        // _content_name = "edit";
        // $( document ).trigger( "_lock", [ "edit"] );
    },
    'click .remove': function (e, value, row, index) {
        bootbox.confirm({
            message: 'You are going to the selected row: [name = "'+ row["FieldName"] +'"].<br>Do you want to proceed?',
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
                    // $('#'+_table_id).bootstrapTable('remove', {
                    //     field: '$index',
                    //     values: [index]
                    //     });
                    // statusToStorage("eventBatchEditorHistory",JSON.stringify($('#'+_table_id).bootstrapTable('getData')));
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
    var html = []
    var hidden_keys = ["state"]
    $.each(row, function (key, value) {
      if(!(hidden_keys.includes(key))){
        html.push('<p><b>' + key + ':</b> ' + value + '</p>')
      }

    })
    return html.join('')
}


function createBatchTable(container, table_id, height){
    // var table_with_controls = $("<div/>");

   
    var table = $("<table/>").attr("id",table_id);

    var toolbar = $("<div/>").attr("id",table_id+"_toolbar");
    toolbar.append($("<button/>").attr("id","toolbar_add").addClass("btn btn-success admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-plus me-2").attr("aria-hidden","true")).append("Add New"));
    toolbar.append($("<button/>").attr("id","toolbar_duplicate").addClass("btn btn-primary admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-solid fa-copy me-2").attr("aria-hidden","true")).append("Duplicate Selected"));
    toolbar.append($("<button/>").attr("id","toolbar_removeSelected").addClass("btn btn-danger admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-trash fa-solid me-2").attr("aria-hidden","true")).append("Remove Selected"));
    toolbar.append($("<button/>").attr("id","toolbar_show_eventbatch_json_input").addClass("btn btn-outline-success admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-file-import fa-solid me-2").attr("aria-hidden","true")).append("Load JSON"));
    toolbar.append($("<button/>").attr("id","toolbar_generate_eventbatch_JSON").addClass("btn btn-outline-success admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-code fa-solid me-2").attr("aria-hidden","true")).append("Generate JSON"));
    toolbar.append($("<button/>").attr("id","toolbar_generate_events").addClass("btn btn-outline-success admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-gears fa-solid me-2").attr("aria-hidden","true")).append("Generate events"));


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
                {title: 'Name', field : 'EventName ', align:'center', sortable:true, searchable:true},
                {title: 'Template', field : 'EventID', align:'center', sortable:true, searchable:true, formatter: eventFormatter},
                {title: 'Type', field : 'EventType', align:'center', sortable:true, searchable:true, formatter: eventTypeFormatter},
                {title: 'Comment', field : 'EventComment', align:'center', sortable:true, searchable:true},
                {title: 'Status', field : 'EventStatus', align:'center', sortable:true, searchable:true, formatter: eventStatusFormatter},
                {title: 'Location', field : 'EventLocation', align:'center', sortable:true, searchable:true, formatter: locationFormatter},
            ],
            pagination:true,
            checkboxHeader:true,
            smartDisplay:true,
            detailFormatter: eventbatch_detail_view_formatter
        });    
}

function eventBatchInput(container){
    var params =  [
        {"FieldName":"EventName","FieldLabel":"Event Name","FieldType":"input","FieldDataType":'text', "FieldRequired":true},
        {"FieldName":"EventID","FieldLabel":"Event template","FieldType":"select","FieldSource":"event", "FieldRequired":true},
        {"FieldName":"EventStatus","FieldLabel":"Status","FieldType":"select","FieldSource":"event_status", "FieldRequired":true},
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


function initEventBatchModalAdd(container, table){
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
} 


function initEventBatchGenerateEvents(container, table){
    var modal_id = "eventBatchModalGenerateEvents";
    var form_id = modal_id+"Form";

    container.find("#"+modal_id).remove();

    eventBatchModal(container, modal_id, "Create events for subjects");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var submitForm = $("<div/>").addClass("row mb-3 text-center");
    var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Add event");
    submitForm.append(submitButton);

    form.append(submitForm);
    
    
    $(modal).on('hide.bs.modal',function(){
        $( document ).trigger("_release",["generate_events"]);
        event_batch_content_name = "";
    })

    form.on('submit',function(e){
        e.preventDefault();


        modal.modal('hide');
        form[0].reset();
    });

    container.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })
    modal_body.append(form);
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
            if(event_args_lock_list.length>0) return;

            var selection =  table.bootstrapTable('getSelections');
            if(selection.length>0 && event_args_lock_list.length==0){
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


    initEventBatchModalAdd(event_batch_content, table);
    toolbar.find("#toolbar_add").on("click", function(){
        $('#eventBatchModalAdd').modal('show');
        $(document).trigger("_lock",["add"]);
        event_batch_content_name = "add";
    });

    initEventBatchGenerateEvents(event_batch_content, table);
    toolbar.find("#toolbar_generate_events").on("click", function(){
        $('#eventBatchModalGenerateEvents').modal('show');
        $(document).trigger("_lock",["generate_events"]);
        event_batch_content_name = "generate_events";
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

    $( document ).on( "operate_lock", {},
        function( event ) {
            if(event_batch_lock_list.length!=0){
                $(document).find(".lockable").addClass("disabled");
                if(!event_batch_lock_list.includes("search")) $(document).find(".search-input").prop( "disabled", true );
                $(document).find(".sortable").prop( "disabled", true );
            }
            else{
                $(event_args_content).empty();
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