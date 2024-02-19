<?php 
use Medoo\Medoo;

if(isset($_POST['fname']) && 
   isset($_POST['uname']) && 
   isset($_POST['email']) && 
   isset($_POST['pass1']) &&
   isset($_POST['pass2'])){

    include "db_conn.php";

    $fname = $_POST['fname'];
    $uname = $_POST['uname'];
    $pass1 = $_POST['pass1'];
	$pass2 = $_POST['pass2'];
	$email = $_POST['email'];

    $data = "fname=".$fname."&uname=".$uname."&email=".$email;

    
    if (empty($fname)) {
    	$em = "Full name is required";
    	header("Location: ../sign_up.php?error=$em&$data");
	    exit;
    }else if(empty($uname)){
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

    	// hashing the password
    	$pass_hash = password_hash($pass1, PASSWORD_DEFAULT);

		try {
			global $database;
			$user_name_data = $database->select("users", "*", ["UserName" => $uname]);
			$user_email_data = $database->select("users", "*", ["UserEmail" => $email]);	
			if (count($user_name_data) == 0 && count($user_email_data)==0){
				$database -> insert("users",["UserFullName"=> $fname, "UserName"=> $uname, "UserPwd" => $pass_hash,
			"UserEmail"=>$email]);
				header("Location: ../sign_up.php?success=Your account has been created successfully");
			}
			else{
				if($user_name_data[0]["CanResetPassword"] == 1){

					$database -> update("users",["UserPwd"=> $pass_hash, "CanResetPassword"=> 0,"PasswordChanged"=>Medoo::raw('NOW()')],
										[ "UserName" => $uname]);
					header("Location: ../sign_up.php?success=Your password has been changed successfully");
				}
				else{
					if(count($user_name_data) > 0){
						$em = "User already exists.";
						header("Location: ../sign_up.php?error=$em&$data");
					}else{
						$em = "E-mail address already in use.";
						header("Location: ../sign_up.php?error=$em&$data");
					}
				}
			}
			
	    	exit;

		}catch(PDOException $e){
			if ($e->getCode() == 23000){
				$em = "'E-mail' or 'User name' is not unique";
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
