<?php
session_start();

if(isset($_GET['table_name'])){ 
// if(isset($_GET['table_name']) && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $table = $_GET['table_name'];
    if(isset($_GET['columns'])){$columns = $_GET['columns'];}else{$columns = "*";};

    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    if(isset($_GET['where'])){
        $table_data = $database -> select($table, $columns, $_GET['where']);
    }
    else{
        $table_data = $database -> select($table, $columns);
    }

    unset($_GET['table_name']);
    unset($_GET['columns']);
    unset($_GET['where']);

    echo json_encode($table_data);
}

