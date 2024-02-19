var subject_table_id = "subjectTable";
var subject_content = {};
// var _content_name = "";
// var _lock_list = []

var active_subject_locks = [];
var active_subject_lock_info = {};

var subjects_lock_interval = null;

function subject_retrieve_all_ajax(params) {
    // console.log("get all subjects");
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "subjects"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function subject_retrieve_ajax(params) {
    // console.log("get study subjects");
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table_where.php',
    dataType: "json",
    data: ({table_name:"subjects",where:{"StudyID": params.study_id}}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function subject_insert_ajax(subject_info,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    
    var data = {};
    data["subject_info"]=subject_info;
    if(!isObject(subject_info)){
        data["multiple"] = true;
    }
    
    $.ajax({
        type: "POST",
        url: 'php/insert_subject.php',
        // dataType: "json",
        data: data,
        success: function(result){
            callback();
        }
    });
}

function subject_update_ajax(subject_index,subject_info,callback,return_ajax = false) {
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


function update_subject_locks(){
    var $table = $('#'+subject_table_id);
    // getLocksFast("subjects",function(locks){
    //     if(!isEqual(locks,active_subject_locks)){
    //         active_subject_locks = locks;
    //         // $table.trigger($.Event("load-success.bs.table"),[]);
    //         // $table.bootstrapTable('resetView');
    //         // $table.bootstrapTable('refreshOptions',{});
    //         $table.bootstrapTable('filterBy',{});
    //         // $table.bootstrapTable('resetSearch');
            
    //     }       
    // });

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
            active_subject_locks = locked_indices;
            active_subject_lock_info = resource_lock_info;

            // $table.bootstrapTable('filterBy',{});

            var options = $table.bootstrapTable("getOptions");
            var page_number = options.pageNumber;
            $table.bootstrapTable('selectPage', page_number);

            // efforts to change specific cell on demand

            // var cols = [];
            // $.each($($table.find("thead")[0]).find("th"),function(index,col_dom){
            //     console.log($(col_dom));
            //     cols.push($(col_dom).attr("data-field"))
            // })

            // var operate_col_index = cols.indexOf("operate");
            // var locked_col_index = cols.indexOf("locked");

            // var options = $table.bootstrapTable("getOptions");
            // var page_size = options.pageSize;
            // var page_number = options.pageNumber;

            // var data = $table.bootstrapTable("getData").slice((page_number-1)*page_size,(page_number*page_size));
            // if(data.length==0) return;

            // var tbody = $table.find("tbody")
            // var rows = tbody.find("tr");
            // $.each(data,function(index,entry){
            //     var row = rows[index];
            //     if(!active_subject_locks.includes(entry["SubjectIndex"])) return true;
            //     var cells = $(row).find("td");
            //     $(cells[operate_col_index]).html(subjectOperateFormatter(null,entry,null));
            //     $(cells[locked_col_index]).html(subject_lock_formatter(null,entry,null));

            // })
        }
    })
}

function subjectOperateFormatter(value, row, index) {
    var container = $("<div/>").addClass("lockable");

    var edit_btn = $("<button/>").addClass("btn btn-outline-dark btn-sm edit lockable me-1").append($("<i/>").addClass("fa fa-edit"))
    edit_btn.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Edit subject");
    container.append(edit_btn);

    if(row["Status"]!=subject_deleted_status){
        var btn_remove = $("<button/>").addClass("btn btn-outline-danger btn-sm remove lockable").append($("<i/>").addClass("fa fa-trash"));
        btn_remove.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Set status to 'deleted'");
        container.append(btn_remove);
    }
    else{
        var btn_resotre = $("<button/>").addClass("btn btn-outline-primary btn-sm restore lockable").append($("<i/>").addClass("fa fa-trash-arrow-up"));
        btn_resotre.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Set status to 'planned'");
        container.append(btn_resotre);
    }
    if(active_subject_locks.includes(row["SubjectIndex"])){
        container.find(".lockable").prop("disabled",true);
    }

    return container.prop("outerHTML");
  }

function subject_lock_check(entries, candidate_indices, callback){
    if(!isArray(candidate_indices)) candidate_indices = [candidate_indices];
    if(!isArray(entries)) entries = [entries];

    getLocks("subjects",function(locked_indices,locks){
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
                var message = 'Subject is locked by <b>'+userFormatter(user) + '</b> until <b>' + valid + '</b> - or until it gets released.'
                message+="<br>"+ object_to_table_formatter(entries[entry_index],subject_register_subject_formatter).prop("outerHTML");
                bootbox.alert(message);
            }
        })
        
        if(!resource_already_locked){
            callback();
        }
    })        
}


window.subject_operate_events = {
    'click .edit': function (e, value, row, index) {
        var entry = $('#'+subject_table_id).bootstrapTable('getData')[index];
        var candidate_index = entry.SubjectIndex;

        subject_lock_check([entry],[candidate_index],function(){show_subject_modal_edit(subject_content,$("#"+subject_table_id),index)});
        
    },

    'click .remove': function (e, value, row, index) {
        var entry = $('#'+subject_table_id).bootstrapTable('getData')[index];
        var candidate_index = entry.SubjectIndex;

        subject_lock_check([entry],[candidate_index],function(){
            subject_update_ajax(subject_index = parse_val(row["SubjectIndex"]),
            subject_info = {"Status":subject_deleted_status},
            function(){
                $('#'+subject_table_id).bootstrapTable('refresh');
                $('#'+subject_table_id).bootstrapTable('resetView');
            });
        });


    },
    'click .restore': function (e, value, row, index) {
        var entry = $('#'+subject_table_id).bootstrapTable('getData')[index];
        var candidate_index = entry.SubjectIndex;

        subject_lock_check([entry],[candidate_index],function(){
            subject_update_ajax(subject_index = parse_val(row["SubjectIndex"]),
            subject_info = {"Status":subject_planned_status},
            function(){
                $('#'+subject_table_id).bootstrapTable('refresh');
                $('#'+subject_table_id).bootstrapTable('resetView');
            });
        });
    },
}

function subjects_format_value(value,col){
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

function subject_register_subject_formatter(subject_entry){
    if(!isObject(subject_entry)){
        return subject_entry;
    }

    var res  = {};
    $.each(subject_entry,function(key,value){
        res[key] = subjects_format_value(value,key);
    })

    return res;
}

function subject_lock_formatter(value,row, index){
    if(active_subject_locks.includes(row["SubjectIndex"])){
        var content = $("<span/>").addClass("bi bi-lock-fill text-danger");
        var _info = active_subject_lock_info[row["SubjectIndex"]];
        content.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Subject has been locked by '"+ userFormatter(_info["user"]) +"' until "+ _info["valid"] +".")
        return content.prop("outerHTML");
    }
    return $("<span/>").addClass("bi bi-unlock-fill text-success").prop("outerHTML");
}

function subject_checkbox_formatter(value,row, index){
    if(active_subject_locks.includes(row["SubjectIndex"])){
        return {disabled: true, checked:false}
    }
    return {disabled: false};
}

function subjects_status_filter(row, filters, visible_status = null){
    // console.log(filters);
    if(visible_status == null) return true;
    if(!isArray(visible_status)) return true;
    if(row["Status"] == null) return true;
    if(!visible_status.includes(row["Status"])) return false;
    return true;
}

function createSubjectTable(container,table_id, simplify = false){
    var table = $("<table/>").attr("id",table_id);
  
    var toolbar = $("<div/>").attr("id",table_id+"_toolbar");

    var options = {};
    var pre_selected = null;

    if(simplify){
        var toolbar_content = $("<div/>").addClass("input-group w-100");
        var study_dropdown = $("<select/>").addClass("form-control").attr("id","studySelect").attr("type","text");
        study_dropdown.append($("<option/>").html("Select scope...").prop("disabled",true).prop('selected',true).attr("value",""));
        study_dropdown.append($("<option/>").html("All").attr("value","all"));
        showAllDefs(study_dropdown,"studies","StudyID","StudyName","StudyName");
        toolbar_content.append($("<span/>").attr("for","studySelect").html("Filter by study: ").addClass("input-group-text"))
        toolbar_content.append(study_dropdown);
        toolbar.append(toolbar_content);
        }
    else{
        toolbar.append($("<button/>").attr("id","toolbar_add").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-plus me-2").attr("aria-hidden","true")).append("Add New"));
        toolbar.append($("<button/>").attr("id","toolbar_duplicate").addClass("btn btn-outline-dark admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-solid fa-copy me-2").attr("aria-hidden","true")).append("Duplicate").attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Duplicate selected subjects."));
        toolbar.append($("<button/>").attr("id","toolbar_batch_edit").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable needs-select").html($("<i/>").addClass("fa fa-pen-to-square me-2").attr("aria-hidden","true")).append("Batch edit").attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Batch edit selected subjects."));
        toolbar.append($("<button/>").attr("id","toolbar_import").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-solid fa-file-import me-2").attr("aria-hidden","true")).append("Import from CSV"));
        
        var status_filter = statusFilterWidget("subject",[subject_deleted_status],
            function(vals){
                options["filterOptions"] = {'filterAlgorithm':function(row,filters){
                    return subjects_status_filter(row,filters,vals);
                }};

                table.bootstrapTable("resetSearch");
                table.bootstrapTable("refreshOptions",options);
                table.bootstrapTable("filterBy",{});

        });
        status_filter.addClass("admin-table-toolbar-btn");
        toolbar.append(status_filter);

        var study_selector = $("<div/>").addClass("row mt-3 mb-3");
        var study_dropdown = $("<select/>").addClass("form-control").attr("id","studySelect").attr("type","text");
        study_dropdown.append($("<option/>").html("Select scope...").prop("disabled",true).prop('selected',true).attr("value",""));
        study_dropdown.append($("<option/>").html("All").attr("value","all"));
        showAllDefs(study_dropdown,"studies","StudyID","StudyName","StudyName");
    
        study_selector.append($("<label/>").attr("for","studySelect").addClass("col-form-label col-md-3").html("Filter by study: "));
        study_selector.append($("<div/>").addClass("col-md-9").append(study_dropdown));
        container.append(study_selector);
    }

    // table.attr("data-height",String(height));

    table.attr("data-toolbar","#"+table_id+"_toolbar");
    table.attr("data-toolbar-align","left");
    

    table.attr("data-show-pagination-switch","false");
    table.attr("data-page-list","[10, 25, 50, 100, all]");

    table.attr("data-show-footer","false");
    table.attr("data-show-refresh","true");

    if(!simplify){
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

    // table.attr("data-searchable","true"); // server-side
    // table.attr("data-side-pagination","server"); // server-side

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
                {field : 'state', checkbox: true, align:'center', forceHide:true,formatter: "subject_checkbox_formatter"},
                {title: '', field : 'locked', align:'center', forceHide:true,formatter: "subject_lock_formatter"},
                {title: '', field: 'operate', align: 'center', sortable:false, searchable:false, clickToSelect : false,
                events: window.subject_operate_events, formatter: subjectOperateFormatter, forceHide:true},
                {title: '#', field : 'SubjectIndex', align:'center', sortable:true, searchable:false, visible:false, forceHide: true},
                {title: 'Study', field : 'StudyID', align:'center', sortable:true, searchable:true, formatter: "studyFormatter", forceExport: true},
                {title: 'ID', field : 'SubjectID', align:'center', sortable:true, searchable:true,forceExport: true},
                {title: 'Name', field : 'Name', align:'center', sortable:true, searchable:true,forceExport: true},
                {title: 'Group', field : 'Group', align:'center', sortable:true, searchable:true,forceExport: true},
                {title: 'Batch', field : 'Batch', align:'center', sortable:true, searchable:true,forceExport: true},
                {title: 'Box', field : 'Container', align:'center', sortable:true, searchable:true,forceExport: true},
                {title: 'Location', field : 'Location', align:'center', sortable:true, searchable:true, formatter: "locationFormatter",forceExport: true},
                {title: 'Status', field : 'Status', align:'center', sortable:true, searchable:true, formatter: "subjectStatusFormatter",forceExport: true},
                {title: 'Age', field : 'Age', align:'center', sortable:true, searchable:false,forceExport: true, visible:false},
                {title: 'Sex', field : 'Sex', align:'center', sortable:true, searchable:true, formatter: "sexFormatter",forceExport: true, visible:false},
                {title: 'Weight', field : 'Weight', align:'center', sortable:true, searchable:false,forceExport: true, visible:false},
                {title: 'Height', field : 'Height', align:'center', sortable:true, searchable:false,forceExport: true, visible:false},
                {title: 'Comment', field : 'Comment', align:'center', sortable:true, searchable:false,forceExport: true, visible:false},
                {title: 'Changed @', field : 'LastChange', align:'center', sortable:true, searchable:false,forceExport: true, formatter:"datetimeFormatter", visible:false},
            ],
            pagination:true,

            checkboxHeader:true,
            smartDisplay:true,
            detailFormatter: function(index,row){return detail_as_table_formatter(index,row,subject_register_subject_formatter)},

            idField:"SubjectIndex",

            showExport:!simplify,
            exportTypes: ['csv','json','excel','doc','txt','sql','xml',"pdf"],
            exportDataType: 'all'
        });
    
    study_dropdown.on("change", function(){
        var selected = $(this).val();

        if(selected == "all"){
            options["ajax"] = subject_retrieve_all_ajax;
        }
        else{
            options["ajax"] = function(params){
                params.study_id = selected;
                subject_retrieve_ajax(params);
            } 
        }

        if(pre_selected==null){
            var status_select_widgets = toolbar.find("#status_filter_widget").find("input");
            if(status_select_widgets.length == 0) table.bootstrapTable('refreshOptions',options);
            else{
                $(status_select_widgets[0]).trigger("change");
            }
            
        }
        else{
            table.bootstrapTable('uncheckAll');
            table.bootstrapTable('refreshOptions',options);
            table.bootstrapTable("filterBy",{});
            table.bootstrapTable('resetSearch');
        }

        pre_selected = selected;        

        subjects_table_events();
    })
    
    // table.bootstrapTable('refreshOptions', { ajax: subject_retrieve_all_ajax });
   
}

function subjectFormInputs(container){
    var params =  [
    {"FieldName":"SubjectID","FieldLabel":"Subject ID","FieldDataType":"text","FieldType":"input","FieldRequired":true},
    {"FieldName":"StudyID","FieldLabel":"Study","FieldType":"select","FieldSource":"study","FieldRequired":true},
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
}


function subjectBatchFormInputs(container){
    var params =  [
    {"FieldName":"StudyID","FieldLabel":"Study","FieldType":"select","FieldSource":"study","FieldRequired":false},
    {"FieldName":"Group","FieldLabel":"Group","FieldDataType":"text","FieldType":"input","FieldRequired":false},
    {"FieldName":"Batch","FieldLabel":"Batch","FieldDataType":"text","FieldType":"input","FieldRequired":false},
    {"FieldName":"Location","FieldLabel":"Location","FieldType":"select","FieldSource":"location"},
    {"FieldName":"Status","FieldLabel":"Status","FieldType":"select","FieldSource":"subject_status"},
    {"FieldName":"Sex","FieldLabel":"Sex","FieldType":"select","FieldSource":"sex","FieldRequired":false},
    {"FieldName":"Age","FieldLabel":"Age","FieldType":"input","FieldDataType":"numeric", "FieldDataStep":"1","FieldUnit":"year","FieldRequired":false},
    {"FieldName":"Comment","FieldLabel":"Comment","FieldType":"input","FieldDataType":"longtext"},
    ]

    showCustomArgs(container,params);    
}

function subject_modal(container, modal_id, title){
    var modal_root = $("<div/>").addClass("modal fade").attr("id",modal_id).attr("tabindex","-1");
    var modal_dialog = $("<div/>").addClass("modal-dialog modal-lg");
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

function show_subject_modal_add(container, table){
    var modal_id = "subject_modalAdd";
    var form_id = modal_id+"Form";

    container.find("#"+modal_id).remove();

    subject_modal(container, modal_id, "Add Subject from scratch");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    var modal_footer = modal.find(".modal-footer");
    
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var submitForm = $("<div/>");
    var submitButton = $("<button/>").addClass("btn btn-outline-dark w-100").attr("type","submit").html("Add Subject");
    submitForm.append(submitButton);

    subjectFormInputs(form);
    form.append(submitForm);

    
    $(modal).on('hidden.bs.modal',function(){
        // $( document ).trigger("_release",["add"]);
    })

    form.on('submit',function(e){
        e.preventDefault();
        var values = {};
        $.each($(this).serializeArray(), function(i, field) {
            var entries = $(form).find("[name='"+field.name+"'][data-value]");
            if(entries.length>0){
                var _entry = entries[0];
                var data_val = $(_entry).prop("data-value");
                values[field.name] = parse_val(data_val==""?null:data_val);
            }
            else{
                values[field.name] = parse_val(field.value==""?null:field.value);
                // values[field.name] = get_readable_value(form,form,field.name,field.value);
            }
            
        });

        subject_insert_ajax(values,function(){table.bootstrapTable('refresh')});
        modal.modal('hide');
        form[0].reset();
    });

    modal_footer.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })
    modal_body.append(form);

    modal.modal('show');
}

function show_subject_modal_edit(container, table, index){
    var modal_id = "subject_modalEdit";
    var form_id = modal_id+"Form";

    if(index>table.bootstrapTable('getData').length){
        return
    }
    var entry = table.bootstrapTable('getData')[index];

    setLock("subjects",[entry["SubjectIndex"]],update_subject_locks);
    
    container.find("#"+modal_id).remove();

    subject_modal(container, modal_id, "Edit Subject");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    var modal_footer = modal.find(".modal-footer");
    
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var submitForm = $("<div/>");
    var submitButton = $("<button/>").addClass("btn btn-outline-dark w-100").attr("type","submit").html("Alter Subject");
    submitForm.append(submitButton);

    subjectFormInputs(form);
    form.append(submitForm);
    modal_body.append(form);

    modal_footer.prepend($("<button/>").addClass("btn btn-outline-dark").attr("id","revert_form").attr("aria-label","Clear").html($("<i/>").addClass("fa fa-rotate-right me-2").attr("aria-hidden","true")).append("Revert"));

    modal_footer.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })  

    var modal = container.find("#"+modal_id);

    $(modal).on('hidden.bs.modal',function(){
        // $( document ).trigger("_release",["edit"]);
        releaseLock("subjects",update_subject_locks);
    })

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
    }

    $(modal).on('show.bs.modal', function () {                   
        init_fields(form,entry);
        // console.log(entry);
    })

    modal_footer.find("#revert_form").click(function(){
        init_fields(form,entry);
    })

    form.on('submit',function(e){
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
                // values[field.name] = get_readable_value(form,form,field.name,field.value);
            }
        });

        checkOwnLock("event_log",entry["SubjectIndex"],
                function(){


                    subject_update_ajax(entry["SubjectIndex"],values,function(){
                        table.bootstrapTable('refresh');
                        modal.modal('hide');
                        form[0].reset();
                });
                },
                function(){
                    var message = 'Resource lock has expired or taken.'
                    bootbox.alert(message);
                }
                )

    });

    modal.modal('show');
}

function show_subject_batch_modal_edit(container, table){
    var modal_id = "subjectBatchModalEdit";
    var form_id = modal_id+"Form";

    var selected =table.bootstrapTable("getSelections");

    if(selected.length==0){
        return
    }

    var candidate_indices = getCol(selected,"SubjectIndex");
    setLock("subjects",candidate_indices,update_subject_locks);


    container.find("#"+modal_id).remove();
    
    subject_modal(container, modal_id, "Batch edit selected subjects");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    var modal_footer = modal.find(".modal-footer");
    
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    subjectBatchFormInputs(form);
    modal_body.append(form);

    var modal_body_btns = $("<div/>").addClass("row");
    var btn_batch_duplicate = $("<button/>").addClass("btn btn-outline-dark w-100").attr("id","batch_duplicate").attr("aria-label","Duplicate subjects with new parameters").html($("<i/>").addClass("fa fa-copy me-2").attr("aria-hidden","true")).append("Duplicate subjects with new parameters");
    var btn_batch_update =$("<button/>").addClass("btn btn-outline-dark w-100").attr("id","batch_update").attr("aria-label","Update selected subjects").html($("<i/>").addClass("fa fa-arrows-rotate me-2").attr("aria-hidden","true")).append("Update selected subjects");
    modal_body_btns.append($("<div/>").addClass("col-md-6").append(btn_batch_duplicate));
    modal_body_btns.append($("<div/>").addClass("col-md-6").append(btn_batch_update));
    modal_body.append($("<div/>").append(modal_body_btns));

   
    $(modal).on('hidden.bs.modal',function(){
        // $( document ).trigger("_release",["batch_edit"]);
        form[0].reset();
        releaseLock("subjects",update_subject_locks);
        
    })

    modal_footer.find("#clear_form").click(function(){
        $(modal_body).find('form')[0].reset();
    })


    function read_settings(){
        var params = {};
        $.each($(form).serializeArray(), function(i, field) {
            // console.log(field);
            var parsed_val = parse_val(field.value);
            if(parsed_val!=null)
            params[field.name] = parsed_val;
            
        });
        return params;
    }

    btn_batch_duplicate.on("click",function(){
        
        var update_params = read_settings();
        // console.log(update_params);

        var message = 'You are going to duplicate the selected';
        message += selected.length == 1 ? ' subject': ' <b>'+ selected.length +'</b> subjects';
        if(Object.entries(update_params).length>0){
            message+=', with the following parameters updated:<br/>';
            // $.each(update_params,function(key,value){
            //     message += "<i>"+key+"</i>: "+ subjects_format_value(value,key)+"<br/>"; 
            // });

            var update_table = batch_update_formatter(update_params,subject_register_subject_formatter);
            message+=$(update_table).prop("outerHTML");
        }
        else{
            message+=".";
        }

        bootbox.confirm({
            message: message + '<br/>Do you want to proceed?',
            buttons: {
            confirm: {
            label: 'Yes',
            className: 'btn-outline-danger'
            },
            cancel: {
            label: 'No',
            className: 'btn-outline-dark'
            }
            },
            callback: function (result) {
                if(result){
                    var subject_info_list = []
                    $.each(selected,function(index,entry){
                        var subject_info = {... entry};
                        delete subject_info.SubjectIndex;
                        delete subject_info.LastChange;
                        delete subject_info.ModifiedBy;
                        delete subject_info.state;

                        $.each(update_params,function(key,value){
                            subject_info[key]=value;
                        });

                        subject_info_list.push(subject_info);
                    })
                    subject_insert_ajax(subject_info_list,function(){
                        table.bootstrapTable("refresh");
                        modal.modal("hide");
                    });
                }
            }
            });
    })

    btn_batch_update.on("click",function(){

        var update_params = read_settings();
        // console.log(update_params);

        var message = 'You are going to update the selected';
        message += selected.length == 1 ? ' subject': ' <b>'+ selected.length +'</b> subjects';
        if(Object.entries(update_params).length>0){
            message+=', with the following parameters updated:<br/>';
            // $.each(update_params,function(key,value){
            //     message += "<i>"+key+"</i>: "+ subjects_format_value(value,key)+"<br/>"; 
            // });
            var update_table = batch_update_formatter(update_params,subject_register_subject_formatter);
            message+=$(update_table).prop("outerHTML");
        }
        else{
            message+=".";
        }

        bootbox.confirm({
            message: message + '<br/>Do you want to proceed?',
            buttons: {
            confirm: {
            label: 'Yes',
            className: 'btn-outline-danger'
            },
            cancel: {
            label: 'No',
            className: 'btn-outline-dark'
            }
            },
            callback: function (result) {
                if(result){
                    // bundle multiple update together
                    var ajax_list = [];
                    $.each(selected, function(index,entry){
                        var ajax = subject_update_ajax(entry["SubjectIndex"],update_params,function(){},true);
                        ajax_list.push(ajax);
                    })
            
                    $.when.apply(this,ajax_list).then(function(){
                        // console.log("DONE!");
                        table.bootstrapTable("refresh");
                        modal.modal("hide");
                    })
                }
            }
            });
    })

    modal.modal('show');
}

function show_subject_modal_import(container,table){
    var modal_id = "subject_modalImport";
    var form_id = modal_id+"Form";

    container.find("#"+modal_id).remove();
    
    subject_modal(container, modal_id, "Import Subjects from CSV");

    var modal = container.find("#"+modal_id);
    var modal_body = modal.find(".modal-body");
    var modal_footer = modal.find(".modal-footer");

    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var file_input_group = $("<div/>").addClass("row mb-3");
    var file_label =  $("<label/>").addClass("col-md-3 col-form-label").html("Select .csv file");
    var file_input = $("<input/>").addClass("form-control").attr("type","file").attr("id","inputFileSelect").attr("name","inputFile");
    file_input.attr("accept",".csv")

    // var file_upload_btn = $("<span/>").addClass("btn btn-outline-dark form-control").attr("id","uploadBtn");
    // // file_upload_btn.html($("<span/>").addClass("bi bi-cloud-upload").append(" Upload"))
    // file_upload_btn.html($("<span/>").addClass("fa fa-cloud-upload").append(" Upload"))

    file_input_group.append(file_label);
    // file_input_group.append($("<div/>").addClass("col-md-6").append(file_input));
    file_input_group.append($("<div/>").addClass("col-md-9").append(file_input));
    // file_input_group.append($("<div/>").addClass("col-md-3").append(file_upload_btn));

    form.append(file_input_group);

    var study_selector = $("<div/>").addClass("row mt-3 mb-3");
    var study_dropdown = $("<select/>").addClass("form-control").attr("id","targetStudySelect").attr("type","text").prop("required",true);
    study_dropdown.append($("<option/>").html("Choose study...").prop('selected',true).attr("value",""));
    showAllDefs(study_dropdown,"studies","StudyID","StudyName","StudyName");

    study_selector.append($("<label/>").attr("for","studySelect").addClass("col-form-label col-md-3").html("Select target Study: "));
    study_selector.append($("<div/>").addClass("col-md-9").append(study_dropdown));

    form.append(study_selector);

    var instructions_group = $("<div/>").addClass("mb-3");
    instructions_group.append($("<label/>").attr("for","instruction_textarea").addClass("form-label").html("Instructions"));
    var instructions = $("<textarea/>").attr("rows",5).prop("disabled",true).attr("id","instruction_textarea").addClass("form-control");
    $(instructions).val("Import a specific CSV table from your local drive. Subjects will be added to the selected study.\n\nAccepted columns: \n\tID, Name, Group, Batch, Container, Location, Status, Age, Sex, Weight, Height\n(Unknown column names or values will be ignored.)");
    instructions_group.append(instructions);
    form.append($("<div/>").addClass("row").append(instructions_group));

    var table = $("<table/>").attr("id","modalImportTable");
    table.attr("data-locale","hu-HU");

    var table_container = $("<div/>").addClass("mb-3");
    table_container.append(table);
    form.append(table_container);


    var submitForm = $("<div/>");
    var submitButton = $("<button/>").addClass("btn btn-outline-dark w-100").attr("type","submit").html("Import Subjects");
    submitForm.append(submitButton);

    modal_footer.find("#clear_form").click(function(){
        table.bootstrapTable("destroy");
    })
    
    form.append(submitForm);
    modal_body.append(form);

    // table.bootstrapTable();

    // file_input_group.find("#uploadBtn").on("click",function(){
    file_input.on("change",function(){
        const fileInput = document.getElementById("inputFileSelect");
        const selectedFiles = fileInput.files;

        if(selectedFiles.length==0){
            return;
        }
        
        const reader = new FileReader();

        reader.onload = function(res) {
            //parse csv data
            var data = res.target.result;

            var object_list = $.csv.toObjects(data);

            var columns = [];

            $.each(object_list[0], function( key, value ) {
                    var _item = {};
                    _item.field = key;
                    _item.title = key;
                    columns.push(_item);
            });

            $.each(object_list,function(index){
                let obj = object_list[index];
                $.each(obj,function(key,value){
                    if(value=="'-"){
                        object_list[index][key]="-";
                    }
                    else if(!isNaN(value)){
                        object_list[index][key] = +object_list[index][key];
                    }
                })
            });
            // console.log(object_list);

            table.bootstrapTable("destroy").bootstrapTable({
                "columns": columns,
                data: object_list
            });
            // console.log(table.bootstrapTable('getData'))
        };
        reader.readAsText(fileInput.files[0]);
    });

    form.on('submit',function(e){
        e.preventDefault();

        var data = table.bootstrapTable('getData');

        var selected_study = $(study_dropdown).val();
        var selected_study_name = getDefEntryFieldWhere("studies","StudyID",selected_study,"StudyName")

        bootbox.confirm({
            message: 'You are going to import '+ data.length +' subjects to study "'+ selected_study_name +'".<br>Do you want to proceed?',
            buttons: {
            confirm: {
            label: 'Yes',
            className: 'btn-outline-danger'
            },
            cancel: {
            label: 'No',
            className: 'btn-outline-dark'
            }
            },
            callback: function (result) {
                if(result){
                    // validate data
                    var validated_elements = [];
                    $.each(data,function(index){
                        let element = data[index];
                        
                        var validated_element = {};
                        validated_element["StudyID"] = selected_study;
                        validated_element["SubjectID"] = element["ID"];
                        
                        var safe_args = ["Name","Group","Batch","Container","Age","Weight","Height"];
                        $.each(safe_args,function(index,value){
                            if(element.hasOwnProperty(value))
                                validated_element[value] = element[value];
                        });

                        if(element.hasOwnProperty("Location"))
                            validated_element["Location"] = getDefEntryFieldWhere("location_definitions","LocationName",element["Location"],"LocationID");
                        
                        if(element.hasOwnProperty("Sex"))
                            validated_element["Sex"] = getDefEntryFieldWhere("sex_definitions","SexName",element["Sex"],"SexID");
                        
                        if(element.hasOwnProperty("Status"))
                            validated_element["Status"] = getDefEntryFieldWhere("subject_status_definitions","StatusName",element["Status"],"StatusID");
                        
                        // console.log(validated_element);
                        validated_elements.push(validated_element)
                        
                    });

                    subject_insert_ajax(validated_elements);

                    modal.modal('hide');
                    modal.on('hidden.bs.modal',function(e){
                                form[0].reset();
                                $('#'+subject_table_id).bootstrapTable('refresh');
                                });
                    }
            }
            });


    });

    modal.modal('show');
}

function subjects_table_events(){
    var table = $('#'+subject_table_id);
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
}

function show_subject_register(container){
    createSubjectTable(container,subject_table_id);
    
    var table = $('#'+subject_table_id);

    var toolbar = container.find(".fixed-table-toolbar");

    subject_content = $("<div/>").attr("id","subjectManagerModalContainer");
    container.append(subject_content);


    toolbar.find("#toolbar_add").on("click", function(){
        show_subject_modal_add(subject_content, table);
        // $(document).trigger("_lock",["add"]);
    });

    toolbar.find("#toolbar_duplicate").on("click",function(e){
        var selected =table.bootstrapTable("getSelections");

        var data = [];

        $.each(selected, function(index, entry){
            var _data = {... entry};

            delete _data["SubjectIndex"];
            delete _data["LastChange"];
            delete _data["ModifiedBy"];
            delete _data["state"];

            $.each(_data,function(key){
                // if(_data[key]==null) delete _data[key];
                _data[key] = parse_val(_data[key]);
            })
            data.push(_data);
        });

        subject_insert_ajax(data,function(){table.bootstrapTable("refresh")});
    })


    toolbar.find("#toolbar_batch_edit").on("click", function(){
        var entries = table.bootstrapTable("getSelections");
        var candidate_indices = getCol(entries,"SubjectIndex");

        subject_lock_check(entries,candidate_indices,function(){
            show_subject_batch_modal_edit(subject_content, table);
        });

        // $(document).trigger("_lock",["batch_edit"]);
    });

    
    toolbar.find("#toolbar_import").on("click", function(){
        show_subject_modal_import(subject_content,table);
        // $(document).trigger("_lock",["import"]);
    });

    toolbar.find(".needs-select").addClass("disabled");

    // table.on('all.bs.table',function(args,name){
    //     console.log(name)
    // })
    

    table.on('load-success.bs.table',function(args,name){
        update_subject_locks();
    })

    subjects_table_events();
    
    subjects_lock_interval = setInterval(update_subject_locks,5000);

}

