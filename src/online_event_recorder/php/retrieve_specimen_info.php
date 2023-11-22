<?php

if(isset($_GET['study_id']) && isset($_GET['specimen_id'])){// && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $study_id = $_GET['study_id'];
    $specimen_id = $_GET['specimen_id'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }
    $table_data = $database -> select("specimens", "*", ["StudyID"=>$study_id,"SpecimenID" => $specimen_id]);
    unset($_GET['study_id']);
    unset($_GET['specimen_id']);
    echo json_encode($table_data);
}