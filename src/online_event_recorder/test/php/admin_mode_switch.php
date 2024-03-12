<?php  
session_start();
if($_SESSION["adminMode"]==0){
    $_SESSION["adminMode"]=$_SESSION["isAdmin"];
}
else{
    $_SESSION["adminMode"] = 0;
}

echo json_encode($_SESSION["adminMode"]);