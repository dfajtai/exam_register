<?php
session_start();

if(isset($_GET['subject_index']) && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $subject_index = $_GET['subject_index'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }
    $table_data = $database -> select("subjects", "*", ["SubjectIndex" => $subject_index]);
    unset($_GET['subject_id']);
    echo json_encode($table_data);
}