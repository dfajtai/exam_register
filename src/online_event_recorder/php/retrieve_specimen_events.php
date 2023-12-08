<?php
session_start();

if(isset($_GET['study_id']) && isset($_GET['animal_id']) && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $study_id = $_GET['study_id'];
    $animal_id = $_GET['animal_id'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }
    $table_data = $database -> select("event_log", "*", ["EventStudy"=>$study_id,"EventAnimal" => $animal_id]);
    unset($_GET['study_id']);
    echo json_encode($table_data);
}