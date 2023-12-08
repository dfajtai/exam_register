<?php
use Medoo\Medoo;
session_start();

if(isset($_POST['animal_index']) && isset($_POST['animal_info']) && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $animal_index = $_POST['animal_index'];
    $animal_info = $_POST['animal_info'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $updated_values = array();
    
    foreach($animal_info as $key => $value) 
    {
        $updated_values[$key] = $value;
    }
    $updated_values["LastChange"] = Medoo::raw('NOW()');
    $updated_values["ChangedBy"] = $_SESSION['id'];

    $old_data = $database -> select("animals", "*", ["AnimalIndex"=>$animal_index]);
    if(count($old_data) >0){
        $_old_data = $old_data[0];
        $animal_info = ['Sex' => $_old_data["Sex"],
                          'Container' => $_old_data["Container"],
                          'Weight' => $_old_data["Weight"],
                          'Height' => $_old_data["Height"],
                          'Location' => $_old_data["Location"],
                          'Status' => $_old_data["Status"]];

        $database -> insert("animal_change_log", [
            "Index"=>$specimen_index, 
            "AnimalID"=>$_old_data["AnimalID"], 
            "StudyID"=>$_old_data["StudyID"],
            "AnimalName" => $_old_data["Name"],
            "AnimalGroup" => $_old_data["Group"],
            "ChangedBy" => $_old_data["ModifiedBy"],
            "Timestamp" => $_old_data["LastChange"],
            "AnimalData" => json_encode($animal_info)
        ]);
    }

    $res = $database -> update("animals", $updated_values, ["AnimalIndex"=>$animal_index]);

    unset($_POST['animal_index']);
    unset($_POST['animal_info']);
    echo json_encode($res);
}