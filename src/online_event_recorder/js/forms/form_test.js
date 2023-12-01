function createUnitTypeDefinitionsForm(container, form_id, table){
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");
    var formTitle = $("<h4/>").addClass("display-4 fs-1").html("Add new unit type definition");

    var nameForm = $("<div/>").addClass("row mb-3");
    nameForm.append($("<label/>").addClass("col-sm-2 col-form-label").html("Name"));
    var nameInput = $("<div/>").addClass("col-sm-4");
    nameInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","name").attr("name","UnitTypeName").prop('required',true));
    nameForm.append(nameInput);

    var descForm = $("<div/>").addClass("row mb-3");
    descForm.append($("<label/>").addClass("col-sm-2 col-form-label").html("Description"));
    var descInput = $("<div/>").addClass("col-sm-4");
    descInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","desc").attr("name","UnitTypeDesc").prop('required',true));
    descForm.append(descInput);
    
    var submitForm = $("<div/>").addClass("row mb-3");
    submitForm.append($("<button/>").addClass("col-sm-2 ms-2 btn btn-primary").attr("type","subbmit").html("Add as New"));
    submitForm.append($("<button/>").addClass("col-sm-2 ms-2 btn btn-primary").attr("id","update").attr("type","button").html("Update Selected"));

    form.append(formTitle);
    form.append(nameForm);
    form.append(descForm);
    form.append(submitForm);

    form.on('submit',function(e){
        e.preventDefault();
        var values = {};
        $.each($(this).serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });
        unit_type_definition_insert_ajax(values,function(){table.bootstrapTable('refresh')});

    });

    table.on('check.bs.table uncheck.bs.table ' +
      'check-all.bs.table uncheck-all.bs.table',
    function () {
        var selection =  table.bootstrapTable('getSelections');
        if(selection.length>0){
            selection=selection[0];
        }
        else{
            return;
        }
        form.find("input[name]").each(function(){
            var name = $(this).attr("name");
            if(name in selection){
                $(this).val(selection[name]);
            }
        });
    });

    form.find("#update").click(function(e){
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

        var key_name = "UnitTypeID";
        var key_info = {key:key_name,value:selection[key_name]}

        var values = {};
        form.find("input[name]").each(function(){
            //console.log($(this).attr("name") +":" +  $(this).val() );
            values[$(this).attr("name") ] = $(this).val();
        });
        unit_type_definition_update_ajax(key_info,values,function(){table.bootstrapTable('refresh')});

    });

    container.html(form);
}