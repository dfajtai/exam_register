<?php
include_once 'php_functions.php';
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

    if(isset($_GET['where']) || isset($_GET['where_not']) ){
        $filter = array();
        if(isset($_GET['where'])){
            $where = $_GET['where'];
            foreach($where as $key => $value){
                $filter[$key] = $value;
            }
        }
        if(isset($_GET['where_not'])){
            $where_not = $_GET['where_not'];

            foreach($where_not as $key => $value){
                $filter[$key . "[!]"] = $value;            
            }
        }        

        $table_data = $database -> select($table, $columns, $filter);
    }
    else{
        $table_data = $database -> select($table, $columns);
    }

    unset($_GET['table_name']);
    unset($_GET['columns']);
    unset($_GET['where']);

    echo json_encode($table_data);
}

