function statusFilterWidget(status_type, unchecked = null, callback = null){
    var status_types = ["subject","event"];

    if(!status_types.includes(status_type)) return;

    var statusFilter = $("<div/>").addClass("btn-group").attr("id","status_filter_widget");

    var btn = $("<button/>").addClass("btn btn-outline-dark dropdown-toggle").attr("id","status_filter_btn").attr("type","button").html("Filter by status");
    btn.attr("data-bs-toggle","dropdown");    
    
    statusFilter.append(btn);

    var dropdown_menu = $("<ul/>").addClass("dropdown-menu dropdown-menu-dark").attr("aria-labelledby","status_filter_btn");

    var status_defs = null;
    var name_col =null;
    var value_col = null;
    switch (status_type) {
        case "subject":
            status_defs = defs["subject_status_definitions"];
            name_col = "StatusName";
            value_col = "StatusID";
            break;
        
        case "event":
            status_defs = defs["event_status_definitions"];
            name_col = "EventStatusName";
            value_col = "EventStatusID";
            break;

        default:
            return;
    }

    $.each(status_defs,function(index,entry){
        var checked = true;
        var entry_val = entry[value_col];
        var entry_name = entry[name_col];
        if(isArray(unchecked)){
            checked = !(unchecked.includes(entry_val))
        }
        
        var list_item_dom = $("<li/>");

        var check_box_form = $("<div/>").addClass("form-check form-switch");
        var checkbox = $("<input/>").addClass("form-check-input").attr("type","checkbox").attr("value","").attr("id",entry_name+"_checkbox");
        checkbox.prop("data-value",entry_val).prop("data-name",entry_name);

        if(checked){
            checkbox.prop("checked",true);
        }


        check_box_form.append(checkbox);
        check_box_form.append($("<label/>").addClass("form-check-label").attr("for",entry_name+"_checkbox").html(entry_name));

        var dropdown_item = $("<a/>").addClass("dropdown-item");
        // var dropdown_item = $("<a/>").addClass("dropdown-item").attr("href","#");

        // dropdown_item.on("click",function(){
        //     var checked = $(this).find("input").prop("checked");
        //     $(this).find("input").prop("checked",!checked);
        // });

        dropdown_item.append(check_box_form);

        dropdown_menu.append(list_item_dom.append(dropdown_item));
    })

    statusFilter.append(dropdown_menu);

    $(statusFilter).find("input").on("change",function(){
        var entries = $(statusFilter).find(":checked");
        var vals = [];
        $.each(entries,function(index,entry){
            vals.push($(entry).prop("data-value"))
        })
        
        if(callback!=null){
            callback(vals);
        }
    })

    return statusFilter;
}