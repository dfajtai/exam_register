var subject_pool_current_index = null;
var subject_pool = [];
var subject_pool_data = [];


var subject_pool_select_content = null;
var subject_pool_editor_content = null;


function setSubjectPool(initial_indices, update_data = false, callback=null){
    if(!isArray(initial_indices)){
        initial_indices = [];
    }
    var indices = nullify_array(initial_indices.filter(onlyUnique));
    indices = indices === null ? [] : indices;
    subject_pool = indices;

    var data = subject_pool.map((x)=>({SubjectIndex:x}));
    subject_pool_data = data;

    statusToStorage("subjectPoolData",JSON.stringify(data));
    subject_pool_current_index = null;
    statusToStorage("subject_pool_current_index",subject_pool_current_index);

    

    if(update_data){
        update_subject_pool_data(callback);
    }
}

function subjectPoolFromStorage(update_data = false, callback=null){
    if(! statusInStorage("subjectPoolData")){
        if(callback!=null) callback();
        return;
    }
    else{
        subject_pool_data =  JSON.parse(statusFromStorage("subjectPoolData"));
        subject_pool_current_index =  JSON.parse(statusFromStorage("subject_pool_current_index"));

        subject_pool = getCol(subject_pool_data,"SubjectIndex");
        if(update_data){
            update_subject_pool_data(callback);
        }
    }


}

function update_subject_pool_data(success_callback = null, error_callback = null){
    $.ajax({
        type: "GET",
        url: 'php/retrieve_table_where.php',
        dataType: "json",
        data: ({table_name:"subjects",where:{"SubjectIndex": subject_pool}}),
        success: function (result) {
            var lookup = Object.fromEntries(result.map(x=>[x.SubjectIndex,x]));

            subject_pool_data = [];
            $.each(subject_pool,function(index,subject_index){
                if(subject_index in lookup) subject_pool_data.push(lookup[subject_index]);
            })
            if(success_callback!=null) success_callback();
        },
        error: function(er){
            if(error_callback!=null) error_callback();
        }
    });

}