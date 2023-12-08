<?php
use Medoo\Medoo;
session_start();

if(isset($_POST['table_name'])  && isset($_POST['new_info']) && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $table_name = $_POST['table_name'];
    $new_info = $_POST['new_info'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $res = $database -> insert($table_name, $new_info);

    unset($_POST['table_name']);
    unset($_POST['new_info']);
    echo json_encode($res);
}