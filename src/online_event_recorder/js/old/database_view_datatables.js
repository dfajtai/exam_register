function makeHtmlTableFromData(container, data, name, table_class = null, ) {
    var table = $("<table/>").attr("id",name).addClass(table_class);
    var table_head = $("<thead/>")
    var row = $("<tr/>");
    $.each(data[0], function(colIndex, c) { 
            row.append($("<th/>").text(colIndex));
    });
    table_head.append(row);

    var table_body = $("<tbody/>")
    $.each(data, function(rowIndex, r) {
        var row = $("<tr/>");
        $.each(r, function(colIndex, c) { 
            row.append($("<td/>").text(c));
        });
        table_body.append(row);
    });

    table.append(table_head);
    table.append(table_body);

    return container.append(table);
}


function getTableJSONAjax(table_name, callback){
    $.ajax({
        url: 'php/retrieve_table.php',
        type: "GET",
        dataType:'json',
        data: ({table_name: table_name}),
        success:callback})
}

function addClickToTable(table_object){

    table_object.on('click', 'tbody tr', (e) => {
        let classList = e.currentTarget.classList;
    
        if (classList.contains('selected')) {
            classList.remove('selected');
        }
        else {
            table_object.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
            classList.add('selected');
            selected_row_data = e.currentTarget;
            console.log(selected_row_data);
        }
    });
}

/**
 * 
 * @param  container Container of the table viewer (eg <div id = "something"> -> $(#"something"))
 * @param  table_name Name of the table to be shown
 * @param  htm_table_name Name of the html table created onflight
 */
function createTableViewer(container, table_name, htm_table_name){
    $.ajax({
        url: 'php/default_table_viewer.php',
        type: "GET",
        dataType:'json',
        data: ({table_name: table_name}),
        success: function(data){
            if(data.length==0){
                container.html('<h5>TABLE IS EMPTY</h5>');
            }
            else{
                container.html('');
                makeHtmlTableFromData(container,data,htm_table_name);
    
                viewerObject =  new DataTable("#"+htm_table_name, {select:true});
                addClickToTable(viewerObject);
            }
        }
    }); 

}


