<?php
use Medoo\Medoo;
session_start();

if(isset($_POST['subject_index']) && isset($_POST['subject_info']) && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $subject_index = $_POST['subject_index'];
    $subject_info = $_POST['subject_info'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $updated_values = array();
    
    foreach($subject_info as $key => $value) 
    {
        $updated_values[$key] = $value;
    }
    $updated_values["LastChange"] = Medoo::raw('NOW()');
    $updated_values["ChangedBy"] = $_SESSION['id'];

    $old_data = $database -> select("subjects", "*", ["SubjectIndex"=>$subject_index]);
    if(count($old_data) >0){
        $_old_data = $old_data[0];
        $subject_info = ['Sex' => $_old_data["Sex"],
                          'Container' => $_old_data["Container"],
                          'Weight' => $_old_data["Weight"],
                          'Height' => $_old_data["Height"],
                          'Location' => $_old_data["Location"],
                          'Status' => $_old_data["Status"]];

        $database -> insert("subject_change_log", [
            "Index"=>$subject_index, 
            "SubjectID"=>$_old_data["SubjectID"], 
            "StudyID"=>$_old_data["StudyID"],
            "SubjectName" => $_old_data["Name"],
            "SubjectGroup" => $_old_data["Group"],
            "ChangedBy" => $_old_data["ModifiedBy"],
            "Timestamp" => $_old_data["LastChange"],
            "SubjectData" => json_encode($subject_info)
        ]);
    }

    $res = $database -> update("subjects", $updated_values, ["SubjectIndex"=>$subject_index]);

    unset($_POST['subject_index']);
    unset($_POST['subject_info']);
    echo json_encode($res);
}