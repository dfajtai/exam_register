function modalInsertForm(container, form_id, form_input_function, table, modal, insert_ajax){
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    form_input_function(form);

    var submitForm = $("<div/>").addClass("row mb-3 text-center");
    var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Add new");
    submitForm.append(submitButton);


    form.append(submitForm);

    form.on('submit',function(e){
        e.preventDefault();
        var values = {};
        $.each($(this).serializeArray(), function(i, field) {
            if(field.name.includes("JSON")){
                values[field.name]= field.value;
            }
            else{
                values[field.name] = field.value;
            }
        });
        
        insert_ajax(values,function(){table.bootstrapTable('refresh')});
        modal.modal('hide');
        form[0].reset();
    });
    container.append(form);
}

function removeModalInsert(table_id){
    var toolbar_id = table_id + "_toolbar";
    var toolbar = $("#"+toolbar_id)
    toolbar.find("#toolbar_add").remove();
}

function modalInsert(data_name, container, modal_id, table_id,
    form_input_function, insert_ajax){

    var table = $("#"+table_id);

    var toolbar_id = table_id + "_toolbar";
    var toolbar = $("#"+toolbar_id)
    
    var modal_root = $("<div/>").addClass("modal fade").attr("id",modal_id).attr("tabindex",-1);
    var modal_dialog = $("<div/>").addClass("modal-dialog");
    var modal_content = $("<div/>").addClass("modal-content");

    var modal_header= $("<div/>").addClass("modal-header");
    modal_header.append($("<h5/>").addClass("modal-title display-3 fs-3").html("Add new "+data_name));
    modal_header.append($("<button/>").addClass("btn-close").attr("data-bs-dismiss","modal").attr("aria-label","Close"));


    var modal_body = $("<div/>").addClass("modal-body");

    var modal_footer= $("<div/>").addClass("modal-footer");
    modal_footer.append($("<button/>").addClass("btn btn-success").attr("id","copy_selected").attr("aria-label","Copy Selected").html($("<i/>").addClass("fa fa-copy").attr("aria-hidden","true")).append(" Copy Selected"));
    modal_footer.append($("<button/>").addClass("btn btn-danger").attr("id","clear_form").attr("aria-label","Clear").html($("<i/>").addClass("fa fa-eraser").attr("aria-hidden","true")).append(" Clear"));
    modal_footer.append($("<button/>").addClass("btn btn-secondary").attr("data-bs-dismiss","modal").attr("aria-label","Close").html("Close"));

    modal_content.append(modal_header);
    modal_content.append(modal_body);
    modal_content.append(modal_footer);

    modal_dialog.html(modal_content);
    modal_root.html(modal_dialog);
    container.append(modal_root);

    modalInsertForm(modal_body, "add_new_form", form_input_function, table, modal_root, insert_ajax);

    toolbar.find("#toolbar_add").click(function(){
        $('#'+modal_id).modal('show');
    });

    modal_footer.find("#clear_form").click(function(){
        modal_body.find('#add_new_form')[0].reset();
    })


    modal_footer.find("#copy_selected").click(function(){
        var selection =  table.bootstrapTable('getSelections');
        if(selection.length>0){
            selection=selection[0];
        }
        else{
            return;
        }
        modal_body.find('#add_new_form').find("input[name]").each(function(){
            var name = $(this).attr("name");
            if(name in selection){
                $(this).val(selection[name]).trigger("change");
            }
        });
        modal_body.find('#add_new_form').find("textarea[name]").each(function(){
            var name = $(this).attr("name");
            if(name in selection){
                if(name.includes("JSON")){
                    let pretty_json = JSON.stringify(JSON.parse(selection[name]),null,2)
                    // console.log(pretty_json);
                    // $(this).val(selection[name]);

                    // $(this).val(pretty_json);
                    $(this).val(selection[name]);
                }
                else{
                    $(this).val(selection[name]);
                }
                
            }
        });
        modal_body.find('#add_new_form').find("select[name]").each(function(){
            var name = $(this).attr("name");
            if(name in selection){
                $(this).val(selection[name]);
            }
        });

    })
}

function modalUpdateForm(container, form_id, form_input_function, table, modal, update_ajax, key_name){
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

    form_input_function(form);

    var submitForm = $("<div/>").addClass("row mb-3 text-center");
    var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Save changes");
    submitForm.append(submitButton);

    form.append(submitForm);

    var indices = [];


    $(modal).on('show.bs.modal', function () {
            indices = [];
            var selection =  table.bootstrapTable('getSelections');

            if(selection.length>0){
                selection=selection[0];
                submitButton.removeClass("disabled");
            }
            else{
                return;
            }
                        
            $('input[name="btSelectItem"]:checked').each(function(){
                indices.push($(this).data('index'));
            })

            form.find("input[name]").each(function(){
                var name = $(this).attr("name");
                if(name in selection){
                    $(this).val(selection[name]).trigger("change");
                }
            });
            form.find("textarea[name]").each(function(){
                var name = $(this).attr("name");
                if(name in selection){
                    if(name.includes("JSON")){
                        let pretty_json = JSON.stringify(JSON.parse(selection[name]),null,2)
                        // console.log(pretty_json);
                        // $(this).val(selection[name]);

                        // $(this).val(pretty_json);
                        $(this).val(selection[name]);
                    }
                    else{
                        $(this).val(selection[name]);
                    }
                }
            });
            
            form.find("select[name]").each(function(){
                var name = $(this).attr("name");
                if(name in selection){
                    $(this).val(selection[name]);
                }
            });
      })


    table.on('check.bs.table check-all.bs.table',
    function () {
        var selection =  table.bootstrapTable('getSelections');
        if(selection.length>0){
            selection=selection[0];
            submitButton.removeClass("disabled");
        }
        else{
            return;
        }
    });

    table.on('uncheck.bs.table uncheck-all.bs.table refresh.bs.table',
    function () {
        var selection =  table.bootstrapTable('getSelections');
        form[0].reset();
        if(selection.length==0){
            selection=selection[0];
            submitButton.addClass("disabled");
        }
    });

    form.on('submit',function(e){
        e.preventDefault();
        var selection =  table.bootstrapTable('getSelections');
        if(selection.length>0){
            selection=selection[0];
        }
        else{
            return;
        }
        if(! form[0].checkValidity()){
            form[0].reportValidity();
            return;
        }

        var key_info = {key:key_name,value:selection[key_name]}

        var values = {};
        form.find("input[name]").each(function(){
            values[$(this).attr("name") ] = $(this).val();
        });
        form.find("textarea[name]").each(function(){
            var name = $(this).attr("name");
            if(name.includes("JSON")){
                values[name] = $(this).val();
            }
            else{
                values[name] = $(this).val();
            }

        });
        form.find("select[name]").each(function(){
            values[$(this).attr("name") ] = $(this).val();
        });

        update_ajax(key_info,values,function(){table.bootstrapTable('refresh')});
        modal.modal('hide');
        form[0].reset();
    });

    container.append(form);
}

function removeModalUpdate(table_id){
    var toolbar_id = table_id + "_toolbar";
    var toolbar = $("#"+toolbar_id)
    toolbar.find("#toolbar_edit").remove();
}

function modalUpdate(data_name, container, modal_id, table_id,
    form_input_function, update_ajax,key_name){

    var table = $("#"+table_id);

    var toolbar_id = table_id + "_toolbar";
    var toolbar = $("#"+toolbar_id)
    
    var modal_root = $("<div/>").addClass("modal fade").attr("id",modal_id).attr("tabindex",-1);
    var modal_dialog = $("<div/>").addClass("modal-dialog");
    var modal_content = $("<div/>").addClass("modal-content");

    var modal_header= $("<div/>").addClass("modal-header");
    modal_header.append($("<h5/>").addClass("modal-title display-3 fs-3").html("Edit selected "+data_name));
    modal_header.append($("<button/>").addClass("btn-close").attr("data-bs-dismiss","modal").attr("aria-label","Close"));


    var modal_body = $("<div/>").addClass("modal-body");

    var modal_footer= $("<div/>").addClass("modal-footer");
    modal_footer.append($("<button/>").addClass("btn btn-danger").attr("id","clear_form").attr("aria-label","Clear").html($("<i/>").addClass("fa fa-arrow-rotate-right me-2").attr("aria-hidden","true")).append("Revert"));
    modal_footer.append($("<button/>").addClass("btn btn-secondary").attr("data-bs-dismiss","modal").attr("aria-label","Close").html("Close"));

    modal_content.append(modal_header);
    modal_content.append(modal_body);
    modal_content.append(modal_footer);

    modal_dialog.html(modal_content);
    modal_root.html(modal_dialog);
    container.append(modal_root);


    modalUpdateForm(modal_body, "edit_form", form_input_function, table, modal_root, update_ajax, key_name);

    table.on('check.bs.table uncheck.bs.table ' +
    'check-all.bs.table uncheck-all.bs.table load-success.bs.table',
    function () {
        var selection =  table.bootstrapTable('getSelections');
        if(selection.length>0){
            toolbar.find("#toolbar_edit").removeClass("disabled");
        }
        else{
            toolbar.find("#toolbar_edit").addClass("disabled");
        }
    });

    toolbar.find("#toolbar_edit").addClass("disabled");

    toolbar.find("#toolbar_edit").click(function(){
        $('#'+modal_id).modal('show');
    });

    modal_footer.find("#clear_form").click(function(){
        var selection =  table.bootstrapTable('getSelections');
        if(selection.length>0){
            selection=selection[0];
        }
        else{
            return;
        }
        modal_body.find("input[name]").each(function(){
            var name = $(this).attr("name");
            if(name in selection){
                $(this).val(selection[name]);
            }
        });
        modal_body.find("textarea[name]").each(function(){
            var name = $(this).attr("name");
            if(name in selection){
                if(name.includes("JSON")){
                    let pretty_json = JSON.stringify(JSON.parse(selection[name]),null,2)
                    console.log(pretty_json);
                    // $(this).val(selection[name]);
                    $(this).val(pretty_json);
                }
                else{
                    $(this).val(selection[name]);
                }
            }
        });
        modal_body.find("select[name]").each(function(){
            var name = $(this).attr("name");
            if(name in selection){
                $(this).val(selection[name]);
            }
        });
    })
}