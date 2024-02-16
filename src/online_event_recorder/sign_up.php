<?php
	require_once 'vendor/autoload.php';
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

	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"></script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js"></script>

	<title>ExamRegister - Sign up</title>
</head>
<body>
	<div class="d-flex align-items-center justify-content-center">
		<form
			class="shadow p-5 needs-validation col-6" 
    	    action="php/signup.php" 
    	    method="post">
			<h4 class="display-4 fs-1">SIGN UP</h4><br>

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
				<label for="nameInput">Full name</label>
				<input type="text" class="form-control" id="fname" placeholder="Your Name" name ="fname"
				value="<?php echo (isset($_GET['fname']))?$_GET['fname']:"" ?>" required>
			</div>
			<div class="form-group mb-2">
				<label for="usernameInput">User name</label>
				<input type="text" class="form-control" id="uname" placeholder="User Name" name = "uname"
				value="<?php echo (isset($_GET['uname']))?$_GET['uname']:"" ?>" required>
			</div>
			<div class="form-group mb-2">
				<label for="emailInput">E-mail address</label>
				<input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="nobody@nowhere.com"
				name = "email"
				value="<?php echo (isset($_GET['email']))?$_GET['email']:"" ?>" required>
				<small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
			</div>
			<div class="form-group mb-2">
				<label for="password1Input">Password</label>
				<input type="password" class="form-control" id="password1" placeholder="Password" name="pass1" required>
			</div>
			<div class="form-group mb-3">
				<label for="password2Input">Confirm password</label>
				<input type="password" class="form-control" id="password2" placeholder="Confirm password" name = "pass2" required>
			</div>

			<div class="d-grid gap-2 d-md-flex">
				<button type="submit" class="btn btn-primary md-me-2">Sign Up</button>
				<a href="index.php" class="btn btn-outline-primary">Login</a>
			</div>
		</form>

	</main>		


</body>
</html>