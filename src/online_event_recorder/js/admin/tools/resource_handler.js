


function resource_handler_retrieve_all_ajax(params) {
    // console.log("retrieve all subj");
    $.ajax({
    type: "GET",
    url: 'php/retrieve_table.php',
    dataType: "json",
    data: ({table_name: "resource_"}),
    success: function (result) {
        params.success({"rows":result, "total":result.length})
    }});
}