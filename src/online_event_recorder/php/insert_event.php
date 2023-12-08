<?php
use Medoo\Medoo;
session_start();

if(isset($_POST['event_info']) && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $event_info = $_POST['event_info'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $event_data = array();
    
    foreach($event_info as $key => $value) 
    {
        $event_data[$key] = $value;
    }
    if(!array_key_exists('EventModifiedAt',$event_data)){
        $event_data["EventModifiedAt"] = Medoo::raw('NOW()');
    }
    $event_data["EventModifiedBy"] = $_SESSION['id'];
    $event_data["EventData"] = json_encode($event_data["EventData"]);

    $res = $database -> insert("event_log", $event_data);

    unset($_POST['event_index']);
    unset($_POST['event_info']);
    echo json_encode($res);
}