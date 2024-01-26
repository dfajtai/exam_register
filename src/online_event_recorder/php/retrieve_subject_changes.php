<?php
session_start();

if(isset($_GET['subject_index'])&& isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $subject_index = $_GET['subject_index'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }
    if(is_array($subject_index)){
        $table_data = $database -> select("subject_change_log", "*", ["OR" => ["SubjectIndex" => $subject_index]]);
    }
    else{
        $table_data = $database -> select("subject_change_log", "*", ["SubjectIndex" => $subject_index]);
    }
    unset($_GET['subject_index']);
    echo json_encode($table_data);
}