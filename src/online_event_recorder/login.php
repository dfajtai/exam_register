<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">

	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"></script>
	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	<title>LOGIN</title>
</head>
<body>
<main class="container d-flex p-2 justify-content-center align-items-center vh-100">
		<form
			class="shadow w-450 p-3 needs-validation" 
    	    action="php/login.php" 
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


			<div class="form-group">
				<label for="usernameInput">User name</label>
				<input type="text" class="form-control" id="uname" placeholder="User Name" name = "uname"
				value="<?php echo (isset($_GET['uname']))?$_GET['uname']:"" ?>" required>
			</div>

			<div class="form-group">
				<label for="password1Input">Password</label>
				<input type="password" class="form-control" id="password1" placeholder="Password" name="pass" required>
			</div>
			<button type="submit" class="btn btn-primary">Login</button>
		  	<a href="index.php" class="link-secondary">Sign Up</a>
		</form>
	</main>

</body>
</html>