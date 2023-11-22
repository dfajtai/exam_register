<?php

if(isset($_GET['table_name'])){// && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $selected_table_name = $_GET['table_name'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }
    $table_data = $database -> select($selected_table_name, "*");
    unset($_GET['table_name']);
    echo json_encode($table_data);
}

