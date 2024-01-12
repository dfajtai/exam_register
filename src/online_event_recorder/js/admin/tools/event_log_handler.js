


function show_event_log_handler(container){
    subjectSelectWidget(container,"all",
        function(subject_indices,subject_info){
            console.log(subject_indices);
            console.log(subject_info);
        });

}