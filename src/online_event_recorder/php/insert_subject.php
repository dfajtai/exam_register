<?php
use Medoo\Medoo;
session_start();

if(isset($_POST['subject_info']) && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $subject_info= $_POST['subject_info'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $subject_data = $subject_info;
    array_decode_numbers($subject_data);

    if(!array_key_exists('LastChange',$subject_data)){
        $subject_data["LastChange"] = Medoo::raw('NOW()');
    }
    $subject_data["ModifiedBy"] = $_SESSION['id'];

    $res = $database -> insert("subjects", $subject_data);

    unset($_POST['subject_info']);
    echo json_encode($res);
}