<?php  

session_start();

$uname = $_SESSION['uname'];

// session_unset();
session_destroy();

session_start();

setcookie('uname', $uname, time()+3600,'/');
echo json_encode('Logged out due to inactivity.');
