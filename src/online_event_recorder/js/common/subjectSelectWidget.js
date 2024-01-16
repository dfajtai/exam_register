
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


    var study_selector = $("<div/>").addClass("input-group").attr("id","studySelector");
    var study_dropdown = $("<select/>").addClass("form-control").attr("id","studySelect").attr("type","text");
    study_dropdown.append($("<option/>").html("All").prop('selected',true).attr("value","all"));
    showAllDefs(study_dropdown,"studies","StudyID","StudyName");
    study_selector.append($("<span/>").attr("for","studySelect").html("Filter by study").addClass("input-group-text"))
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
            text_list.push(subject.Name + " ["+subject.SubjectID+"]");                                 
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
            ajax = function(callback){return subject_retrieve_ajax({"study_id":selected},callback)};
        }

        ajax(function(res){       
            // if(res.length>0)
            // {
            //     $.each(res,function(index,subject_info){
            //         if(subject_info["SubjectIndex"]== old_subject)
            //             {   
            //                 old_subject_info = {... subject_info};
            //                 return;
            //             }
            //     });
            //     // console.log(old_subject_info);
            // }
            all_subject = res;

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
            // }).promise().done(function(){
            //     if(old_subject_info){
            //         let oldtext = old_subject_info.Name + " ["+old_subject_info.SubjectID+"]";
            //         $(subject_input).trigger("keydown").val(oldtext);
            //     }
            // });

            $(filter_switch).trigger('change');


            $(subject_input).on('change:flexdatalist', function(event, set, options) {
                // console.log(set.value);
                // console.log(set.text);
                // console.log(options.data);
                if(set.text==""){
                    show_selected_subjects(result_bar,null);
                    if(callback!=null)
                        callback([],[]);
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
                    show_selected_subjects(result_bar,[selected_subject_info]);
                    callback([set.value],[selected_subject_info]);
                    
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
                callback("all",all_subject);
            }
            else{
                callback(selected_subject_indices,all_subject);
            }
            
        }
        else{
            $(subject_input).val("");
            show_selected_subjects(result_bar,null);
            callback([],[]);
        }
    })

    $(subject_selector).find("#clearSubject").on("click",function(){
        $(subject_input).val("");
    })

    reset_widget.on("click",function(){
        $(subject_input).val("");
        $(filter_switch).prop("checked",false);
        $(filter_switch).trigger('change');

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
        var submitButton = $("<button/>").addClass("btn btn-primary").attr("type","submit").html("Choose selected subjects");
        submitForm.append(submitButton);

        form.append(subject_container);
        form.append(submitForm);
        
        modal_body.append(form);


        $(modal).on('show.bs.modal',function(){
            createSubjectTable(subject_container,subject_selector_table_id,true);
            var subject_table = form.find("#"+subject_selector_table_id);
            subject_table.bootstrapTable("resetView");
            subject_table.bootstrapTable('hideColumn', ['operate','LastChange']);
            
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
                show_selected_subjects(result_bar,selected_subjects);
                callback(selected_subject_indices,selected_subjects);
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