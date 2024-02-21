<?php 

include_once 'php/php_functions.php';

session_start();

if(isset($_COOKIE['uname'])){
	$_GET['uname'] = $_COOKIE['uname'];
}
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">

	<link rel="stylesheet" href="css/my_styles.css">
	<link rel="stylesheet" href="css/my_sizing.css">

	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"></script>
	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	<title>ExamRegister - Login</title>
</head>
<body>
	<div class="d-flex align-items-center justify-content-center">

		<form
			class="shadow p-5 needs-validation col-md-6 col-lg-4 col-sm-10 col-12 align-self-center" 
    	    action=<?php echo "'php/login.php?" . myUrlEncode($_SERVER["QUERY_STRING"]) . "'"?>			
    	    method="post">
			<h4 class="display-4 fs-1">LOGIN</h4><br>

			<?php if(isset($_GET['error'])){ ?>
    		<div class="alert alert-danger" role="alert">
			  <?php echo $_GET['error']; ?>
			</div>
		    <?php } ?>

		    <?php if(isset($_GET['success'])){ ?>
    		<div class="alert alert-success" role="alert">
			  <?php echo $_GET['success']; ?>
			</div>
		    <?php } ?>
			

			<div class="form-group mb-2">
				<label for="usernameInput">User name</label>
				<input type="text" class="form-control" id="uname" placeholder="User Name" name = "uname"
				value="<?php echo (isset($_GET['uname']))?$_GET['uname']:"" ?>" required>
			</div>

			<div class="form-group mb-3">
				<label for="password1Input">Password</label>
				<input type="password" class="form-control" id="password1" placeholder="Password" name="pass" required>
			</div>
			<div class="d-grid gap-2 d-md-flex">
				<button type="submit" class="btn btn-primary md-me-2">Login</button>
				<a href="sign_up.php" class="btn btn-outline-primary">Sign Up</a>
			</div>
			

		</form>
	</div>

</body>
</html>