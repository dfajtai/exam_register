function unit_type_definition_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "unit_type_definitions"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function unit_definition_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "unit_definitions"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function unit_definition_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        dataType: "json",
        data: ({table_name: "unit_definitions",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function unit_definition_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    dataType: "json",
    data: ({table_name: "unit_definitions", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}


function initUnitDefinitionsTable(table_id){
    $('#'+table_id).bootstrapTable("destroy").bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'Type', field : 'UnitType', align:'center', sortable:true, searchable:true},
                {title: 'Name', field : 'UnitName', align:'center', sortable:true, searchable:true},
                {title: 'Unit', field : 'UnitUnit', align:'center', sortable:true, searchable:true},
                {title: 'Amount', field : 'UnitAmount', align:'center', sortable:true, searchable:false},
                {title: 'Desc', field : 'Desc', align:'center', sortable:true, searchable:false},
            ],
            search:true,
            pagination:true,
            showExport:true,
            exportTypes: ['csv','json','excel','doc','txt','sql','xml',"pdf"],
            exportDataType: 'all',
            clickToSelect:true,
            multipleSelectRow:true,
            smartDisplay:true,
            autoRefresh:true,
            autoRefreshStatus:false,
            showAutoRefresh:true
        });
    
    $('#'+table_id).bootstrapTable('refreshOptions', { ajax:unit_definition_retrieve_ajax });
}

function createUnitDefinitionsForm(container, form_id, table, lookup){
    var form = $("<form/>").attr("id",form_id).addClass("needs-validation");
    var formTitle = $("<h4/>").addClass("display-4 fs-1").html("Add new unit definition");

    var typeForm = $("<div/>").addClass("row mb-3");
    typeForm.append($("<label/>").addClass("col-sm-2 col-form-label").html("Type"));
    var typeSelect = $("<div/>").addClass("col-sm-4");
    typeSelect.append($("<input/>").addClass("form-control").attr("type","text").attr("id","name").attr("name","UnitType").prop('required',true));
    typeForm.append(typeSelect);

    var nameForm = $("<div/>").addClass("row mb-3");
    nameForm.append($("<label/>").addClass("col-sm-2 col-form-label").html("Name"));
    var nameInput = $("<div/>").addClass("col-sm-4");
    nameInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","name").attr("name","UnitName").prop('required',true));
    nameForm.append(nameInput);

    var unitForm = $("<div/>").addClass("row mb-3");
    unitForm.append($("<label/>").addClass("col-sm-2 col-form-label").html("Unit"));
    var unitInput = $("<div/>").addClass("col-sm-4");
    unitInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","name").attr("name","UnitUnit").prop('required',true));
    unitForm.append(unitInput);

    var amountForm = $("<div/>").addClass("row mb-3");
    amountForm.append($("<label/>").addClass("col-sm-2 col-form-label").html("Amount"));
    var amountInput = $("<div/>").addClass("col-sm-4");
    amountInput.append($("<input/>").addClass("form-control").attr("type","numeric").attr("id","name").attr("name","UnitAmount").prop('required',true));
    amountForm.append(amountInput);

    var descForm = $("<div/>").addClass("row mb-3");
    descForm.append($("<label/>").addClass("col-sm-2 col-form-label").html("Description"));
    var descInput = $("<div/>").addClass("col-sm-4");
    descInput.append($("<input/>").addClass("form-control").attr("type","text").attr("id","desc").attr("name","UnitDesc").prop('required',true));
    descForm.append(descInput);
    
    var submitForm = $("<div/>").addClass("row mb-3");
    submitForm.append($("<button/>").addClass("col-sm-2 ms-2 btn btn-primary").attr("type","subbmit").html("Add as New"));
    submitForm.append($("<button/>").addClass("col-sm-2 ms-2 btn btn-primary").attr("id","update").attr("type","button").html("Update Selected"));

    form.append(formTitle);
    form.append(typeForm);
    form.append(nameForm);
    form.append(descForm);
    form.append(submitForm);

    form.on('submit',function(e){
        e.preventDefault();
        var values = {};
        $.each($(this).serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });
        unit_definition_insert_ajax(values,function(){table.bootstrapTable('refresh')});

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
            console.log("invalid update");
            form[0].reportValidity();
            return;
        }

        var key_name = "UnitID";
        var key_info = {key:key_name,value:selection[key_name]}

        var values = {};
        form.find("input[name]").each(function(){
            //console.log($(this).attr("name") +":" +  $(this).val() );
            values[$(this).attr("name") ] = $(this).val();
        });
        unit_definition_update_ajax(key_info,values,function(){table.bootstrapTable('refresh')});

    });

    container.html(form);
}