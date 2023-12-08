<?php
session_start();

if(isset($_GET['study_id']) && isset($_GET['animal_index']) && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $study_id = $_GET['study_id'];
    $animal_index = $_GET['animal_index'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }
    $table_data = $database -> select("animals", "*", ["StudyID"=>$study_id,"AnimalIndex" => $animal_index]);
    unset($_GET['study_id']);
    unset($_GET['specimen_id']);
    echo json_encode($table_data);
}