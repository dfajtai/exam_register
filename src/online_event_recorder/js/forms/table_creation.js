function createTable(container, table_id, height){
    var table = $("<table/>").attr("id",table_id);
    table.attr("data-toggle","table");
    table.attr("data-height",String(height));

    table.attr("data-search","true");

    table.attr("data-show-refresh","true");

    table.attr("data-auto-refresh","true");
    table.attr("data-show-auto-refresh","true");
    table.attr("data-auto-refresh-interval","10");

    table.attr("data-show-fullscreen","true");

    table.attr("data-pagination","true");
    table.attr("data-page-list","[5, 10, 25, 50, 100, all]");
    table.attr("data-show-pagination-switch","true");

    table.attr("data-show-toggle","true");
    table.attr("data-minimum-count-columns","2");
    table.attr("data-show-columns","true");
    table.attr("data-show-columns-toggle-all","true");

    table.attr("data-detail-view","true");

    table.attr("data-show-footer","true");

    table.attr("data-locale","hu-HU");
    container.html(table);
}