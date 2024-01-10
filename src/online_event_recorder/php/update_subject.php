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
    $updated_values["ModifiedBy"] = $_SESSION['id'];

    $old_data = $database -> select("subjects", "*", ["SubjectIndex"=>$subject_index]);
    if(count($old_data) >0){
        $_old_data = $old_data[0];
        $subject_info = [
                         'SubjectID' => $_old_data['SubjectID'],
                         'StudyID' => $_old_data['StudyID'],
                         'Name' => $_old_data['Name'],
                         'Group' => $_old_data['Group'],
                         'Age' => $_old_data['Age'],
                         'Sex' => $_old_data["Sex"],
                         'Container' => $_old_data["Container"],
                         'Weight' => $_old_data["Weight"],
                         'Height' => $_old_data["Height"],
                         'Location' => $_old_data["Location"], 
                         'Status' => $_old_data["Status"]];
         
        
        $database -> insert("subject_change_log", [
            "SubjectIndex"=>$subject_index, 
            "CurrentSubjectID"=> array_key_exists('SubjectID', $updated_values) ? $updated_values["SubjectID"] : $_old_data['SubjectID'], 
            "CurrentStudyID"=>array_key_exists('StudyID', $updated_values) ? $updated_values["StudyID"] : $_old_data['StudyID'],
            "CurrentSubjectName" => array_key_exists('Name', $updated_values) ? $updated_values["Name"] : $_old_data['Name'],
            "CurrentSubjectGroup" => array_key_exists('Group', $updated_values) ? $updated_values["Group"] : $_old_data['Group'],
            "ModifiedBy" => $_old_data["ModifiedBy"],
            "Timestamp" => $_old_data["LastChange"],
            "OldData" => json_encode($subject_info)
        ]);
    }

    $res = $database -> update("subjects", $updated_values, ["SubjectIndex"=>$subject_index]);

    unset($_POST['subject_index']);
    unset($_POST['subject_info']);
    echo json_encode($res);
}