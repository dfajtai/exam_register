<?php 
session_start();

if (isset($_SESSION['id']) && isset($_SESSION['fname'])) {
	if($_SESSION['isAdmin']===0){
		header("Location: home.php");
		exit;
	}
 ?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>ExamLogger - ADMIN</title>

	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
	<link rel="stylesheet" href="https://unpkg.com/bootstrap-table@1.22.1/dist/bootstrap-table.min.css">

	<link rel="stylesheet" href="css/my_styles.css">

	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.8/umd/popper.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"></script>

	<script src="https://cdn.jsdelivr.net/npm/tableexport.jquery.plugin@1.10.21/tableExport.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/tableexport.jquery.plugin@1.10.21/libs/jsPDF/jspdf.min.js"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/tableexport.jquery.plugin@1.10.21/libs/jsPDF-AutoTable/jspdf.plugin.autotable.js"></script>

	<script src="https://unpkg.com/bootstrap-table@1.22.1/dist/bootstrap-table.min.js"></script>
	<script src="https://unpkg.com/bootstrap-table@1.22.1/dist/bootstrap-table-locale-all.min.js"></script>
	<script
		src="https://unpkg.com/bootstrap-table@1.22.1/dist/extensions/export/bootstrap-table-export.min.js"></script>
	<script
		src="https://unpkg.com/bootstrap-table@1.22.1/dist/extensions/auto-refresh/bootstrap-table-auto-refresh.min.js"></script>


	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment-with-locales.min.js"></script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/crc-32/1.2.2/crc32.min.js"></script>


	<script defer src="js/core/definition_handler.js" ></script>
	<script defer src="js/core/status_handler.js"></script>


	<script defer src="js/admin/core/admin_definition_form_handler.js"></script>
	<script defer src="js/admin/core/admin_table_creation.js"></script>

	<script defer src="js/admin/forms/user_table_form.js"></script>

	<script defer src="js/admin/forms/table_formatters.js"></script>
	
	<script defer src="js/admin/forms/study_definition_form.js"></script>

	<script defer src="js/admin/forms/unit_type_definitions_form.js"></script>
	<script defer src="js/admin/forms/unit_definitions_form.js"></script>

	<script defer src="js/admin/forms/location_definitions_form.js"></script>

	<script defer src="js/admin/forms/bodypart_definitions.js"></script>

	<script defer src="js/admin/forms/consumable_definitions_form.js"></script>
	<script defer src="js/admin/forms/consumable_type_definitions_form.js"></script>

	<script defer src="js/admin/forms/asset_definitions_form.js"></script>

	<script defer src="js/admin/forms/event_type_definitions_form.js"></script>
	<script defer src="js/admin/forms/event_definitions_form.js"></script>

</head>
<body>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark ">
		<div class="container-fluid">
			
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<a class="navbar-brand" href="#">ExamLogger</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarNavDropdown">
				<ul class="navbar-nav">
					<li class="nav-item">
						<a class="nav-link active" href="#" onclick="show_table('users')">Manage users</a>
					</li>
					<li class="nav-item">
						<a class="nav-link active" href="#" onclick="show_table('studies')">Define studies</a>
					</li>
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle active" href="#" 
						id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">Edit definition tables</a>
						<ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
							<li><a class="dropdown-item" href="#" onclick="show_table('locations')">Location definitions</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('bodyparts')">Bodypart definitions</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('unit_types')">Unit Type definitions</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('units')">Unit definitions</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('consumable_types')">Consumable Type definitions</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('consmables')">Consumable definitions</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('assets')">Asset definitons</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('event_types')">Event Type definitons</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('events')">Event definitons</a></li>
						</ul>
					</li>
				</ul>
				<div class="d-flex ">
					<a class="nav-item btn btn-outline-success me-2" href="#" id="become_user_button" >User home</a>
					<a class="nav-item btn btn-outline-primary " href="logout.php" >Logout</a>
				</div>
			</div>

		</div>


	</nav>

	<div class="container mt-3">
		<div class="row">
			<div id="main_container"></div>
		</div>


	</div>


	<script>

		var available_def_tables = Object();

		function show_table(def_name){
			
			var exists = Object.keys(available_def_tables).includes(def_name);
			if (!exists){
				return
			}

			var main_container = $("#main_container");
			$("#main_container").empty();
			
			var def_params =available_def_tables[def_name];
			
			var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-2 fs-1").html(def_params.title));

			container_id = def_name + "_definitions_container";
			table_id = def_name + "_definitions_table";

			var _table = $("<div/>").addClass("row mt-2").attr("id",container_id);

			main_container.append(_title);
			main_container.append(_table);

			createAdminTable(_table, table_id, 500);
			var fun = def_params.func;
			fun(_table,table_id);

			statusToUrl("def",def_name);

			$('.navbar-collapse').collapse('hide');
		}


		$(document).ready(function() {
			$("#become_user_button").click(function(){
				clearAllStatusFromUrl();

				$.ajax({
					type: "POST",
					url: 'php/admin_user_mode.php',
					dataType: "json",
					success: function (result) {
						// console.log(result);
						window.location = "home.php";
					}});
			});

			$(document).click(function (event) {
				var clickover = $(event.target);
				if(!$($(clickover).parent()).hasClass("nav-item")){
					$('.navbar-collapse').collapse('hide');
				}
  			});
		

			updateRemoteDefinitionChecksum();
			updateLocalDefinitionDatabase(function(){
				available_def_tables = {
							"users": {"title":"Manage users","func":initUsersDefinitionsTable},
							"locations":{"title":"Location definitions","func":initLocationDefinitionsTable},
							"bodyparts":{"title":"Bodypart definitions","func":initBodypartDefinitionsTable},
							"unit_types":{"title":"Unit Type definitions","func":initUnitTypeDefinitionsTable},
							"units":{"title":"Unit definitions","func":initUnitDefinitionsTable},
							"consumable_types":{"title":"Consumable Type definitions","func":initConsumableTypeDefinitionsTable},
							"consmables":{"title":"Consumable definitons","func":initConsumableDefinitionsTable},
							"assets":{"title":"Asset definitons","func":initAssetDefinitionsTable},
							"event_types":{"title":"Event type definitons","func":initEventTypeDefinitionsTable},
							"events":{"title":"Event definitons","func":initEventDefinitionsTable},
							"studies":{"title":"Studies","func":initStudyDefinitionsTable},
							}


				if (statusInUrl("def")){
					show_table(statusFromUrl("def"));
				}
				else{
					show_table("users");
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