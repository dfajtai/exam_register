var locks_acquired = [];


function getLocks(resource_name, callback = null){
    if(callback === null){
        callback = function(){

        };
    }
    return $.ajax({
           type: "GET",
            url: 'php/retrieve_table_where.php',
            dataType: "json",
            data: {table_name: "resource_lock", where:{resource:resource_name}},
            success: function(result){
                var locked_indices = [];
                var locks = [];
                $.each(result,function(index,row){
                    var resource_ids = nullify_array(JSON.parse(row["resource_id"]));
                    resource_ids = resource_ids==null?[]:resource_ids;
                    locked_indices.push(...resource_ids);
                    locks.push({user:row["user"], resources:resource_ids, valid:row["valid"]});
                })
                callback(locked_indices,locks);
            }
        });
}

function getLocksFast(resource_name, callback = null){
    if(callback === null){
        callback = function(){

        };
    }
    return $.ajax({
           type: "GET",
            url: 'php/retrieve_table_where.php',
            dataType: "json",
            data: {table_name: "resource_lock", columns:["resource_id"], where:{resource:resource_name}},
            success: function(result){
                var locked_indices = [];
                $.each(result,function(index,row){
                    var resource_ids = JSON.parse(row["resource_id"]);
                    locked_indices.push(...resource_ids);
                })
                locked_indices = nullify_array(locked_indices);
                locked_indices = locked_indices== null? []: locked_indices;
                callback(locked_indices);
            }
        });
}

function getOwnLocks(callback = null){
    if(callback === null){
        callback = function(){
        };
    }
    return ajax = $.ajax({
        type: "POST",
        url: 'php/resource_lock_get_own.php',
        dataType: "json",
        data: {},
        success: function(result){
            var locks = [];
            $.each(result,function(index,row){
                var resource_ids = nullify_array(JSON.parse(row["resource_id"]));
                resource_ids = resource_ids==null?[]:resource_ids;
                locks.push({resource:row["resource_id"], resource_ids:resource_ids, valid:row["valid"]});
            })
            
            callback(locks);
        }
    });
}


function setLock(resource_name, resource_id, callback = null){
    if(callback === null){
        callback = function(){
        };
    }
    return $.ajax({
        type: "POST",
        url: 'php/resource_lock_set.php',
        dataType: "json",
        data: {resource: resource_name, resource_id:resource_id},
        success: function(result){            
            callback();
        }
    });
}

function releaseLock(resource_name, callback = null){
    if(callback === null){
        callback = function(){

        };
    }
    return $.ajax({
        type: "POST",
        url: 'php/resource_lock_release.php',
        dataType: "json",
        data: {resource: resource_name},
        success: function(result){            
            callback();
        }
    });
}