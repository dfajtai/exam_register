<?php
include_once 'php_functions.php';
use Medoo\Medoo;
session_start();

if(isset($_POST['event_info']) && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $event_info = $_POST['event_info'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $multiple_data =  isset($_POST['multiple']);
    
    $_event_info = [];
    if(!$multiple_data){
        $_event_info[] = $event_info;
        $event_info = $_event_info;
    }

    $event_data = [];
    foreach ($event_info as $index => $value) {
        // single isntance 
        $_event_data = $value; 
        array_decode_numbers($_event_data);
        if(!array_key_exists('EventModifiedAt',$_event_data)){
            $_event_data["EventModifiedAt"] = Medoo::raw('NOW()');
        }
        $_event_data["EventModifiedBy"] = $_SESSION['id'];
        if(array_key_exists('EventData',$_event_data)){
            $_event_data["EventData"] = json_encode($_event_data["EventData"]);
        }
        $event_data[]= $_event_data;
    }
   
    $res = $database -> insert("event_log", $event_data);

    unset($_POST['multiple']);
    unset($_POST['event_info']);
    echo json_encode($res);
}