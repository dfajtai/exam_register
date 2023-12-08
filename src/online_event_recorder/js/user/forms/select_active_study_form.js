function showSelectActiveStudyForm(container){
    var selectActiveStudyForm = $("<form>").attr("id","selectActiveStudy").addClass("container mb-3 shadow");
    
    var currentStudyInfoBlock = $("<div/>");

    selectActiveStudyForm.append($("<span/>").addClass("row d-block p-2 bg-dark text-white fs-3 mb-3").attr("id","formTitle").html("Select active study"));
    
    var selectForm = $("<div/>").addClass("row mb-3 pb-3");
    selectForm.append($("<label/>").addClass("col-sm-3 col-form-label").html("Studies"));
    var studySelect = $("<div/>").addClass("col-sm-6");
    var study_select_dropdow = $("<select/>").addClass("form-select required").attr("type","text").attr("id","selectedStudy").attr("name","activeStudy").prop('required',true);
    study_select_dropdow.append($("<option/>").html("Choose Active Study...").attr('selected',"selected").attr("value",-1).attr("disabled","disabled").attr("value",""));

    $.each(defs.studies,function(key,entry){
        study_select_dropdow.append($("<option/>").html(entry.StudyName).attr("value",entry.StudyID))
    });

    studySelect.append(study_select_dropdow);
    selectForm.append(studySelect)
    selectForm.append($("<button/>").addClass("col-sm-3  btn btn-primary").attr("type","subbmit").html("Mark as Active Study"));
    selectActiveStudyForm.append(selectForm);

    //TODO current study info (if availabel)
    if(statusInStorage("activeStudy")){
        selectActiveStudyForm.find("#formTitle").html("Choose new active study");

        currentStudyInfoBlock.html(createFlatDefInfoBlock("Active study's info","studies","StudyID",statusFromStorage("activeStudy")));
    }


    var selectedStudyInfoBlock = $("<div/>");
    //TODO selected study info (if availabel)

    selectActiveStudyForm.append(selectedStudyInfoBlock);

    container.empty();
    container.append(currentStudyInfoBlock);
    container.append(selectActiveStudyForm);


    selectActiveStudyForm.find("#selectedStudy").on("change",function(e){
        if(this.value!=-1){
            selectedStudyInfoBlock.html(createFlatDefInfoBlock("Selected study's info","studies","StudyID",JSON.parse(this.value)));
        }
    })

    selectActiveStudyForm.submit(function(e) {
        e.preventDefault();

        let formData = $(this).serializeArray();

        let selectedID = JSON.parse($(this).find("#selectedStudy").val());
        currentStudyInfoBlock.html(createFlatDefInfoBlock("Active study's info","studies","StudyID",selectedID));

        if ('URLSearchParams' in window) {
            let searchParams = new URLSearchParams(window.location.search)
            $.each(formData, function( index, element ) {
                // alert( index + "= " + element.name + ": " + element.value);
                searchParams.set(element.name,element.value);
                // localStorage.setItem(element.name,element.value);
                statusToStorage(element.name,element.value);
              });            
            let newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
            history.pushState(null, '', newRelativePathQuery);
        }
        selectActiveStudyForm[0].reset();
        selectedStudyInfoBlock.empty();
    });
}