var locks_acquired = [];


function getLocks(resource_name, callback = null, return_ajax = false){
    if(callback === null){
        callback = function(){

        };
    }
    var ajax = $.ajax({
        type: "GET",
        url: 'php/retrieve_table_where.php',
        dataType: "json",
        data: {table_name: "resource_lock", where:{resource:resource_name}},
        success: function(result){
            var locked_indices = [];
            var locks = {};
            $.each(result,function(index,row){
                var resource_ids = JSON.parse(row["resource_id"]);
                locked_indices.push(...resource_ids);
                locks[row["user"]]=resource_ids;
            })
            
            callback(locked_indices,locks);
        }
    });
    if(return_ajax){
        return ajax;
    };
    $.when(ajax);
}

function getOwnLocks(callback = null, return_ajax = false){
    if(callback === null){
        callback = function(){
        };
    }
    var ajax = $.ajax({
        type: "POST",
        url: 'php/resource_lock_get_own.php',
        dataType: "json",
        data: {},
        success: function(result){
            var locked_indices = [];
            var locks = {};
            $.each(result,function(index,row){
                var resource_ids = JSON.parse(row["resource_id"]);
                locked_indices.push(resource_ids);
                locks[row["resource"]]=resource_ids;
            })
            
            callback(locked_indices,locks);
        }
    });
    if(return_ajax){
        return ajax;
    };
    $.when(ajax);

}

function setLock(resource_name, resource_id, callback = null, return_ajax = false){
    if(callback === null){
        callback = function(){

        };
    }
    var ajax = $.ajax({
        type: "POST",
        url: 'php/resource_lock_set.php',
        dataType: "json",
        data: {resource: resource_name, resource_id:resource_id},
        success: function(result){            
            callback();
        }
    });
    if(return_ajax){
        return ajax;
    };
    $.when(ajax);;
}

function releaseLock(resource_name, callback = null, return_ajax = false){
    if(callback === null){
        callback = function(){

        };
    }
    var ajax = $.ajax({
        type: "POST",
        url: 'php/resource_lock_release.php',
        dataType: "json",
        data: {resource: resource_name},
        success: function(result){            
            callback();
        }
    });
    if(return_ajax){
        return ajax;
    };
    $.when(ajax);

}