<?php  

session_start();
$uname =$_SESSION['uname'];
session_unset();
session_destroy();

header("Location: index.php?uname=".$uname);

exit;