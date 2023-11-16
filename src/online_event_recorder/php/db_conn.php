<?php 
$db_host = "localhost";
$db_user = "exam_logger_user";
$db_pass = "asdfqwer1234";
$db_name = "exam_logger_test";


require_once(__DIR__.'/../vendor/autoload.php');
use Medoo\Medoo;

try{
  $database = new Medoo([
    // required
    'database_type' => 'mysql',
    'database_name' => $db_name,
    'server' => $db_host,
    'username' => $db_user,
    'password' => $db_pass,
    // [optional]
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_general_ci',
    // [optional] Table prefix
    // 'prefix' => 'exam_logger_',
    // [optional] Enable logging (Logging is disabled by default for better performance)
    'logging' => true,
    // [optional] MySQL socket (shouldn't be used with server and port)
    // 'socket' => '/tmp/mysql.sock', 
    // [optional] driver_option for connection, read more from http://www.php.net/manual/en/pdo.setattribute.php
    'option' => [
      PDO::ATTR_CASE => PDO::CASE_NATURAL
    ],
    // [optional] Medoo will execute those commands after connected to the database for initialization
    'command' => [
      'SET SQL_MODE=ANSI_QUOTES'
    ]
  ]);
}catch(PDOException $e){
  echo "Connection failed : ". $e->getMessage();
}
