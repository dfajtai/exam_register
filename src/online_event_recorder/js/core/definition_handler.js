function initializeLocalDefinitionDatabase(){
    return $.when({

        unit_type_definitions: $.ajax({type:"GET",url:"php/retrieve_table.php",dataType:"json",data:({table_name:"unit_type_definitions"})}),
        unit_definitions: $.ajax({type:"GET",url:"php/retrieve_table.php",dataType:"json",data:({table_name:"unit_definitions"})}),
        specimen_status_definitions: $.ajax({type:"GET",url:"php/retrieve_table.php",dataType:"json",data:({table_name:"specimen_status_definitions"})}),
        specimen_side_definitions: $.ajax({type:"GET",url:"php/retrieve_table.php",dataType:"json",data:({table_name:"specimen_side_definitions"})}),
        specimen_sex_definitions: $.ajax({type:"GET",url:"php/retrieve_table.php",dataType:"json",data:({table_name:"specimen_sex_definitions"})}),
        specimen_bodypart_definitions: $.ajax({type:"GET",url:"php/retrieve_table.php",dataType:"json",data:({table_name:"specimen_bodypart_definitions"})}),
        location_definitions: $.ajax({type:"GET",url:"php/retrieve_table.php",dataType:"json",data:({table_name:"location_definitions"})}), 
        event_type_definitions: $.ajax({type:"GET",url:"php/retrieve_table.php",dataType:"json",data:({table_name:"event_type_definitions"})}), 
        event_status_definitions: $.ajax({type:"GET",url:"php/retrieve_table.php",dataType:"json",data:({table_name:"event_status_definitions"})}), 
        event_definitions: $.ajax({type:"GET",url:"php/retrieve_table.php",dataType:"json",data:({table_name:"event_definitions"})}), 
        consumable_type_definitions: $.ajax({type:"GET",url:"php/retrieve_table.php",dataType:"json",data:({table_name:"consumable_type_definitions"})}), 
        consumable_definitions: $.ajax({type:"GET",url:"php/retrieve_table.php",dataType:"json",data:({table_name:"consumable_definitions"})}), 
        asset_definitions: $.ajax({type:"GET",url:"php/retrieve_table.php",dataType:"json",data:({table_name:"asset_definitions"})}),


    }).then(function(resp){
        localStorage.setItem("unit_type_definitons",resp.unit_type_definitions);
        localStorage.setItem("unit_definitions",resp.unit_definitions);
        localStorage.setItem("specimen_status_definitions",resp.specimen_status_definitions);
        localStorage.setItem("specimen_side_definitions",resp.specimen_side_definitions);
        localStorage.setItem("specimen_sex_definitions",resp.specimen_sex_definitions);
        localStorage.setItem("specimen_bodypart_definitions",resp.specimen_bodypart_definitions);
        localStorage.setItem("location_definitions",resp.location_definitions);
        localStorage.setItem("event_type_definitions",resp.event_type_definitions);
        localStorage.setItem("event_status_definitions",resp.event_status_definitions);
        localStorage.setItem("event_type_definitions",resp.event_type_definitions);
        localStorage.setItem("event_definitions",resp.event_definitions);
        localStorage.setItem("consumable_type_definitions",resp.consumable_type_definitions);
        localStorage.setItem("consumable_definitions",resp.consumable_definitions);
        localStorage.setItem("asset_definitions",resp.asset_definitions);
    });
}

function simpleChecksum(input){
    return (CRC32.str(JSON.stringify(input))>>>0).toString(16);
}

function updateRemoteDefinitionChecksum(){
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


function updateLocalDefinitionDatabase(){
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

                $.each(remote_version, function(table_name, table_info){
                    if(localStorage.getItem(table_name) === null){
                        // table not exists in local storage
                        $.ajax({type:"GET",
                                            url:"php/retrieve_table.php",
                                            dataType:"json",
                                            data:({table_name:table_name}),
                                            success:function(_result){
                                            localStorage.setItem(table_name,JSON.stringify(_result),
                                            console.log("Table '"+ table_name + "' updated to its '"+ table_info.timestamp + "' version."));
                                            localStorage.setItem("definition_tables",JSON.stringify(result));
                                        }})
                        return;
                    }

                    try {
                        var local_version_checksum = simpleChecksum(JSON.parse(localStorage.getItem(table_name)));
                    } catch (error) {
                        var local_version_checksum ="";
                    }
                    

                    if(!local_version.hasOwnProperty(table_name)){
                        // local definition tables missing the entry
                        $.ajax({type:"GET",
                                            url:"php/retrieve_table.php",
                                            dataType:"json",
                                            data:({table_name:table_name}),
                                            success:function(_result){
                                            localStorage.setItem(table_name,JSON.stringify(_result),
                                            console.log("Table '"+ table_name + "' updated to its '"+ table_info.timestamp + "' version."));
                                            localStorage.setItem("definition_tables",JSON.stringify(result));
                                        }})
                        return;
                    }
                    else if(moment(table_info.timestamp).isAfter(local_version[table_name].timestamp)){
                        // local version is outdated
                        $.ajax({type:"GET",
                                            url:"php/retrieve_table.php",
                                            dataType:"json",
                                            data:({table_name:table_name}),
                                            success:function(_result){
                                            localStorage.setItem(table_name,JSON.stringify(_result),
                                            console.log("Table '"+ table_name + "' updated to its '"+ table_info.timestamp + "' version."));
                                            localStorage.setItem("definition_tables",JSON.stringify(result));
                                        }})
                        return;
                    }
                    else if(table_info.checksum!= local_version_checksum){
                        // local version is altered
                        $.ajax({type:"GET",
                                            url:"php/retrieve_table.php",
                                            dataType:"json",
                                            data:({table_name:table_name}),
                                            success:function(_result){
                                            localStorage.setItem(table_name,JSON.stringify(_result),
                                            console.log("Table '"+ table_name + "' updated to its '"+ table_info.timestamp + "' version."));
                                            localStorage.setItem("definition_tables",JSON.stringify(result));
                                        }})
                        return;
                    }
                });
                
            }
        })

}