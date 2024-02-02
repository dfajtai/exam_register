<?php
session_start();

if(isset($_POST['resource'])  && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $resource = $_POST['resource'];
    $user = $_SESSION['id'];

    $resource_id = "[]";

    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $res = $database -> update("resource_lock", 
                                ["resource_id"=>$resource_id, "valid"=>NULL], 
                                ["AND"=>["resource"=>$resource,"user"=>$user]]);

    unset($_POST['resource']);
    
    echo json_encode($res);
}