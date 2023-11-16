<?php 
session_start();

if (isset($_SESSION['id']) && isset($_SESSION['fname'])) {
	include "php/db_conn.php";
	global $database;
	$studies = $database -> select("studies", "*");

	if($_SESSION['isAdmin']){
		header("Location: admin_home.php");
		exit;
	}
 ?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Home</title>

	<link href="css/bootstrap.min.css" rel="stylesheet">

</head>
<body>
    <div class="d-flex justify-content-center align-items-center vh-100">
    	
    	<div class="shadow w-450 p-3 text-center">
            <h3 class="display-6 ">Hello, <?=$_SESSION['fname']?></h3>
			
			<select class="custom-select">
				<option selected>Select a study</option>
				<?php foreach($studies as $study){
						echo "<option value=".$study["StudyID"].">".$study["StudyName"]."</option>";
					}?>
			</select>
			<div>
				<a href="logout.php" class="btn btn-warning">
					Logout
				</a>
			</div>
		</div>
    </div>
</body>
</html>

<?php }else {
	header("Location: login.php");
	exit;
} ?>