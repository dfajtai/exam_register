function showSelectActiveStudyForm(container){
    var selectActiveStudyForm = $("<form>").attr("id","selectActiveStudy").addClass("container mb-3 shadow");
    
    var currentStudyInfoBlock = $("<div/>");

    selectActiveStudyForm.append($("<span/>").addClass("row d-block p-2 bg-dark text-white fs-3 mb-3").attr("id","formTitle").html("Select active study"));
    
    var selectForm = $("<div/>").addClass("row mb-3 pb-3");
    selectForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Studies"));
    var studySelect = $("<div/>").addClass("col-sm-6");
    var study_select_dropdow = $("<select/>").addClass("form-select required").attr("type","text").attr("id","selectedStudy").attr("name","activeStudy").prop('required',true);
    study_select_dropdow.append($("<option/>").html("Choose Active Study...").prop('selected',true).attr("value",-1).attr("disabled","disabled").attr("value",""));

    showAllDefs(study_select_dropdow,"studies","StudyID","StudyName");

    studySelect.append(study_select_dropdow);
    selectForm.append(studySelect)

    var select_btn = $("<button/>").addClass("btn btn-outline-dark w-100").attr("type","subbmit").html("Mark as Active Study")
    selectForm.append($("<div/>").addClass("col-sm-3 ").append(select_btn));
    selectActiveStudyForm.append(selectForm);

    //TODO current study info (if availabel)
    if(statusInStorage("activeStudy")){
        selectActiveStudyForm.find("#formTitle").html("Choose new active study");

        currentStudyInfoBlock.append(createFlatDefInfoBlock("Active study's info","studies","StudyID",statusFromStorage("activeStudy"),2000));
    }


    var selectedStudyInfoBlock = $("<div/>");
    //TODO selected study info (if availabel)

    selectActiveStudyForm.append(selectedStudyInfoBlock);

    container.empty();
    container.append(currentStudyInfoBlock);
    container.append(selectActiveStudyForm);


    selectActiveStudyForm.find("#selectedStudy").on("change",function(e){
        if($(this).val()!=-1){
            selectedStudyInfoBlock.empty();
            selectedStudyInfoBlock.addClass("row mb-3 mx-1")
            var selected_info_content = createFlatDefInfoBlock("Selected study's info","studies","StudyID",JSON.parse($(this).val()));
  
            selectedStudyInfoBlock.append(selected_info_content);
        }
    })

    selectActiveStudyForm.submit(function(e) {
        e.preventDefault();

        let formData = $(this).serializeArray();

        let selectedID = JSON.parse($(this).find("#selectedStudy").val());
        currentStudyInfoBlock.empty();
        currentStudyInfoBlock.append(createFlatDefInfoBlock("Active study's info","studies","StudyID",selectedID,2000));

        $.each(formData, function( index, element ) {
            statusToUrl(element.name,element.value)
            statusToStorage(element.name,element.value);
        }); 

        selectActiveStudyForm[0].reset();
        selectedStudyInfoBlock.empty().removeClass("row mb-3 mx-1");
    });
}