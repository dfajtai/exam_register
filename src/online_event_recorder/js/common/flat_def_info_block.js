function createFlatDefInfoBlock(title, def_name, def_key, selected_key_value){
    var infoBlock = $("<div/>").addClass("container mb-3 pb-3 shadow");
    infoBlock.append($("<div/>").addClass("row d-block p-2 bg-dark text-white fs-3 mb-3").html(title));

    let match = $.grep(defs[def_name], function(def) {
        return String(def[def_key]) ===  String(selected_key_value);
    });
    
    $.each(match[0], function (key, value) {
        let short_val = value;
        if (String(value).length>30){
            short_val = String(value).slice(0,200) + "...";
        }

        let _row = $("<div/>").addClass("row pb-2");
        _row.append($("<div/>").addClass("col-sm-3").html("<strong>" + key+" :</strong>"));
        _row.append($("<div/>").addClass("col-sm-9").html(short_val));
        infoBlock.append(_row);
    })

    return infoBlock;
}