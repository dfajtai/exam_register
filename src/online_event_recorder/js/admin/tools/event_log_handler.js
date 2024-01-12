


function show_event_log_handler(container){

    var subject_selector_container = $("<div/>");
    subjectSelectWidget(subject_selector_container,"all",
        function(subject_indices,subject_info){
            console.log(subject_indices);
            console.log(subject_info);
        });
    container.append(subject_selector_container);
}