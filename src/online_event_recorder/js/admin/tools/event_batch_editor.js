var _table_id = "eventBatchTable";
var _content = {};


window.eventBatchOperateEvents = {
    'click .move_up': function (e, value, row, index) {
        if(index==0){
            return
        }
        var data = $('#'+_table_id).bootstrapTable('getData');
        var upper_data = {... data[index-1]};
        upper_data.state = upper_data.state===undefined ? false : upper_data.state;
        $('#'+_table_id).bootstrapTable('updateRow',{index:index-1,row:row});
        $('#'+_table_id).bootstrapTable('updateRow',{index:index, row:upper_data});
    },
    'click .move_down': function (e, value, row, index) {
        var data = $('#'+_table_id).bootstrapTable('getData');
        if(index==data.length-1){
            return
        }
        var lower_data = {... data[index+1]};
        lower_data.state = lower_data.state === undefined ? false : lower_data.state;
        $('#'+_table_id).bootstrapTable('updateRow',{index:index+1,row:row});
        $('#'+_table_id).bootstrapTable('updateRow',{index:index, row:lower_data});
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
    if(index==$('#'+_table_id).bootstrapTable('getData').length-1){
        btn_down.addClass("disabled").removeClass("lockable");
    }

    if(_lock_list.length>0){
        container.find("button").addClass("disabled");
    }

    return container.prop("outerHTML");
}

function createBatchTable(container, table_id, height){
    // var table_with_controls = $("<div/>");

   
    var table = $("<table/>").attr("id",table_id);

    var toolbar = $("<div/>").attr("id",table_id+"_toolbar");
    toolbar.append($("<button/>").attr("id","toolbar_add").addClass("btn btn-success admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-plus me-2").attr("aria-hidden","true")).append("Add New"));
    toolbar.append($("<button/>").attr("id","toolbar_removeSelected").addClass("btn btn-danger admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-trash fa-solid me-2").attr("aria-hidden","true")).append("Remove Selected"));

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
                events: window.eventBatchOperateEvents, formatter: eventBatchOperateFormatter},
                {title: 'Name', field : 'EventID', align:'center', sortable:true, searchable:true, formatter: eventFormatter},
                {title: 'Type', field : 'EventType', align:'center', sortable:true, searchable:true, formatter: eventTypeFormatter},
                {title: 'Comment', field : 'EventComment', align:'center', sortable:true, searchable:true},
                {title: 'Status', field : 'EventStatus', align:'center', sortable:true, searchable:true, formatter: eventStatusFormatter},
                {title: 'Location', field : 'EventLocation', align:'center', sortable:true, searchable:true, formatter: locationFormatter},
            ],
            pagination:true,
            checkboxHeader:true,
            smartDisplay:true,
            detailFormatter:simpleFlatFormatter
        });    
}

function eventBatchInput(container){
    var params =  [
        {"FieldName":"EventID","FieldLabel":"Event","FieldType":"select","FieldSource":"event", "FieldRequired":true},
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
    modal_header.append($("<h5/>").addClass("modal-title display-3 fs-1").html(title));
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

    
    $(modal).on('hidden.bs.modal',function(){
        // $( document ).trigger("_release",["add"]);
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




function showEventBatchEditor(container){
    createBatchTable(container,_table_id,750);
    var table = $('#'+_table_id);
    
    if(statusInStorage("eventBatchEditorHistory")){
        table.bootstrapTable('append',JSON.parse(statusFromStorage("eventBatchEditorHistory")));
    }

    var toolbar = container.find(".fixed-table-toolbar");
    
    toolbar.find(".needs-select").addClass("disabled");
    
    _content = $("<div/>").addClass("pt-3");
    container.append(_content);


    initEventBatchModalAdd(_content, table);
    toolbar.find("#toolbar_add").on("click", function(){
        $('#eventBatchModalAdd').modal('show');
        // $(document).trigger("_lock",["add"]);
    });

    

}