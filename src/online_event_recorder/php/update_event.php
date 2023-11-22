<?php
use Medoo\Medoo;

if(isset($_POST['event_index']) && isset($_POST['event_info'])){// && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $event_index = $_POST['event_index'];
    $event_info = $_POST['event_info'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $updated_values = array();
    
    foreach($event_info as $key => $value) 
    {
        $updated_values[$key] = $value;
    }
    if(!array_key_exists('EventModifiedAt',$updated_values)){
        $updated_values["EventModifiedAt"] = Medoo::raw('NOW()');
    }
    $updated_values["EventModifiedBy"] = $_SESSION['id'];
    $updated_values["EventData"] = json_encode($updated_values["EventData"]);

    $old_event_data = $database -> select("event_log", "*", ["EventIndex"=>$event_index]);
    if(count($old_event_data) >0){
        $_old_data = $old_event_data[0];
        $event_info = ['EventStatus' => $_old_data["EventStatus"],
                        'EventComment' => $_old_data["EventComment"],
                        'EventData' => $_old_data["EventData"],
                        'EventLocation' => $_old_data["EventLocation"]];

        $database -> insert("specimen_change_log", [
            "EventIndex"=>$event_index, 
            "EventStudy"=>$_old_data["EventStudy"], 
            "EventSpecimen"=>$_old_data["EventSpecimen"],
            "EventModifiedBy" => $_old_data["EventModifiedBy"],
            "EventModifiedAt" => $_old_data["EventModified"],
            "EventInfo" => json_encode($event_info)
        ]);
    }

    $res = $database ->  update("event_log", $updated_values, ["EventIndex"=>$event_index]);

    unset($_POST['event_index']);
    unset($_POST['event_info']);
    // echo json_encode($res);
}