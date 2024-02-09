<?php  

session_start();

$uname = $_SESSION['uname'];
setcookie('uname', $uname, time()+3600,'/');

session_unset();
session_destroy();
session_start();

echo json_encode('Logged out due to inactivity.');
