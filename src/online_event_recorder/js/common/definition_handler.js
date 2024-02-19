var defs = Object();

var users = {};
var current_user = null;

function simpleChecksum(input){
    return (CRC32.str(JSON.stringify(input))>>>0).toString(16);
}

function updateRemoteDefinitionChecksums(){
    // get definition tables
    $.ajax({type:"GET",
            url:"php/retrieve_table.php",
            dataType:"json",
            data:({table_name:"definition_tables"}),
            success:function(result){
                // iterate over tables in definition tables
                result.forEach((e)=>{
                    $.ajax({
                        // retrieve the table
                        type:"GET",
                        url:"php/retrieve_table.php",
                        dataType:"json",
                        data:({table_name:e.TableName}),
                        success:function(_result){
                            // calculate its checksum
                            var new_checksum = simpleChecksum(_result);
                            // update remote checksum if it is changed
                            if (new_checksum!=e.Checksum){
                                $.ajax({
                                    type:"POST",
                                    url:"php/update_table.php",
                                    dataType:"json",
                                    data:({table_name:"definition_tables",
                                           key_info:{key:"TableID",value:e.TableID},
                                           updated_info:{Checksum:new_checksum}}),
                                    success:function(_e){
                                        console.log("Checksum of table '" + e.TableName + "' has been updated");
                                        
                                    }
                                })
                            }
                        }
                    })
                });
            }}
    );
}

function updateRemoteDefinitionChecksum(table_name=null, current_data = null){
    if(table_name==null){
        updateRemoteDefinitionChecksums();
        return
    }
    $.ajax({type:"GET",
            url:"php/retrieve_table.php",
            dataType:"json",
            data:({table_name:"definition_tables"}),
            success:function(table_info){
                var old_checksum = getEntryFieldWhere(table_info,"TableName",table_name,"Checksum");
                if(current_data == null){
                    $.ajax({
                        // retrieve the table
                        type:"GET",
                        url:"php/retrieve_table.php",
                        dataType:"json",
                        data:({table_name:table_name}),
                        success:function(_result){
                            var valid_cols = getDefCols(table_name);
                            var data = filterObjListKeys(_result,valid_cols);

                            // calculate its checksum
                            var new_checksum = simpleChecksum(data);
                            // update remote checksum if it is changed
                            if (new_checksum!=old_checksum){
                                $.ajax({
                                    type:"POST",
                                    url:"php/update_table.php",
                                    dataType:"json",
                                    data:({table_name:"definition_tables",
                                           key_info:{key:"TableName",value:table_name},
                                           updated_info:{Checksum:new_checksum}}),
                                    success:function(_e){
                                        console.log("Checksum of table '" + table_name + "' has been updated");
                                        
                                    }
                                })
                            }
                        }
                    })
                }else{
                    // if(!isArray(current_data)){
                    //     current_data = objectToArray(current_data);
                    // }

                    var valid_cols = getDefCols(table_name);
                    var data = filterObjListKeys(current_data,valid_cols);
                    var new_checksum = simpleChecksum(data);
                    // update remote checksum if it is changed
                    if (new_checksum!=old_checksum){
                        $.ajax({
                            type:"POST",
                            url:"php/update_table.php",
                            dataType:"json",
                            data:({table_name:"definition_tables",
                                    key_info:{key:"TableName",value:table_name},
                                    updated_info:{Checksum:new_checksum}}),
                            success:function(_e){
                                console.log("Checksum of table '" + table_name + "' has been updated");
                            }
                        })
                    }
                }


    }});
    
}

function updateLocalDefinitionDatabase(callback){
    $.ajax({type:"GET",
        url:"php/retrieve_table.php",
        dataType:"json",
        data:({table_name:"definition_tables"}),
        success:function(result){
            if (localStorage.getItem("definition_tables")===null){
                localStorage.setItem("definition_tables",JSON.stringify(result));
                var local_definition_tables = result;
            }
            else{
                var local_definition_tables = JSON.parse(localStorage.getItem("definition_tables"));
            }
            
            let local_version = Object.fromEntries(local_definition_tables.map(x=>[x.TableName,{timestamp:x.LastChange,checksum:x.Checksum}]));
            let remote_version = Object.fromEntries(result.map(x=>[x.TableName,{timestamp:x.LastChange,checksum:x.Checksum}]));
            
            // console.log(local_version);
            // console.log(remote_version);

            
            var promises = [];

            $.each(remote_version,function(table_name,table_info){
                if(localStorage.getItem(table_name) === null){
                    // table not exists in local storage
                    var request = $.ajax({type:"GET",
                            url:"php/retrieve_table.php",
                            dataType:"json",
                            data:({table_name:table_name}),
                            success:function(_result){
                                localStorage.setItem(table_name,JSON.stringify(_result));
                                defs[table_name] = _result;

                                console.log("Table '"+ table_name + "' updated to its '"+ table_info.timestamp + "' version.");
                                localStorage.setItem("definition_tables",JSON.stringify(result));

                                defs[table_name] = JSON.parse(localStorage.getItem(table_name));
                            }});

                    promises.push(request);
                    return true;
                }

                try {
                    var local_version_checksum = simpleChecksum(JSON.parse(localStorage.getItem(table_name)));
                } catch (error) {
                    var local_version_checksum ="";
                }
                

                if(!local_version.hasOwnProperty(table_name)){
                    // local definition tables missing the entry
                    var request = $.ajax({type:"GET",
                            url:"php/retrieve_table.php",
                            dataType:"json",
                            data:({table_name:table_name}),
                            success:function(_result){
                                localStorage.setItem(table_name,JSON.stringify(_result));
                                defs[table_name] = _result;

                                console.log("Table '"+ table_name + "' updated to its '"+ table_info.timestamp + "' version.");
                                localStorage.setItem("definition_tables",JSON.stringify(result));

                                defs[table_name] = JSON.parse(localStorage.getItem(table_name));
                            }});

                    promises.push(request);
                    return true;
                }
                else if(moment(table_info.timestamp).isAfter(local_version[table_name].timestamp)){
                    // local version is outdated
                    var request = $.ajax({type:"GET",
                            url:"php/retrieve_table.php",
                            dataType:"json",
                            data:({table_name:table_name}),
                            success:function(_result){
                                localStorage.setItem(table_name,JSON.stringify(_result));
                                defs[table_name] = _result;

                                console.log("Table '"+ table_name + "' updated to its '"+ table_info.timestamp + "' version.");
                                localStorage.setItem("definition_tables",JSON.stringify(result));

                                defs[table_name] = JSON.parse(localStorage.getItem(table_name));
                            }})
                    promises.push(request);
                    return true;
                }
                else if(table_info.checksum!= local_version_checksum){
                    // local version is altered
                    var request = $.ajax({type:"GET",
                            url:"php/retrieve_table.php",
                            dataType:"json",
                            data:({table_name:table_name}),
                            success:function(_result){
                                localStorage.setItem(table_name,JSON.stringify(_result));
                                defs[table_name] = _result;

                                console.log("Table '"+ table_name + "' updated to its '"+ table_info.timestamp + "' version.");
                                localStorage.setItem("definition_tables",JSON.stringify(result));

                                defs[table_name] = JSON.parse(localStorage.getItem(table_name));
                            }})
                    promises.push(request);
                    return true;
                }
            })

            var users_request = $.ajax({type:"GET",
                url:"php/retrieve_table_where.php",
                dataType:"json",
                data:({table_name:"users",columns:["UserID","UserName"]}),
                success:function(result){
                    $.each(result,function(index,data){
                        users[data["UserID"]] = data["UserName"];
                    })
                    // console.log(users);
                }})
            promises.push(users_request);

            var current_user_request = $.ajax({type:"GET",
                url:"php/get_own_id.php",
                dataType:"json",
                data:{},
                success:function(result){
                    current_user = result;
                }})
            promises.push(current_user_request);
            

            $.when.apply(null,promises).done(function(){
                if(callback != null){
                    callback();
                }
            })
            
        }})        
}
