<?php
use Medoo\Medoo;

if(isset($_POST['table_name']) && isset($_POST['key_info']) && isset($_POST['updated_info'])){// && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $table_name = $_POST['table_name'];
    $key_info = $_POST['key_info'];
    $updated_info = $_POST['updated_info'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $res = $database -> update($table_name, $updated_info, [$key_info["key"]=>$key_info["value"]]);

    unset($_POST['table_name']);
    unset($_POST['key_info']);
    unset($_POST['updated_info']);

}