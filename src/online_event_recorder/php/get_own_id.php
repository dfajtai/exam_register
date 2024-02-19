<?php 
session_start();

if(isset($_SESSION['id']) && isset($_SESSION['fname'])){
    echo $_SESSION['id'];
}