<?php
require_once(__DIR__.'/../vendor/autoload.php');
use Medoo\Medoo;

session_start();

if(isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $user = $_SESSION['id'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $now = Medoo::raw('NOW()');

    if(isset($_GET['resource'])){
        $res = $database -> select("resource_locks",
        ["resource","resource_id"],
        ["AND" => ["valid[>=]"=>date("Y-m-d H:i:s"),"user[!]"=>$user,"resource"=>$_GET['resource']]]);   
    }
    else{
        $res = $database -> select("resource_locks",
        ["resource","resource_id"],
        ["AND" => ["valid[>=]"=>date("Y-m-d H:i:s"),"user[!]"=>$user]]);    
    }


    

    echo json_encode($res);
}