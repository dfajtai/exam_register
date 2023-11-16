<?php 
session_start();

if (isset($_SESSION['id']) && isset($_SESSION['fname'])) {
	require_once "php/db_conn.php";
	global $database;
	$studies = $database -> select("studies", "*");

	include "php/definition_setup.php";

	$tables = get_definition_tables();
 ?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Home</title>

	<link href="css/bootstrap.min.css" rel="stylesheet">
	<link href="https://unpkg.com/bootstrap-table@1.22.1/dist/bootstrap-table.min.css" rel="stylesheet">
	
	<script src="vendor/components/jquery/jquery.min.js"></script>
	<script src="js/bootstrap.bundle.min.js"></script>
	<script src="js/modernizr.min.js"></script>

	<script src="https://unpkg.com/tableexport.jquery.plugin/tableExport.min.js"></script>
	<script src="https://unpkg.com/bootstrap-table@1.22.1/dist/bootstrap-table.min.js"></script>
	<script src="https://unpkg.com/bootstrap-table@1.22.1/dist/bootstrap-table-locale-all.min.js"></script>
	<script src="https://unpkg.com/bootstrap-table@1.22.1/dist/extensions/export/bootstrap-table-export.min.js"></script>

	<script defer src="js/database_view.js"></script> 

</head>
<body>

    <div class="d-flex justify-content-center align-items-center vh-100">
    	
    	<div class="shadow w-450 p-3 text-center">
            <h3 class="display-6 ">Welcome <?=$_SESSION['fname']?> at the ADMIN page.</h3>
			
			<div>
				<select id = "tableSelector">
					<option selected value = ''>Select a table</option>
					<?php foreach($tables as $table){
							echo "<option value=".$table["TableID"].">".$table["TableName"]."</option>";
						}?>
				</select>
				<button class="button" id = "tableSelectButton">Select table</button>

			</div>
			<div id="tableViewer">
				<h5>SELECT A TABLE</h5>
			</div>
			<div>
				<a href="logout.php" class="btn btn-warning">
					Logout
				</a>
			</div>
		</div>
    </div>


	<script>
		$(document).ready(function() {
			$('#tableSelectButton').click(function() {
				var e = $("#tableSelector");
				var selected_id = e.find(":selected").val();
				if(selected_id!==''){
					var selected_name = e.find(":selected").text();
					// console.log(selected_name);
					createTableViewer($("#tableViewer"), 
										selected_name, 
										"tableData",
										);
				}
				else{
					$("#table_container").html('<h5>SELECT A TABLE</h5>');
				}

			});


		});


	</script>

</body>
</html>

<?php }else {
	header("Location: login.php");
	exit;
} ?>