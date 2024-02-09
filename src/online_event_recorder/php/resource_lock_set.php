<?php
require_once(__DIR__.'/../vendor/autoload.php');
use Medoo\Medoo;
session_start();

if(isset($_POST['resource']) && isset($_POST['resource_id'])  && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $resource = $_POST['resource'];
    $user = $_SESSION['id'];

    $resource_id = json_encode($_POST['resource_id']);
    $valid = Medoo::raw("(NOW() + INTERVAL 3 MINUTE)");
    // $valid = Medoo::raw('NOW()');
    
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $res = $database -> update("resource_lock", 
                                ["resource_id"=>$resource_id, "valid"=>$valid], 
                                ["AND"=>["resource"=>$resource,"user"=>$user]]);

    unset($_POST['resource']);
    unset($_POST['resource_id']);
    
    echo json_encode($res);
}