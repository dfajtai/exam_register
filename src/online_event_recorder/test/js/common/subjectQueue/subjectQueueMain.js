var subject_queue_current_index = null;
var subject_queue = [];
var subject_queue_data = [];


var subject_queue_select_content = null;
var subject_queue_editor_content = null;


function setSubjectQueue(initial_indices, update_data = false, callback=null){
    if(!isArray(initial_indices)){
        initial_indices = [];
    }
    var indices = nullify_array(initial_indices.filter(onlyUnique));
    indices = indices === null ? [] : indices;
    subject_queue = indices;

    var data = subject_queue.map((x)=>({SubjectIndex:x}));
    subject_queue_data = data;

    statusToStorage("subjectQueueData",JSON.stringify(data));
    subject_queue_current_index = null;
    statusToStorage("subject_queue_current_index",subject_queue_current_index);

    

    if(update_data){
        update_subject_queue_data(callback);
    }
}

function subjectQueueFromStorage(update_data = false, callback=null){
    if(! statusInStorage("subjectQueueData")){
        if(callback!=null) callback();
        return;
    }
    else{
        subject_queue_data =  JSON.parse(statusFromStorage("subjectQueueData"));
        subject_queue_current_index =  JSON.parse(statusFromStorage("subject_queue_current_index"));

        subject_queue = getCol(subject_queue_data,"SubjectIndex");
        if(update_data){
            update_subject_queue_data(callback);
        }
    }


}

function update_subject_queue_data(success_callback = null, error_callback = null){
    $.ajax({
        type: "GET",
        url: 'php/retrieve_table_where.php',
        dataType: "json",
        data: ({table_name:"subjects",where:{"SubjectIndex": subject_queue}}),
        success: function (result) {
            var lookup = Object.fromEntries(result.map(x=>[x.SubjectIndex,x]));

            subject_queue_data = [];
            $.each(subject_queue,function(index,subject_index){
                if(subject_index in lookup) subject_queue_data.push(lookup[subject_index]);
            })
            if(success_callback!=null) success_callback();
        },
        error: function(er){
            if(error_callback!=null) error_callback();
        }
    });

}