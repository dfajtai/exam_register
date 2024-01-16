<?php
include_once 'php_functions.php';

use Medoo\Medoo;
session_start();



if(isset($_POST['event_index']) && isset($_POST['event_info']) && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $event_index = $_POST['event_index'];
    $event_info = $_POST['event_info'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $new_event_info = $event_info;
    array_decode_numbers($new_event_info);

    // var_error_log($new_event_info);

    $updated_data = null;
    if(array_key_exists('EventData',$new_event_info)){
        $updated_data = $new_event_info["EventData"];
        unset($new_event_info["EventData"]); 

        array_decode_numbers($updated_data);
        $updated_data = (object) $updated_data;
    }

    // var_error_log($updated_data);

    $has_change = true;
    $old_event_info = $database -> select("event_log", "*", ["EventIndex"=>$event_index]);
    if(count($old_event_info) >0){
        $change_test = $old_event_info[0];
        unset($change_test["EventIndex"]); 
        unset($change_test["EventModifiedAt"]); 
        unset($change_test["EventModifiedBy"]);
        $old_data = json_decode($change_test["EventData"]);
        unset($change_test["EventData"]);
        
        // var_error_log($change_test);
        // var_error_log($new_event_info);

        // var_error_log($old_data);
        // var_error_log($updated_data);

        if($change_test==$new_event_info && $old_data==$updated_data){
            $has_change = false;            
        }
    }


    if($has_change){
        $new_event_info["EventData"] = json_encode($updated_data,JSON_NUMERIC_CHECK);

        // var_error_log($new_event_inf o);
    
        if(!array_key_exists('EventModifiedAt',$new_event_info)){
            $new_event_info["EventModifiedAt"] = Medoo::raw('NOW()');
        }
    
        $new_event_info["EventModifiedBy"] = $_SESSION['id'];
        
        if(count($old_event_info) >0){
            $_old_event_info = $old_event_info[0];
            $old_event_data = ['EventStatus' => $_old_event_info["EventStatus"],
                            'EventPlannedTime' => $_old_event_info["EventPlannedTime"],
                            'EventComment' => $_old_event_info["EventComment"],
                            'EventData' => $_old_event_info["EventData"],
                            'EventLocation' => $_old_event_info["EventLocation"],
                            "EventModifiedBy" => $_old_event_info["EventModifiedBy"],
                            "EventModifiedAt" => $_old_event_info["EventModifiedAt"]];
    
            $database -> insert("event_change_log", [
                "EventIndex"=>$event_index, 
                "EventStudy"=>$_old_event_info["EventStudy"], 
                "EventSubject"=>$_old_event_info["EventSubject"],
                "EventModifiedBy" => $new_event_info["EventModifiedBy"],
                "EventModifiedAt" => $new_event_info["EventModifiedAt"],
                "EventData" => json_encode($old_event_data)
            ]);
        }
    
        $res = $database ->  update("event_log", $new_event_info, ["EventIndex"=>$event_index]);
    
        unset($_POST['event_index']);
        unset($_POST['event_info']);
        echo json_encode($res);
    }
    else{
        unset($_POST['event_index']);
        unset($_POST['event_info']);
        echo json_encode("no change");
    }
    
}