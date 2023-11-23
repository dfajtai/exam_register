<?php
use Medoo\Medoo;

if(isset($_POST['specimen_index']) && isset($_POST['specimen_info'])){// && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $specimen_index = $_POST['specimen_index'];
    $specimen_info = $_POST['specimen_info'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $updated_values = array();
    
    foreach($specimen_info as $key => $value) 
    {
        $updated_values[$key] = $value;
    }
    $updated_values["SpecimenLastChange"] = Medoo::raw('NOW()');
    //$updated_values["SpecimenChangedBy"] = $_SESSION['id'];

    $old_data = $database -> select("specimens", "*", ["SpecimenIndex"=>$specimen_index]);
    if(count($old_data) >0){
        $_old_data = $old_data[0];
        $specimen_info = ['SpecimenSex' => $_old_data["SpecimenSex"],
                          'SpecimenContainer' => $_old_data["SpecimenContainer"],
                          'SpecimenWeight' => $_old_data["SpecimenWeight"],
                          'SpecimenHeight' => $_old_data["SpecimenHeight"],
                          'SpecimenLocation' => $_old_data["SpecimenLocation"],
                          'SpecimenStatus' => $_old_data["SpecimenStatus"]];

        $database -> insert("specimen_change_log", [
            "SpecimenIndex"=>$specimen_index, 
            "SpecimenID"=>$_old_data["SpecimenID"], 
            "StudyID"=>$_old_data["StudyID"],
            "SpecimenName" => $_old_data["SpecimenName"],
            "SpecimenGroup" => $_old_data["SpecimenGroup"],
            "ChangedBy" => $_old_data["SpecimenModifiedBy"],
            "Timestamp" => $_old_data["SpecimenLastChange"],
            "Specimendata" => json_encode($specimen_info)
        ]);
    }

    $res = $database -> update("specimens", $updated_values, ["SpecimenIndex"=>$specimen_index]);

    unset($_POST['specimen_index']);
    unset($_POST['specimen_info']);
    echo json_encode($res);
}