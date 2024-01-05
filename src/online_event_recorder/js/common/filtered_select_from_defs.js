function showAllDefs(select_object, def_name, _key, _label){
    $.each(defs[def_name],function(key,entry){
        var opt = $("<option/>").html(entry[_label]).attr("value",entry[_key]);

        $.each(entry,function(prop_key,prop_val){
            if(!prop_key.toLowerCase().includes("desc"))
            opt.attr(prop_key,prop_val);
        })

        select_object.append(opt);
    });
}

function showDefWhereKeyEqualsValueByReinit(select_object, def_name, def_filter_key, filter_value, select_label, select_value){
    // adds elements to a 'select' DOM object based on a filtered subset of a given definition table

    select_object.empty();

    // find items in the given table where
    let match = $.grep(defs[def_name], function(def) { 
        // a given assumption is true
        return String(def[def_filter_key]) ===  String(filter_value); // a selected column is equal to a specific value
    });
    // console.log(match);

    // populate the select with options
    $.each(match,function(key,entry){
        select_object.append($("<option/>").html(entry[select_label]).attr("value",entry[select_value]))
    });
}


function showDefWhereKeyEqualsValueByVisibility(select_object, def_name, def_filter_key, filter_value, select_value_attr){
    // alters visibility of DOM objects based on a filtered subset of a given definition table. the filtering is performed by val()

    // find items in the given table where
    let match = $.grep(defs[def_name], function(def) { 
        // a given assumption is true
        return String(def[def_filter_key]) ===  String(filter_value); // a selected prop. is equal to a specific value
    });


    // populate the select with options
    let options = select_object.find("option");
    
    // iterate over previously defined select entries
    $.each(options,function(key,entry){

        let rematch = $.grep(match, function(_match) { 
            return String(_match[select_value_attr]) === String($(entry).val()); // a selected prop. is equal to the value
        });

        if(rematch.length){
            // console.log($(entry).val());
            $(this).removeAttr("hidden");
        }
        else{
            $(this).attr("hidden","hidden");
        }
    });
}

function connectSelectByValue(parent_contaner, child_contaner, child_def_name, child_def_filter_key, child_value_attr){
    // This is a less abstract version of the 'connectSelectByAttr' function

    // parent container contains a select which has changed
    parent_contaner.find("select").on("change",function(e){
        if($(this).val() !="-1"){
            showDefWhereKeyEqualsValueByVisibility(child_contaner.find("select"),
                                                   child_def_name,
                                                   child_def_filter_key,
                                                   $(this).val(),
                                                   child_value_attr);
        }
    })
}

function showDefWhereAttrEqualsValueByVisibility(select_object, def_name, def_filter_key, filter_value, select_value_attr){
    // alters visibility of DOM objects based on a filtered subset of a given definition table. the filtering is by a specified attribute

    // find items in the given table where
    let match = $.grep(defs[def_name], function(def) { 
        // a given assumption is true
        return String(def[def_filter_key]) ===  String(filter_value); // a selected prop. is equal to a specific value
    });
    // console.log(match);

    // populate the select with options
    let options = select_object.find("option");

    options.eq(0).prop('selected', true); // select default element
    
    // iterate over previously defined select entries
    $.each(options,function(index,entry){
        if(index==0){//default entry
            select_object.
            return // continue
        }

        let rematch = $.grep(match, function(_match) { 
            return String(_match[select_value_attr]) === String($(entry).attr(select_value_attr)); // a selected prop. is equal to a specific attr.
        });

        if(rematch.length){
            // console.log($(entry).val());
            $(this).removeAttr("hidden");
        }
        else{
            $(this).attr("hidden","hidden");
        }
    });

}

function connectSelectByAttr(parent_contaner, child_contaner, child_def_name, child_def_filter_key, parent_key_attr, child_value_attr){
    // This is a more abstract version of the 'connectSelectByValue' function with the ability of 'foreign-keys' (or something like that)

    // There are two containers, which are both containing select DOM objects. -> parent_contaner, child_contaner
    // The parent select controlls the child select by filtering its visible values.
    // The child is popullated originally from a 'defs' entry (definition_table) -> child_def_name
    // The child is filtered on a given key -> child_def_filter_key ( foreign-keys ? )
    // Which is an unique attr stored in the paren select items, whit a give name -> parent_key_attr  ( key on parent ? )
    // .... and this may have different name in the child -> child_value_attr ( key on child ? )

    // notation: Assume 1-to-N connection between parent and child.

    // parent container contains a select which has changed
    parent_contaner.find("select").on("change",function(e){
        if($(this).val()!=""){
            
            var selected_parent_DOM = $(this).find(":selected");

            showDefWhereAttrEqualsValueByVisibility(child_contaner.find("select"),
                                                    child_def_name,
                                                    child_def_filter_key,
                                                    selected_parent_DOM.attr(parent_key_attr),
                                                    child_value_attr);
        }else{
            var child_options = child_contaner.find("select").find("option");

            $.each(child_options,function(index,option){
                $(option).removeAttr("hidden");
            })
        }

    });
}
