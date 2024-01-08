<?php  
session_start();
$_SESSION["isAdmin"] = 0;

echo json_encode($_SESSION["isAdmin"]);