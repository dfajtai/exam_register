
function subjectSelectWidget(container, study_id = null, callback = null){
    function subject_retrieve_all_ajax(callback = null) {
        if(callback === null){
            callback = function(){};
        }
        $.ajax({
        type: "GET",
        url: 'php/retrieve_table.php',
        dataType: "json",
        data: ({table_name: "subjects"}),
        success: function (result) {
            callback(result);
        }});
    }
    
    function subject_retrieve_ajax(params,callback = null) {
        if(callback === null){
            callback = function(){};
        }
        $.ajax({
        type: "GET",
        url: 'php/retrieve_study_subjects.php',
        dataType: "json",
        data: ({study_id: params.study_id}),
        success: function (result) {
            callback(result);
        }});
    }

    var widget = $("<div/>").addClass("mb-3 mt-3 row");


    var subject_selector = $("<div/>").addClass("input-group").attr("id","subjectSelector");
    var subject_input = $("<input/>").addClass("form-control flexdatalist");
    subject_input.prop("data-min-length",1).prop("data-selection-required",1);
    subject_input.attr("placeholder","Type to search...").attr("id","subjectSelect").attr("type","text");
   
    subject_selector.append($("<span/>").attr("for","subjectSelect").html("Select subject: ").addClass("input-group-text"));
    subject_selector.append(subject_input);
    subject_selector.append($("<button/>").addClass("btn btn-outline-secondary").attr("id","clearSubject").attr("type","button").append($("<i/>").addClass("fa fa-solid fa-x")).attr("type","text"));

    var study_dropdown = $("<select/>").addClass("form-control").attr("id","studySelect").attr("type","text");
    study_dropdown.append($("<option/>").html("All").prop('selected',true).attr("value","all"));
    showAllDefs(study_dropdown,"studies","StudyID","StudyName");
    subject_selector.append($("<span/>").attr("for","studySelect").html("Filter by study").addClass("input-group-text"))
    subject_selector.append(study_dropdown);

    var advanced_search = $("<button/>").addClass("btn btn-outline-dark").html("Advanced search")

    widget.append($("<div/>").addClass("col-md-10").append(subject_selector));
    widget.append($("<div/>").addClass("col-md-2").append(advanced_search));


    $(study_dropdown).on("change",function(){
        var selected = $(this).val();

        var ajax = null
        if(selected == "all"){
            ajax = subject_retrieve_all_ajax;
        }
        else{
            ajax = function(callback){return subject_retrieve_ajax({"study_id":selected},callback)};
        }

        var old_subject = $(subject_input).val();

        ajax(function(res){            
            $(subject_input).flexdatalist({
                minLength: 0,
                toggleSelected:true,
                searchIn:["Name","SubjectID"],
                visibleProperties: ["Name","SubjectID"],
                valueProperty: "SubjectIndex",
                textProperty: '{Name} [{SubjectID}]',
                data: res,
            });

            $(subject_input).val(old_subject);
        });
    })

    $(subject_selector).find("#clearSubject").on("click",function(){
        $(subject_input).val("");
    })

    advanced_search.on("click",function(){
        var modal_id = "subjectSelectorWidgetModal";
        
        container.find("#"+modal_id).remove();

        subject_modal(container,modal_id,"Advanced search");
        var modal = container.find("#"+modal_id);

        var dialog = modal.find(".modal-dialog");
        if(dialog){
            dialog.removeClass("modal-lg").addClass("modal-xl");
        }

        var modal_body = modal.find(".modal-body");

        var modal_footer = modal.find(".modal-footer");
        modal_footer.empty();


        var subject_selector_table_id = "subjectSelectorTable";

        createSubjectTable(modal_body,subject_selector_table_id,200,true);
        
        var subject_table = modal_body.find("#"+subject_selector_table_id);
        subject_table.bootstrapTable("resetView");
        subject_table.bootstrapTable('hideColumn', 'operate');

        modal.modal("show");

    })


    $(subject_input).on("change",function(){
        // console.log($(this).val());

        // var selected_subject = $(this).attr("data-value");
        // console.log(selected_subject);
        // if((typeof callback === 'function')){
        //     callback(selected_subject);
        // }
        
    })


    if(study_id!=null){
        $(study_dropdown).val(study_id);
    }
        

    $(document).ready(function(){
        $(study_dropdown).trigger("change");
    })

    container.append(widget);
}