
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

            $(subject_input).flexdatalist({
                minLength: 0,
                selectionRequired:false,
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




            $(subject_input).on('change:flexdatalist', function(event, set, options) {
                // console.log(set.value);
                // console.log(set.text);
                // console.log(options.data);
                if(set.text=="") return;

                var selected_subject_info = {};
                $.each(res,function(index,subject_info){
                    if(subject_info["SubjectIndex"]== set.value)
                        {   
                            selected_subject_info = {... subject_info};
                            return;
                        }
                });

                if(callback!=null){
                    console.log(options);
                    callback([set.value],[selected_subject_info]);
                }
            });



        });
    })

    $(subject_selector).find("#clearSubject").on("click",function(){
        $(subject_input).val("");
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
            createSubjectTable(subject_container,subject_selector_table_id,null,true);
            var subject_table = form.find("#"+subject_selector_table_id);
            subject_table.bootstrapTable("resetView");
            subject_table.bootstrapTable('hideColumn', 'operate');
            
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
        $(study_dropdown).trigger("change");
    })

    container.append(widget);
}