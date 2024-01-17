<?php
include_once 'php_functions.php';
use Medoo\Medoo;
session_start();

if(isset($_POST['subject_info']) && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $subject_info= $_POST['subject_info'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }

    $multiple_data =  isset($_POST['multiple']);
    
    $_subject_info = [];
    if(!$multiple_data){
        $_subject_info[] = $subject_info;
        $subject_info = $_subject_info;
    }

    $subject_data = [];
    foreach ($subject_info as $index => $value) {
        // single instance 
        $_subject_data = $value; 
        array_decode_numbers($_subject_data);
        if(!array_key_exists('LastChange',$_subject_data)){
            $_subject_data["LastChange"] = Medoo::raw('NOW()');
        }
        $_subject_data["ModifiedBy"] = $_SESSION['id'];

        $subject_data[]= $_subject_data;
    }

    $res = $database -> insert("subjects", $subject_data);

    unset($_POST['subject_info']);
    unset($_POST['multiple']);
    echo json_encode($res);
}


