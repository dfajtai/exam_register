<?php
include_once 'php_functions.php';
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

    $new_subject_info = $subject_info;
    array_decode_numbers($new_subject_info);
    
    $has_change = true;
    $old_subject_info = $database -> select("subjects", "*", ["SubjectIndex"=>$subject_index]);
    if(count($old_subject_info) >0){
        $change_test = $old_subject_info[0];

        foreach($change_test as $key => $value){
            if(!array_key_exists($key,$new_event_info)){
                unset($change_test[$key]);
            }
        }
        
        if($change_test==$new_subject_info){
            $has_change = false;            
        }
    }

    if($has_change){
        $new_subject_info["LastChange"] = Medoo::raw('NOW()');
        $new_subject_info["ModifiedBy"] = $_SESSION['id'];

        if(count($old_subject_info) >0){
            $_old_subject_info = $old_subject_info[0];
            $subject_info = [
                            'SubjectID' => $_old_subject_info['SubjectID'],
                            'StudyID' => $_old_subject_info['StudyID'],
                            'Name' => $_old_subject_info['Name'],
                            'Group' => $_old_subject_info['Group'],
                            'Age' => $_old_subject_info['Age'],
                            'Sex' => $_old_subject_info["Sex"],
                            'Container' => $_old_subject_info["Container"],
                            'Weight' => $_old_subject_info["Weight"],
                            'Height' => $_old_subject_info["Height"],
                            'Location' => $_old_subject_info["Location"], 
                            'Status' => $_old_subject_info["Status"],
                            "ModifiedBy" => $_old_subject_info["ModifiedBy"],
                            "Timestamp" => $_old_subject_info["LastChange"]
                        ];
            
            
            $database -> insert("subject_change_log", [
                "SubjectIndex"=>$subject_index, 
                "CurrentSubjectID"=> array_key_exists('SubjectID', $new_subject_info) ? $new_subject_info["SubjectID"] : $_old_subject_info['SubjectID'], 
                "CurrentStudyID"=>array_key_exists('StudyID', $new_subject_info) ? $new_subject_info["StudyID"] : $_old_subject_info['StudyID'],
                "CurrentSubjectName" => array_key_exists('Name', $new_subject_info) ? $new_subject_info["Name"] : $_old_subject_info['Name'],
                "CurrentSubjectGroup" => array_key_exists('Group', $new_subject_info) ? $new_subject_info["Group"] : $_old_subject_info['Group'],
                "ModifiedBy" => $new_subject_info["ModifiedBy"],
                "Timestamp" => $new_subject_info["LastChange"],
                "OldData" => json_encode($subject_info)
            ]);
        }

        $res = $database -> update("subjects", $new_subject_info, ["SubjectIndex"=>$subject_index]);

        unset($_POST['subject_index']);
        unset($_POST['subject_info']);
        echo json_encode($res);
    }
    else{
        unset($_POST['subject_index']);
        unset($_POST['subject_info']);
        echo json_encode("no change");
    }
}