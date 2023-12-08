<?php
session_start();

if(isset($_GET['study_id']) && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $study_id = $_GET['study_id'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }
    $table_data = $database -> select("animals", "*", ["StudyID"=>$study_id]);
    unset($_GET['study_id']);
    echo json_encode($table_data);
}