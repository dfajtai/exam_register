var subject_pool_editor_table_id  = "subejctEditorTable";
var subject_pool_editor_modals  = {};

function insert_data(indices, callback = null){
    var table = $("#"+subject_pool_editor_table_id);

    $.ajax({
        type: "GET",
        url: 'php/retrieve_table_where.php',
        dataType: "json",
        data: ({table_name:"subjects",where:{"SubjectIndex": indices}}),
        success: function (result) {
            var ids = getCol(table.bootstrapTable("getData"),"SubjectIndex");
            var data = [];

            var lookup = Object.fromEntries(result.map(x=>[x.SubjectIndex,x]));
            $.each(indices,function(_index,index){
                if(!ids.includes(index)){
                    data.push(lookup[index]);
                    ids.push(index);
                }
            })
            table.bootstrapTable("append",data);
            if(data.length!=result.length){
                var message = 'Some subject had been already added to the pool.'
                bootbox.alert(message);
            }


            if(callback!=null) callback();
        },
        error: function(er){
            var message = 'Unable to insert data.'
            bootbox.alert(message);
        }
    });
}

function update_load_data(data, update = false){
    var table = $("#"+subject_pool_editor_table_id);

    var indices = nullify_array(getCol(data,"SubjectIndex"));
    indices = indices === null? []:indices;
    if(indices.length>0){
        $.ajax({
            type: "GET",
            url: 'php/retrieve_table_where.php',
            dataType: "json",
            data: ({table_name:"subjects",where:{"SubjectIndex": indices}}),
            success: function (result) {
                if(update){
                    var old_data = table.bootstrapTable("getData");
                    var lookup = Object.fromEntries(result.map(x=>[x.SubjectIndex,x]));
                    $.each(old_data,function(index,data){
                        table.bootstrapTable("updateRow",{index:index,row:lookup[data["SubjectIndex"]]});
                    })
                }
                else{
                    table.bootstrapTable("load",result);
                }           
            },
            error: function(er){
                var message = 'Unable to load/refresh data.'
                bootbox.alert(message);
            }
        });
    }
}

window.subject_pool_editor_events = {
    'click .move_up': function (e, value, row, index) {
        if(index==0){
            return
        }
        var data = $('#'+subject_pool_editor_table_id).bootstrapTable('getData');
        var upper_data = {... data[index-1]};
        upper_data.state = upper_data.state===undefined ? false : upper_data.state;
        $('#'+subject_pool_editor_table_id).bootstrapTable('updateRow',[{index:index-1,row:row},{index:index, row:upper_data}]);


    },
    'click .move_down': function (e, value, row, index) {
        var data = $('#'+subject_pool_editor_table_id).bootstrapTable('getData');
        if(index==data.length-1){
            return
        }
        var lower_data = {... data[index+1]};
        lower_data.state = lower_data.state === undefined ? false : lower_data.state;
        $('#'+subject_pool_editor_table_id).bootstrapTable('updateRow',[{index:index+1,row:row},{index:index, row:lower_data}]);

    },
    'click .remove': function (e, value, row, index) {
        $('#'+subject_pool_editor_table_id).bootstrapTable('remove', {
            field: '$index',
            values: [index]
            });
        $('#'+subject_pool_editor_table_id).bootstrapTable("resetSearch"); // to call the formatter...
        $('#'+subject_pool_editor_table_id).bootstrapTable("uncheckAll");
    }
}

function subject_pool_operate_formatter(value, row, index){
    var container = $("<div/>").addClass("lockable");
    var up_down_gorup = $("<div/>").addClass("btn-group me-3 ");
    var btn_up = $("<button/>").attr("type","button").addClass("btn btn-outline-secondary btn-sm move_up lockable").append($("<i/>").addClass("fa fa-angle-up"));
    var btn_down = $("<button/>").attr("type","button").addClass("btn btn-outline-secondary btn-sm move_down lockable").append($("<i/>").addClass("fa fa-angle-down"));
    btn_up.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Move up");
    btn_down.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Move down");

    up_down_gorup.append(btn_up)
    up_down_gorup.append(btn_down)
    container.append(up_down_gorup);

    var btn_remove = $("<button/>").addClass("btn btn-outline-danger btn-sm remove lockable").append($("<i/>").addClass("fa fa-trash"));
    btn_remove.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Remove");

    container.append(btn_remove)


    if (index==0){
        btn_up.addClass("disabled").removeClass("lockable");
    }
    if(index==$('#'+subject_pool_editor_table_id).bootstrapTable('getData').length-1){
        btn_down.addClass("disabled").removeClass("lockable");
    }

    return container.prop("outerHTML");
}

function subject_pool_modal_add(container){
    container.empty();

    var modal_id = "subjectPoolEditorModal";
    var form_id = "subjectPoolEditorForm";
    var subject_selector_table_id = "ubjectPoolEditorSubjectSelectorTable";
    
    subject_modal(container,modal_id,"Select subject(s)");
    var modal = $(container).find("#"+modal_id);

    var dialog = modal.find(".modal-dialog");
    if(dialog){
        dialog.removeClass("modal-lg").addClass("modal-xl");
    }

    var modal_body = modal.find(".modal-body");

    var modal_footer = modal.find(".modal-footer");
    modal_footer.empty();

    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    var subject_container = $("<div/>").attr("id","subjectSelector").addClass("mb-3 container");

    var submitForm = $("<div/>").addClass("row mb-3 text-center px-5");
    var submitButton = $("<button/>").addClass("btn btn-outline-dark").attr("type","submit").html("Add selected subject(s) to the pool");
    submitForm.append(submitButton);

    form.append(subject_container);
    form.append(submitForm);
    
    modal_body.append(form);


    $(modal).on('show.bs.modal',function(){
        createSubjectTable(subject_container,subject_selector_table_id,true);
        var subject_table = form.find("#"+subject_selector_table_id);
        subject_table.bootstrapTable('hideColumn', ['operate','locked','LastChange']);
        
    });


    $(form).on('submit',function(e){
        e.preventDefault();

        var subject_table = subject_container.find("#"+subject_selector_table_id);
        var selected_subjects = $(subject_table).bootstrapTable("getSelections");

        if(selected_subjects.length==0){
            var message = "Please select at least one subject.";
            bootbox.alert(message);
            return;
        };

        var selected_subject_indices = getCol(selected_subjects,"SubjectIndex");
        insert_data(selected_subject_indices,function(){
            modal.modal("hide");
        });
    })

    modal.modal("show");
}

function subject_pool_modal_export(container,table){
    container.empty();

    var modal_id = "subjectPoolEditorModal";
    

    var modal_root = $("<div/>").addClass("modal fade").attr("id",modal_id).attr("tabindex","-1");
    var modal_dialog = $("<div/>").addClass("modal-dialog modal-md");
    var modal_content = $("<div/>").addClass("modal-content");

    var modal_header= $("<div/>").addClass("modal-header");
    modal_header.append($("<h5/>").addClass("modal-title display-3 fs-3").html("Subject pool export"));
    modal_header.append($("<button/>").addClass("btn-close").attr("data-bs-dismiss","modal").attr("aria-label","Close"));

    var modal_body = $("<div/>").addClass("modal-body d-inline-flex  flex-column justify-content-center");

    var pool_url = $("<textarea/>").addClass("w-100 mb-2").attr("rows",3).attr("readonly",true);
    modal_body.append(pool_url);
    var qrcode_dom = $("<div/>").attr("id","qrcode");
    modal_body.append(qrcode_dom);

    
    modal_content.append(modal_header);
    modal_content.append(modal_body);

    modal_dialog.html(modal_content);
    modal_root.html(modal_dialog);


    var full_url = null;

    $(modal_root).on('show.bs.modal',function(){
        var indices = getColUnique($(table).bootstrapTable("getData"),"SubjectIndex");
        var indices_text = JSON.stringify(indices);
        // console.log(indices_text);
        var searchParams = new URLSearchParams();
        searchParams.set("setSubjectPool",indices_text);
        full_url =  window.location.host+'?' + searchParams.toString();

        $(pool_url).val(full_url);
        setSubjectPool(indices);

    });

    $(modal_root).on('shown.bs.modal',function(){
        $(qrcode_dom).css({width:$(pool_url).width(),height:$(pool_url).width()});

        // qrcode gen
        var qrcode = new QRCode("qrcode",{
            text: full_url,
            width: $(pool_url).width(),
            height: $(pool_url).width(),
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    });

    container.append(modal_root);

    if($(table).bootstrapTable("getData").length==0){
        var message = 'The subject pool is empty.'
        bootbox.alert(message);
    }
    else{
        modal_root.modal("show");
    }
    
}

function subject_pool_modal_export_by_subjects(container,table){
    container.empty();

    var modal_id = "subjectPoolEditorModal";
    

    var modal_root = $("<div/>").addClass("modal fade").attr("id",modal_id).attr("tabindex","-1");
    var modal_dialog = $("<div/>").addClass("modal-dialog modal-xl modal-dialog-scrollable");
    var modal_content = $("<div/>").addClass("modal-content");

    var modal_header= $("<div/>").addClass("modal-header");
    modal_header.append($("<h5/>").addClass("modal-title display-3 fs-3").html("Subject pool export"));
    modal_header.append($("<button/>").addClass("btn-close").attr("data-bs-dismiss","modal").attr("aria-label","Close"));

    var modal_body = $("<div/>").addClass("modal-body d-inline-flex  flex-column justify-content-center");

    var _table = $("<table/>").addClass("w-100 table table-bordered align-middle").attr("id","table");
    
    var names = ["#","ID","Name",'Study','Batch','Group','QR'];
    var keys = ['SubjectID','Name','StudyID','Batch','Group','QR'];


    var header_row = $("<tr/>");
    $.each(names,function(name_index,name){
        header_row.append($("<th/>").html(name).attr("scope","col").addClass("text-center"));
    })
    _table.append($("<thead/>").addClass("table-dark").append(header_row));

    var table_body = $("<tbody/>");
        
    
    var data = $(table).bootstrapTable("getData");
    var qr_doms = [];
    $.each(data,function(row_index,row){
        var row_dom = $("<tr/>");
        row_dom.append($("<th/>").html(row_index+1).attr("scope","row").css({"text-align": "center"}));
        $.each(keys,function(key_index,key){
            if(key=='QR'){
                var qr_dom = $("<div/>").attr('id','qrcode'+row_index);
                qr_dom.addClass("m-1");
                row_dom.append($("<td/>").append(qr_dom).attr("align","center"));
                qr_doms.push({dom:qr_dom, SubjectIndex: row['SubjectIndex']});
            }
            else{
                if(key=='StudyID'){
                    var _val = studyFormatter(row[key]);
                }
                else{
                    var _val = nullify_obj(row[key]);
                }
                
                var _val = parse_val(_val);
                row_dom.append($("<td/>").html(_val == null ? "-":_val).addClass("border"));
            }
    
        })
        table_body.append(row_dom);

    })

    _table.append(table_body);
    
    modal_body.append($("<div/>").addClass("table-responsive text-nowrap").append(_table));    


    var to_pdf_btn = $("<button/>").addClass("btn btn-outline-dark mt-2 w-100").html("Export to pdf");
    var modal_footer= $("<div/>").addClass("modal-footer");
    modal_footer.append(to_pdf_btn);
    
    modal_content.append(modal_header);
    modal_content.append(modal_body);
    modal_content.append(modal_footer);

    modal_dialog.html(modal_content);
    modal_root.html(modal_dialog);

    var imsize = 100;

    $(modal_root).on('show.bs.modal',function(){
        $.each(qr_doms,function(index,qr_info){
            var dom = qr_info["dom"];
            var SubjectIndex = qr_info["SubjectIndex"];
    
            var searchParams = new URLSearchParams();
            searchParams.set("subjectIndex",SubjectIndex);
            var url =   window.location.host+'?' + searchParams.toString();       
    
            // qrcode gen
            var qrcode = new QRCode("qrcode"+index,{
                text: url,
                width: imsize,
                height: imsize,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.L
            });
            
        })
    });

    $(to_pdf_btn).on("click",function(){
        const doc = new jspdf.jsPDF('p', 'mm', [297, 210]);

        doc.autoTable({
            html: "#table",
            theme:"grid",
            styles: { cellPadding: 0, fontSize: 10, overflow: 'linebreak', },
            bodyStyles: {minCellHeight: (imsize/4)*1.2},
            pageBreak: 'auto',
            rowPageBreak: 'avoid',
            columnStyles: {
                0: {cellWidth: 10, halign:'center',valign:'middle'},
                1: {cellWidth: 25, halign:'center',valign:'middle' },
                2: {cellWidth: 25, halign:'center',valign:'middle' },
                3: {cellWidth: 25, halign:'center',valign:'middle' },
                4: {cellWidth: 25, halign:'center',valign:'middle' },
                5: {cellWidth: 25, halign:'center',valign:'middle' },
                6: {cellWidth: (imsize/4)*1.2, halign:'center',valign:'middle' },
            },
            headStyles:{valign: 'middle',  halign : 'center',  fillColor : [0, 0, 0], padding:2, minCellHeight:10},
            didDrawCell: function(data) {
            if (data.column.index === 6 && data.cell.section === 'body') {
                var td = data.cell.raw;
                var img = $(td).find('img').first();
                doc.addImage(img.prop("src"), data.cell.x+2 ,
                 data.cell.y+2 , imsize/4, imsize/4);
            }
            }
        });

        doc.save("subject_pool.pdf");

    })


    container.append(modal_root);

    if($(table).bootstrapTable("getData").length==0){
        var message = 'The subject pool is empty.'
        bootbox.alert(message);
    }
    else{
        modal_root.modal("show");
    }
    
}

function init_subject_pool_table(container, table_id, ){
    var table = $("<table/>").attr("id",table_id);

    var toolbar = $("<div/>").attr("id",table_id+"_toolbar");
    toolbar.append($("<button/>").attr("id","toolbar_add").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-plus me-2").attr("aria-hidden","true")).append("Add New subject(s)"));
    toolbar.append($("<button/>").attr("id","toolbar_removeSelected").addClass("btn btn-outline-danger admin-table-toolbar-btn needs-select lockable").html($("<i/>").addClass("fa fa-trash fa-solid me-2").attr("aria-hidden","true")).append("Remove").attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Remove selected subjects from the pool"));
    toolbar.append($("<button/>").attr("id","toolbar_load_data").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-arrows-rotate me-2").attr("aria-hidden","true")).append("Load/refresh data"));
    toolbar.append($("<button/>").attr("id","toolbar_export").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-solid fa-qrcode me-2").attr("aria-hidden","true")).append("Export"));
    toolbar.append($("<button/>").attr("id","toolbar_export_by_subjects").addClass("btn btn-outline-dark admin-table-toolbar-btn lockable").html($("<i/>").addClass("fa fa-solid fa-qrcode me-2").attr("aria-hidden","true")).append("Export by subjects"));

    // table.attr("data-height",String(height));

    table.attr("data-toolbar","#"+table_id+"_toolbar");
    table.attr("data-toolbar-align","left");


    table.attr("data-pagination","false");
    table.attr("data-show-pagination-switch","false");
    table.attr("data-page-list","[10, 25, 50, 100, all]");

    table.attr("data-show-footer","false");

    table.attr("data-search","true");
    table.attr("data-regex-search","true");
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

    var table_container = $("<div/>").addClass("row mt-2");
    
    table_container.append(table);
    table_container.append(toolbar);
    container.append(table_container)

    table.bootstrapTable({
        columns : [
            {field : 'state', checkbox: true, align:'center'},
            {title: '', field: 'operate', align: 'center', sortable:false, searchable:false, clickToSelect : false,
            events: window.subject_pool_editor_events, formatter: subject_pool_operate_formatter},
            {title: '#', field : 'SubjectIndex', align:'center', sortable:false, searchable:true, visible:false},
            {title: 'ID', field : 'SubjectID', align:'center', sortable:false, searchable:true},
            {title: 'Name', field : 'Name', align:'center', sortable:false, searchable:true},
            {title: 'Study', field : 'StudyID', align:'center', sortable:false, searchable:true, formatter: studyFormatter},
            {title: 'Batch', field : 'Batch', align:'center', sortable:false, searchable:true},
            {title: 'Group', field : 'Group', align:'center', sortable:false, searchable:true},
        ],
        pagination:true,
        checkboxHeader:true,
        smartDisplay:true,
        detailFormatter: function(index,row){return detail_as_table_formatter(index,row,subject_register_subject_formatter)},
    });
}




function showSubjectPoolEditor(container, initial_indices = null){
    subject_pool_editor_content = container;
    init_subject_pool_table(subject_pool_editor_content, subject_pool_editor_table_id);

    var table = $('#'+subject_pool_editor_table_id);
    var toolbar = container.find(".fixed-table-toolbar");

    if(initial_indices==null){
        if(statusInStorage("subjectPoolData")){
            var data = JSON.parse(statusFromStorage("subjectPoolData"));
            var indices = nullify_array(getCol(data,"SubjectIndex"));
            indices = indices === null? []:indices;
            if(indices.length>0){
                insert_data(indices);
            }
            setSubjectPool(indices);
        }
    }
    else{
        setSubjectPool(initial_indices);
        if(subject_pool.length>0){
            insert_data(subject_pool);
        }
    }



    subject_pool_editor_modals  = $("<div/>");
    container.append(subject_pool_editor_modals);

    toolbar.find(".needs-select").addClass("disabled");

    toolbar.find("#toolbar_removeSelected").on("click",function(e){
        bootbox.confirm({
            message: 'You are going to remove the selected subjects from the pool. Do you want to proceed?',
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
                    var indices = [];


                    $(table).find('input[name="btSelectItem"]:checked').each(function(){
                        indices.push($(this).data('index'));
                    })
                    // console.log(indices);
                    table.bootstrapTable("remove",{field:"$index",values:indices});
                    statusToStorage("subjectPoolData",JSON.stringify(table.bootstrapTable('getData')));

                    $('#'+subject_pool_editor_table_id).bootstrapTable("resetSearch"); // to call the formatter...
                    $('#'+subject_pool_editor_table_id).bootstrapTable("uncheckAll");
                }
            }
            });


    })

    toolbar.find("#toolbar_add").on("click",function(e){
        subject_pool_modal_add(subject_pool_editor_modals);
    })

    toolbar.find("#toolbar_load_data").on("click",function(e){
        update_load_data(table.bootstrapTable("getData"),true);
    })

    toolbar.find("#toolbar_export").on("click",function(e){
        subject_pool_modal_export(subject_pool_editor_modals,table);
    })

    toolbar.find("#toolbar_export_by_subjects").on("click",function(e){
        subject_pool_modal_export_by_subjects(subject_pool_editor_modals,table);
    })

    table.on('all.bs.table',
    // table.on('check.bs.table check-all.bs.table check-some.bs.table uncheck.bs.table uncheck-all.bs.table uncheck-some.bs.table',
        function(){
            var selection =  table.bootstrapTable('getSelections');
            if(selection.length>0){
                toolbar.find(".needs-select").removeClass("disabled");
            }
            else{
                toolbar.find(".needs-select").addClass("disabled");
            }
        }
    )

    table.on('post-body.bs.table',function(event,data){
        // console.log(data);
        if(table.bootstrapTable('getOptions').searchText==""){
            statusToStorage("subjectPoolData",JSON.stringify(data));
            var indices = getColUnique(data,"SubjectIndex");
            setSubjectPool(indices);

        }
    })

    // table.on('all.bs.table',function(args,name){
    //     console.log(name)
    // })


    container.append(subject_pool_editor_content);
}