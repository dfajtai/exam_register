<?php
session_start();

if(isset($_POST['lock_id'])  && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $lock_id = $_POST['lock_id'];
    
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $res = $database -> update("resource_locks", 
                                ["resource_id"=>"[]", "valid"=>NULL], 
                                ["lock_id"=>$lock_id]);

    unset($_POST['lock_id']);
    
    echo json_encode($res);
}