
function subjectSelectWidget(container, study_id = null, callback = null, single_select = false){
    var subject_select_widget_debug = false;

    var lastSelectedIndices = [];
    var lastSelectedInfo = [];


    // callback double fire prevention
    function regulated_callback(new_indices, new_info){
        var _new_indices = nullify_array(new_indices,true);
        var _new_info = nullify_array(new_info,true);

        var _lastSelectedIndices = nullify_array(lastSelectedIndices,true);
        var _lastSelectedInfo = nullify_array(lastSelectedInfo,true);
        

        if(subject_select_widget_debug) console.log(JSON.stringify(_lastSelectedIndices) + " -> " + JSON.stringify(_new_indices));
        if(subject_select_widget_debug) console.log(JSON.stringify(_lastSelectedInfo) + " -> " + JSON.stringify(_new_info));

        if(!isEqual(_new_indices,_lastSelectedIndices)&&!isEqual(_new_info,_lastSelectedInfo)){
            lastSelectedIndices = new_indices;
            lastSelectedInfo = new_info;
            if(callback!=null){
                if(subject_select_widget_debug) console.log("SubjectSelectWidget callback called.")
                callback(new_indices,new_info);
            }
        }
        else{
            if(subject_select_widget_debug) console.log("SubjectSelectWidget callback skipped.")
        }
        
    }


    function subject_retrieve_all_ajax(callback = null) {
        if(callback === null){
            callback = function(){};
        }
        $.ajax({
        type: "GET",
        url: 'php/retrieve_table_where.php',
        dataType: "json",
        data: ({table_name: "subjects",columns:["Name","SubjectID","SubjectIndex","StudyID"], 
                where_not:{"Status":subject_deleted_status}}),
        // data: ({table_name: "subjects",where:{"Status[!]":subject_deleted_status}}),
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
        url: 'php/retrieve_table_where.php',
        dataType: "json",
        data: ({table_name: "subjects",columns:["Name","SubjectID","SubjectIndex","StudyID"], 
                where:{"StudyID":params.study_id}, 
                where_not:{'Status':subject_deleted_status}}),
        success: function (result) {
            callback(result);
        }});
    }

    var all_subject = null;

    var widget = $("<div/>").addClass("mb-3 mt-3 row");

    var subject_selector = $("<div/>").addClass("input-group").attr("id","subjectSelector");

    var filter_switch_group = $("<div/>").addClass("form-check form-switch");
    
    var filter_switch = $("<input/>").addClass("form-check-input").attr("type","checkbox").attr("id","filterSwitch");
    filter_switch_group.append(filter_switch);
    filter_switch_group.append($("<label/>").addClass("form-check-label").attr("for","filterSwitch").html("Select all subject"));
    subject_selector.append($("<div/>").addClass("input-group-text").append(filter_switch_group));
    
    var subject_input = $("<input/>").addClass("form-control flexdatalist");
    subject_input.attr("placeholder","Type to search single subject...").attr("id","subjectSelect").attr("type","text");
   
    // subject_selector.append($("<span/>").attr("for","subjectSelect").html("Select subject: ").addClass("input-group-text"));
    subject_selector.append(subject_input);
    subject_selector.append($("<button/>").addClass("btn btn-outline-secondary").attr("id","clearSubject").attr("type","button").append($("<i/>").addClass("fa fa-solid fa-x")).attr("type","text"));


    var study_selector = $("<div/>").addClass("input-group h-100").attr("id","studySelector");
    var study_dropdown = $("<select/>").addClass("form-control").attr("id","studySelect").attr("type","text");
    study_dropdown.append($("<option/>").html("All").prop('selected',true).attr("value","all"));
    showAllDefs(study_dropdown,"studies","StudyID","StudyName","StudyName");
    study_selector.append($("<label/>").attr("for","studySelect").html("Filter by study").addClass("input-group-text"))
    study_selector.append(study_dropdown);

    var advanced_search = $("<button/>").addClass("btn btn-outline-dark col-sm-12").html("Advanced search")
    var reset_widget = $("<button/>").addClass("btn btn-outline-dark col-sm-12").html("Reset")

    var result_bar = $("<div/>").addClass("mb-3 mt-3 row");

    function show_widget(){
        widget.empty();
        // console.log($(window).width());
        if ($(container).width() < 1200 & $(container).width() >= 576) {
            widget.append($("<div/>").addClass("mb-2").append(subject_selector));
            widget.append($("<div/>").addClass("mb-2").append(study_selector));
            var buttons = $("<div/>").addClass("row");
            buttons.append($("<div/>").addClass("col-sm-6").append(reset_widget));
            buttons.append($("<div/>").addClass("col-sm-6").append(advanced_search));

            widget.append($("<div/>").addClass("mb-2").append(buttons));
         }
         else if ($(container).width() < 576) {
            widget = widget.removeClass("row").addClass("container");
            widget.append($("<div/>").addClass("col mb-2").append(subject_selector));
            widget.append($("<div/>").addClass("col mb-2").append(study_selector));
            
            var xs_widget_container = $("<div/>").addClass("row row-cols-2");
            xs_widget_container.append($("<div/>").addClass("col mb-2").append(reset_widget));
            xs_widget_container.append($("<div/>").addClass("col mb-2").append(advanced_search));
            widget.append(xs_widget_container);

         }
         else {
            widget.append($("<div/>").addClass("col-md-5").append(subject_selector));
            widget.append($("<div/>").addClass("col-md-4").append(study_selector));
            widget.append($("<div/>").addClass("col-md-1").append(reset_widget));
            widget.append($("<div/>").addClass("col-md-2").append(advanced_search));
        }
        container.empty();
        container.append(widget);
        container.append(result_bar);
    }
        

    function show_selected_subjects(container,selected_subjects){
        container.empty();
        if(selected_subjects==null){
            return;
        }

        var text_list = [];
        $.each(selected_subjects, function(index,subject){
            if(!subject.hasOwnProperty("Name")) return;
            if(!subject.hasOwnProperty("SubjectID")) return;
            text_list.push((subject.Name==null?"":(subject.Name+" "))+ "["+subject.SubjectID+"]");                                 
        })

        if(text_list.length==0){
            return;
        }

        var results_dom = $("<div/>").addClass("input-group").attr("id","selectedSubjects");
        if(selected_subjects.length>1){
            var selected_label = $("<span/>").attr("for","subjectSelect").html("Selected subjects: ").addClass("input-group-text");
            var selected_subj = $("<span/>").attr("id","selectedSubjectsText").addClass("form-control");

        }
        else{
            var selected_label = $("<span/>").attr("for","subjectSelect").html("Selected subject: ").addClass("input-group-text");
            var selected_subj = $("<span/>").attr("id","selectedSubjectsText").addClass("form-control");

        }
        results_dom.append(selected_label);
        results_dom.append(selected_subj);


        $(selected_subj).html(text_list.join(", "));

        container.append($("<div/>").addClass("col-md-12").append(results_dom));
    }


    $(study_dropdown).on("change",function(){
        var selected = $(this).val();

        var ajax = null
        if(selected == "all"){
            ajax = subject_retrieve_all_ajax;
        }
        else{
            ajax = function(callback){
                if(subject_select_widget_debug) console.log("study changed");
                return subject_retrieve_ajax({"study_id":selected},callback);
            };
        }

        ajax(function(res){       
            $(filter_switch).prop("checked",false).trigger('change');

            all_subject = res;

            var names = getColUnique(res,"Name");
            if(names.length==1 && res.length!=names.length){
                // no names set (name = null for every entry)
                $(subject_input).flexdatalist({
                    minLength: 0,
                    selectionRequired:true,
                    toggleSelected:true,
                    searchIn:["SubjectID"],
                    visibleProperties: ["SubjectID"],
                    valueProperty: "SubjectIndex",
                    textProperty: '[{SubjectID}]',
                    searchContain: true,
                    data: res
                })
            }
            else{
                $(subject_input).flexdatalist({
                    minLength: 0,
                    selectionRequired:true,
                    toggleSelected:true,
                    searchIn:["Name","SubjectID"],
                    visibleProperties: ["Name","SubjectID"],
                    valueProperty: "SubjectIndex",
                    textProperty: '{Name} [{SubjectID}]',
                    searchContain: true,
                    data: res
                })
            }
            
            $(subject_input).on('shown:flexdatalist.results', function(event, results){
                var name_elements = $("#subjectSelect-flexdatalist-results").find("li").find(".item-Name");
                $.each(name_elements,function(index,element){
                    var name_html = $(element).html().trim();
                    if(name_html=="null"){
                        $(element).html("<strong> ---- </strong>");
                    }
                    else{
                        $(element).html("<strong>"+name_html+"</strong>");
                    }
                })
                var id_elements = $("#subjectSelect-flexdatalist-results").find("li").find(".item-SubjectID");
                $.each(id_elements,function(index,element){
                    var id_html = $(element).html().trim();
                    if(id_html=="null"){
                        $(element).html("[<small> ---- </small>]");
                    }
                    else{
                        $(element).html("[<small>"+id_html+"</small>]");
                    }
                })

            })


            $(subject_input).on('change:flexdatalist', function(event, set, options) {
                // console.log(set.value);
                // console.log(set.text);
                // console.log(options.data);
                if(set.text==""){
                    show_selected_subjects(result_bar,null);                    
                    
                    if(filter_switch.is(":checked")) return;
                    if(callback!=null)
                        if(subject_select_widget_debug) console.log("subject '' selected");
                        regulated_callback([],[]);
                    return;
                }
                else{
                    $(filter_switch).prop("checked",false);
                }

                var selected_subject_info = {};
                $.each(res,function(index,subject_info){
                    if(subject_info["SubjectIndex"]== set.value)
                        {   
                            selected_subject_info = {... subject_info};
                            return;
                        }
                });

                if(callback!=null){
                    // console.log(options);
                    if(subject_select_widget_debug) console.log("single subject selected");
                    show_selected_subjects(result_bar,[selected_subject_info]);
                    regulated_callback([set.value],[selected_subject_info]);
                    
                }
            });



        });
    })

    $(filter_switch).on("change",function(){
        var show_all = filter_switch.is(":checked");
        if(show_all){
            $(subject_input).val("");
            var selected_subject_indices = getCol(all_subject,"SubjectIndex");
            show_selected_subjects(result_bar,all_subject);
            // send 'all' if all subject is selected
            if($(study_dropdown).val()=="all"){
                if(subject_select_widget_debug) console.log("all subject selected");
                regulated_callback("all",all_subject);
            }
            else{
                if(subject_select_widget_debug) console.log("multiple subject selected");
                regulated_callback(selected_subject_indices,all_subject);
            }
            
        }
        // double firing ?
        else{
            if(subject_select_widget_debug) console.log("subject select reseted");
            $(subject_input).val("");

            show_selected_subjects(result_bar,null);
            regulated_callback([],[]);
        }
    })

    $(subject_selector).find("#clearSubject").on("click",function(){
        $(subject_input).val("");
        regulated_callback([],[]);
        show_selected_subjects(result_bar,null);
        $(filter_switch).prop("checked",false).trigger('change');
    })

    reset_widget.on("click",function(){
        $(study_dropdown).val("all");
        if($(filter_switch).prop("checked")){
            $(filter_switch).prop("checked",false);
            $(filter_switch).trigger('change');

        }
        else{
            $(subject_input).val("");
            regulated_callback([],[]);
        }
        show_selected_subjects(result_bar,null);

    })

    advanced_search.on("click",function(){
        var modal_id = "subjectSelectorWidgetModal";
        var form_id = "subjectSelectorWidgetForm";
        var subject_selector_table_id = "subjectSelectorTable";
        
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

        var form = $("<form/>").attr("id",form_id).addClass("needs-validation");

        var subject_container = $("<div/>").attr("id","advancedSubjectSelector").addClass("mb-3 container");

        var submitForm = $("<div/>").addClass("row mb-3 text-center px-5");
        var submitButton = $("<button/>").addClass("btn btn-outline-dark").attr("type","submit").html("Choose selected subjects");
        submitForm.append(submitButton);

        form.append(subject_container);
        form.append(submitForm);
        
        modal_body.append(form);


        $(modal).on('show.bs.modal',function(){
            createSubjectTable(subject_container,subject_selector_table_id,true);
            // $(form.find("#studySelect")[0]).trigger("change");
            // $(form.find("#studySelect")[0]).trigger("change");
            var subject_table = form.find("#"+subject_selector_table_id);
            subject_table.bootstrapTable("refresh");
            if(single_select){

            }
            subject_table.bootstrapTable('hideColumn', ['operate','locked','LastChange']);
            
        });


        $(form).on('submit',function(e){
            e.preventDefault();

            var subject_table = subject_container.find("#"+subject_selector_table_id);
            var selected_subjects = $(subject_table).bootstrapTable("getSelections");

            if(selected_subjects.length==0){
                alert("Please select at least one subject.");
                return;
            };

            if(callback!=null){
                var selected_subject_indices = getCol(selected_subjects,"SubjectIndex");
                if(subject_select_widget_debug) console.log("subject(s) selected with advanced");
                show_selected_subjects(result_bar,selected_subjects);
                regulated_callback(selected_subject_indices,selected_subjects);
            }
            modal.modal("hide");
        })

        $(subject_input).val("");
        modal.modal("show");

    })


    if(study_id!=null){
        $(study_dropdown).val(study_id);
    }
        

    $(document).ready(function(){
        // $( window ).on( "resize", function() {
        //     subjectSelectWidget(container,study_id,callback);
        // });
    
        show_widget();
        $(study_dropdown).trigger("change");
    })


}