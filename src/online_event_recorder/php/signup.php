<?php 
use Medoo\Medoo;

if(isset($_POST['fname']) && 
   isset($_POST['uname']) && 
   isset($_POST['pass1']) &&
   isset($_POST['pass2'])){

    include "db_conn.php";

    $fname = $_POST['fname'];
    $uname = $_POST['uname'];
    $pass1 = $_POST['pass1'];
	$pass2 = $_POST['pass2'];

    $data = "fname=".$fname."&uname=".$uname;

    
    if (empty($fname)) {
    	$em = "Full name is required";
    	header("Location: ../index.php?error=$em&$data");
	    exit;
    }else if(empty($uname)){
    	$em = "User name is required";
    	header("Location: ../index.php?error=$em&$data");
	    exit;
    }else if(empty($pass1) or empty($pass2)){
    	$em = "Password is required";
    	header("Location: ../index.php?error=$em&$data");
	    exit;
	}else if($pass1 != $pass2){
    	$em = "Passwords does not match";
    	header("Location: ../index.php?error=$em&$data");
	    exit;
    }else {

    	// hashing the password
    	$pass_hash = password_hash($pass1, PASSWORD_DEFAULT);

		try {
			global $database;
			$user_data = $database->select("users", "*", ["UserName" => $uname]);
			if (count($user_data) == 0){
				$database -> insert("users",["UserFullName"=> $fname, "UserName"=> $uname, "UserPwd" => $pass_hash]);
				header("Location: ../index.php?success=Your account has been created successfully");
			}
			else{
				if($user_data[0]["CanResetPassword"] == 1){

					$database -> update("users",["UserPwd"=> $pass_hash, "CanResetPassword"=> 0,"PasswordChanged"=>Medoo::raw('NOW()')],
										[ "UserName" => $uname]);
					header("Location: ../index.php?success=Your password has been changed successfully");
				}
				else{
					$em = "User already exists.";
					header("Location: ../index.php?error=$em&$data");
				}
			}
			
	    	exit;

		}catch(PDOException $e){
			if ($e->getCode() == 23000){
				$em = "User already exists.";
				header("Location: ../index.php?error=$em&$data");
				exit;
			}
			echo "Connection failed : ". $e->getMessage();
		}
    }


}else {
	header("Location: ../index.php?error=error");
	exit;
}
