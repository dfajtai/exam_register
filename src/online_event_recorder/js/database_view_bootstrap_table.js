function getTableJSONAjax(table_name, callback){
    $.ajax({
        url: 'php/default_table_viewer.php',
        type: "GET",
        dataType:'json',
        data: ({table_name: table_name}),
        success:callback})
}

function createBootstrapTableViewer(container){
    

}