<?php 
session_start();
use Medoo\Medoo;

include 'php_functions.php';

if(isset($_POST['uname']) && 
   isset($_POST['pass'])){

    include "db_conn.php";

    $uname = $_POST['uname'];
    $pass = $_POST['pass'];

    $data = "uname=".$uname;
    
    if(empty($uname)){
    	$em = "User name is required";
    	header("Location: ../index.php?error=$em&$data");
	    exit;
    }else if(empty($pass)){
    	$em = "Password is required";
    	header("Location: ../index.php?error=$em&$data");
	    exit;
    }else {
      global $database;
      $user_data = $database->select("users", "*", ["UserName" => $uname]);


      if(count($user_data) == 1){

         $user = $user_data[0];
         
         $username =  $user['UserName'];
         $password =  $user['UserPwd'];
         $fname =  $user['UserFullName'];
         $isActivated =  $user['IsActivated'];
         $id =  $user['UserID'];
         if(! $isActivated){
            $em = "This account is not activated or had been disactivated.";
            header("Location: ../index.php?error=$em&$data");
            exit;
         }

         if($username === $uname){
            if(password_verify($pass, $password)){
               $_SESSION['id'] = $id;
               $_SESSION['uname'] = $uname;
               $_SESSION['fname'] = $fname;
               $_SESSION['isAdmin'] = $user['IsAdmin'];
               $_SESSION['adminMode'] = $user['IsAdmin'];
               
               $database -> update("users",["LastLogin"=>Medoo::raw('NOW()')],
										[ "UserName" => $uname]);

               header("Location: ../home.php?" . $_SERVER["QUERY_STRING"]);
               exit;
            }else {
            $em = "Incorect User name or password";
            header("Location: ../index.php?error=$em&$data&". $_SERVER["QUERY_STRING"]);
            exit;
         }

         }else {
            $em = "Incorect User name or password";
            header("Location: ../index.php?error=$em&$data&". $_SERVER["QUERY_STRING"]);
            exit;
         }

      }else {
         $em = "Incorect User name or password";
         header("Location: ../index.php?error=$em&$data&". $_SERVER["QUERY_STRING"]);
         exit;
      }
    }


}else {
	header("Location: ../index.php?error=error&". $_SERVER["QUERY_STRING"]);
	exit;
}
