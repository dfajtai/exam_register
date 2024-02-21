function subjectSelectFromPoolWidget(container,callback = null){
    if(!isArray(subject_pool)){
        var message = 'Subject pool had not been initialized.'
        container.empty();
        container.append($("<div/>").addClass("text-danger").html(message));
        return
    }
    if(subject_pool.length==0){
        var message = 'Subject pool had not been initialized or empty.'
        container.empty();
        container.append($("<div/>").addClass("text-danger").html(message));
        return
    }

    update_subject_pool_data(function(){
        showContent();
    },
    function(){
        var message = 'Subject pool data can not be loaded.'
        container.empty();
        container.append($("<div/>").addClass("text-danger").html(message));
        return
    })


    function showContent(){
        var content = $("<div/>").addClass("d-flex");
        
        // add responsive table
        // add select
        // add first previous next last

        container.append(content);
    }


}