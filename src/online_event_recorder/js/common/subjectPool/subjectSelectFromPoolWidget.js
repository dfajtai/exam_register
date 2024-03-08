function subjectSelectFromQueueWidget(container, callback = null){
    var responsive_table = null;
    var table_indicator = null;

    if(!isArray(subject_queue)){
        var message = 'Subject queue had not been initialized.'
        container.empty();
        container.append($("<div/>").addClass("text-danger").html(message));
        var to_queue_btn = $("<button/>").addClass("btn btn-outline-dark w-100 mt-2").html("Jump to subject queue editor");
        container.append($("<div/>").append(to_queue_btn));
        to_queue_btn.on("click",function(){
            contentToUrl("tool","SubjectQueue",false,true);
            location.reload();
        })
        
        return
    }
    if(subject_queue.length==0){
        var message = 'Subject queue had not been initialized or empty.'
        container.empty();
        container.append($("<div/>").addClass("text-danger").html(message));
        var to_queue_btn = $("<button/>").addClass("btn btn-outline-dark w-100 mt-2").html("Jump to subject queue editor");
        container.append($("<div/>").append(to_queue_btn));
        to_queue_btn.on("click",function(){
            contentToUrl("tool","SubjectQueue",false, true);
            location.reload();
        })
        return
    }
 
    update_subject_queue_data(function(){
        container.empty();
        showContent();
        container.off().on('show-indicator',function(){
            add_indicator()
        })

    },
    function(){
        var message = 'Subject queue data can not be loaded.'
        container.empty();
        container.append($("<div/>").addClass("text-danger").html(message));
        return
    })

    function add_indicator(){
        var current_queue_index = subject_queue_current_index === null ? -2 : subject_queue_current_index;

        table_indicator.empty();

        var rows = $(responsive_table).children();
        $.each(rows,function(index,row){
            // row 0 is the header - which can be hidden.
            
            var height = $(row).outerHeight(true);
            if(height<0) return true;

            // console.log([index,height]);

            var placeholder = $("<div/>").height(height).addClass("d-flex align-items-center justify-content-evenly");

            var indicator = $("<i/>");
            
            if(index-1==current_queue_index){
                indicator.addClass("bi bi-caret-right-fill btn btn-success btn-sm");
                indicator.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Reload current subject");
            }
            else if(index>0){
                indicator.addClass("bi bi-caret-right btn btn-outline-dark btn-sm");
                indicator.attr("data-bs-toggle","tooltip").attr("data-bs-placement","right").attr("title","Load this subject");
            }
            placeholder.append(indicator);

            table_indicator.append(placeholder);

            indicator.on("click",function(){
                subject_queue_current_index = index - 1;
                statusToStorage("subject_queue_current_index",subject_queue_current_index);
                
                var subject_index = subject_queue[index-1];
                var subject_info = subject_queue_data[index-1];
                table_indicator.find(".btn-success").each(function(){
                    $(this).removeClass("btn-success bi-caret-right-fill").addClass("btn-outline-dark bi-caret-right")
                });
                indicator.removeClass("btn-outline-dark bi-caret-right").addClass("btn-success bi-caret-right-fill");
                // setTimeout(function(){
                //     if(callback!=null) callback(subject_index,subject_info);
                // },500);
                if(callback!=null) callback(subject_index,subject_info);
            })
        })

    }

    function showContent(){
               
        var table_with_indicator = $("<div/>").addClass("d-flex flex-row w-100");
        
        table_indicator = $("<div/>").addClass("col-1 d-flex flex-column flex-fill");
        
        // create responsive table
        responsive_table = $("<div/>").addClass("col-11 d-flex flex-column flex-fill");

        table_with_indicator.append(table_indicator);
        table_with_indicator.append(responsive_table);
        
        var cols_lookup = {SubjectID: "ID", Name: "Name", Group: "Group", Batch: "Batch", Container: "Box",Status: "Status"};
        var responsive_header = $("<div/>").addClass("d-none d-lg-flex justify-content-evenly w-100 p-lg-2");
        responsive_header.css({border: '1px solid black'}).addClass("bg-dark text-light");
        $.each(cols_lookup,function(key,label){
            var header_element = $("<div/>").append($("<strong/>").html(label)).addClass("d-flex flex-fill col-lg-2 justify-content-center");
            // header_element.css({border:"1px solid red"});
            responsive_header.append(header_element);
        })
        responsive_table.append(responsive_header);
        

        var responsive_remainder = $(window).width()>992 ? 0:1;
        
        $.each(subject_queue_data,function(index,entry){

            var responsive_row = $("<div/>").addClass("d-flex justify-content-evenly flex-lg-nowrap flex-wrap w-100 p-2");
            responsive_row.append(responsive_row);


            if(index%2==responsive_remainder){
                responsive_row.css({"background-color":"#f8f9fa"});
            } 
            else {
                responsive_row.css({"background-color":"#e9ecef"});
            }

            if(index==0){
                responsive_row.css({"border-top": "1px solid black"})
            }

            responsive_row.css({"border-left": "1px solid black","border-right": "1px solid black","border-bottom": "1px solid black"})

            // responsive_row.css({bg: '1px solid black'});
            $.each(cols_lookup,function(key,label){
                var val = entry[key];  
                if(key=="Status"){
                    var val = getDefEntryFieldWhere("subject_status_definitions","StatusID",val,"StatusName");
                }
                if(val===null) val = "-";
                if(val==="") val = "-";

                var row_element = $("<div/>").addClass("d-flex flex-fill justify-content-center col-lg-2");
                row_element.append($("<div/>").addClass("d-block d-lg-none me-2").append($("<strong/>").html(label+":")))
                row_element.append($("<div/>").addClass("me-2 me-lg-0").html(val));
                // row_element.css({border:"1px solid red"});
                responsive_row.append(row_element);
            })

            responsive_table.append(responsive_row);
        })
        
        container.append(table_with_indicator);
    }

    $(window).on("resize",function(){
        add_indicator();
    })

}