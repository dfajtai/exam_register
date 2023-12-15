function createUserTable(container, table_id, height){
    // var table_with_controls = $("<div/>");


    var toolbar = $("<div/>").attr("id",table_id+"_toolbar");
    toolbar.append($("<button/>").attr("id","toolbar_add").addClass("btn btn-success admin-table-toolbar-btn").html($("<i/>").addClass("fa fa-plus").attr("aria-hidden","true")).append(" Add New"));
    toolbar.append($("<button/>").attr("id","toolbar_edit").addClass("btn btn-primary admin-table-toolbar-btn").html($("<i/>").addClass("fa fa-pen-to-square").attr("aria-hidden","true")).append(" Edit Selected"));

    var table = $("<table/>").attr("id",table_id);
    table.attr("data-toggle","table");

    table.attr("data-toolbar","#"+table_id+"_toolbar");

    table.attr("data-height",String(height));

    table.attr("data-search","true");    
    table.attr("data-visible-search","true");

    table.attr("data-show-refresh","true");

    table.attr("data-auto-refresh","true");
    // table.attr("data-show-auto-refresh","true");
    table.attr("data-auto-refresh-interval","5");

    table.attr("data-show-fullscreen","true");

    table.attr("data-pagination","true");
    table.attr("data-page-list","[5, 10, 25, 50, 100, all]");

    // table.attr("data-show-pagination-switch","true");

    // table.attr("data-minimum-count-columns","2");
    // table.attr("data-show-columns","true");
    // table.attr("data-show-columns-toggle-all","true");

    
    // table.attr("data-show-toggle","true");
    table.attr("data-detail-view","true");

    table.attr("data-show-footer","false");

    table.attr("data-locale","hu-HU");

    // table_with_controls.append(toolbar);
    // table_with_controls.append(table);

    // container.html(table_with_controls);

    container.append(toolbar);
    container.append(table);
}