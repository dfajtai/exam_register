<?php

if(isset($_GET['event_index'])){// && isset($_SESSION['id']) && isset($_SESSION['fname'])){
    $event_index = $_GET['event_index'];
    global $database;
    if(is_null($database)) {
        require_once 'db_conn.php';
        global $database;
    }
    $table_data = $database -> select("event_log", "*", ["EventIndex" => $event_index]);
    unset($_GET['event_index']);
    echo json_encode($table_data);
}