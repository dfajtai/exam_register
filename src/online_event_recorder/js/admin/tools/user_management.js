function users_definition_retrieve_ajax(params) {
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "users"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}

function users_definition_insert_ajax(params,callback = null) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
        type: "POST",
        url: 'php/insert_to_table.php',
        // dataType: "json",
        data: ({table_name: "users",new_info:params}),
        success: function(result){
            callback();
        }
    });
}

function users_definition_update_ajax(key_info,params,callback) {
    if(callback === null){
        callback = function(){};
    }
    $.ajax({
    type: "POST",
    url: 'php/update_table.php',
    // dataType: "json",
    data: ({table_name: "users", key_info:key_info, updated_info:params}),
    success: function(result){
        callback();
    }
    });
}

function trueFalseFormatter(value,row){
    if(String(value)=="0"){
        return "FALSE"
    }
    return "TRUE"
}

function userDetailFormatter(index, row) {
    var html = []
    var hidden_keys = ["UserPwd","state"]
    var vals = {};
    $.each(row, function (key, value) {
      if(!(hidden_keys.includes(key))){
        vals[key] = value;
      }

    })

    return detail_as_table_formatter(null,vals).prop("outerHTML");
  }

function initUsersDefinitionsTable(container,tableId){
    var table = $('#'+tableId);
    table.bootstrapTable("destroy").bootstrapTable({
            columns : [
                {field : 'state', checkbox: true, align:'center'},
                {title: 'ID', field : 'UserID', align:'center', sortable:true, searchable:false},
                {title: 'Username', field : 'UserName', align:'center', sortable:true, searchable:true},
                {title: 'Full Name', field : 'UserFullName', align:'center', sortable:true, searchable:true},
                {title: 'Email', field : 'UserEmail', align:'center', sortable:true, searchable:true},
                // {title: 'Last Login', field : 'LastLogin', align:'center', sortable:true, searchable:true},
                {title: 'Activated', field : 'IsActivated', align:'center', sortable:true, searchable:true, formatter: 'trueFalseFormatter'},
                {title: 'Allow password reset', field : 'CanResetPassword', align:'center', sortable:true, searchable:true, formatter: 'trueFalseFormatter'},
            ],
            search:true,
            pagination:true,
            showExport:true,
            exportTypes: ['csv','json','excel','doc','txt','sql','xml',"pdf"],
            exportDataType: 'all',
            clickToSelect:true,
            checkboxHeader:false,
            multipleSelectRow:true,
            smartDisplay:true,
            autoRefresh:true,
            autoRefreshStatus:false,
            showAutoRefresh:true,

            detailFormatter:userDetailFormatter
        });
            
    table.bootstrapTable('refreshOptions', { ajax:users_definition_retrieve_ajax });

    // modalInsert("Users", container,"users_modal_add_new",tableId, usersDefinitionInputs, users_definition_insert_ajax);
    removeModalInsert(tableId);

    modalUpdate("Users", container,"users_modal_edit_selected",tableId, usersDefinitionInputs, users_definition_update_ajax,"UserID");

    container.find("#users_modal_edit_selected").find(".modal-dialog").addClass("modal-lg");

}

function usersDefinitionInputs(container){
    var params =  [
        {"FieldName":"UserFullName","FieldLabel":"FullName","FieldDataType":"text","FieldType":"input","FieldRequired":true},
        {"FieldName":"UserName","FieldLabel":"Username","FieldDataType":"text","FieldType":"input","FieldRequired":true},
        {"FieldName":"UserEmail","FieldLabel":"Email addres","FieldDataType":"text","FieldType":"input","FieldRequired":true},
        ]
    
    showCustomArgs(container,params);    


    var activatedForm = $("<div/>").addClass("row mb-3");
    activatedForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Acivate/Disactivate"));
    var activatedSelect = $("<div/>").addClass("col-sm-9");
    var activated_select_dropdow = $("<select/>").addClass("form-select required").attr("type","text").attr("id","type").attr("name","IsActivated").prop('required',true);
    activated_select_dropdow.append($("<option/>").html("Choose operation...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    activated_select_dropdow.append($("<option/>").html("Activate account").attr("value",1));
    activated_select_dropdow.append($("<option/>").html("Disactivate account").attr("value",0));
    activatedSelect.append(activated_select_dropdow);
    activatedForm.append(activatedSelect);

    var resetForm = $("<div/>").addClass("row mb-3");
    resetForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Password reset"));
    var resetSelect = $("<div/>").addClass("col-sm-9");
    var reset_select_dropdow = $("<select/>").addClass("form-select required").attr("type","text").attr("id","type").attr("name","CanResetPassword").prop('required',true);
    reset_select_dropdow.append($("<option/>").html("Choose operation...").prop('selected',true).attr("disabled","disabled").attr("value",""));
    reset_select_dropdow.append($("<option/>").html("Allow password reset").attr("value",1));
    reset_select_dropdow.append($("<option/>").html("Deny password reset").attr("value",0));
    resetSelect.append(reset_select_dropdow);
    resetForm.append(resetSelect);

    container.append(activatedForm);
    container.append(resetForm);

}