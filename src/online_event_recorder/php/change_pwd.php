<?php 
use Medoo\Medoo;

if( isset($_POST['uname']) && 
   isset($_POST['pass1']) &&
   isset($_POST['pass2'])){

    include "db_conn.php";

    $uname = $_POST['uname'];
    $pass1 = $_POST['pass1'];
	$pass2 = $_POST['pass2'];

    $data = "&uname=".$uname;

    
	if(empty($uname)){
    	$em = "User name is required";
    	header("Location: ../sign_up.php?error=$em&$data");
	    exit;
    }else if(empty($pass1) or empty($pass2)){
    	$em = "Password is required";
    	header("Location: ../sign_up.php?error=$em&$data");
	    exit;
	}else if($pass1 != $pass2){
    	$em = "Passwords does not match";
    	header("Location: ../insign_updex.php?error=$em&$data");
	    exit;
    }else {
		global $database;
		$user_data = $database->select("users", "*", ["UserName" => $uname]);

		if($user_data[0]["CanResetPassword"] == 1){
			$pass_hash = password_hash($pass1, PASSWORD_DEFAULT);
			$database -> update("users",["UserPwd"=> $pass_hash, "CanResetPassword"=> 0,"PasswordChanged"=>Medoo::raw('NOW()')],
								[ "UserName" => $uname]);
			header("Location: ../index.php?success=Your password has been changed successfully&$data");
		}
		else{
			$em = "User cant reset password.";
			header("Location: ../index.php?error=$em&$data");
		}
		exit;
    }


}else {
	header("Location: ../index.php?error=error");
	exit;
}
