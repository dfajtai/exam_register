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
	<title>ExamRegister - ADMIN</title>

	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">

		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
	<link rel="stylesheet" href="https://unpkg.com/bootstrap-table@1.22.1/dist/bootstrap-table.min.css">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/jquery-flexdatalist/2.3.0/jquery.flexdatalist.css" rel="stylesheet" type="text/css">

	<link rel="stylesheet" href="css/my_styles.css">
	<link rel="stylesheet" href="css/my_sizing.css">

	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.13.6/underscore-min.js"></script>

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

	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-csv/1.0.21/jquery.csv.min.js"></script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/6.0.0/bootbox.min.js"></script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-flexdatalist/2.3.0/jquery.flexdatalist.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.20.0/jquery.validate.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.20.0/additional-methods.min.js"></script>

	<script defer src="js/common/definition_handler.js" ></script>
	<script defer src="js/common/status_handler.js"></script>
	<script defer src="js/common/inactivity_protection.js"></script>
	<script defer src="js/common/resource_locking.js"></script>
	

	<script defer src="js/admin/table_def_forms/admin_definition_form_handler.js"></script>
	<script defer src="js/admin/table_def_forms/admin_definition_table_creation.js"></script>
	
	<script defer src="js/admin/table_def_forms/study_definition_form.js"></script>
	<script defer src="js/admin/table_def_forms/unit_type_definitions_form.js"></script>
	<script defer src="js/admin/table_def_forms/unit_definitions_form.js"></script>
	<script defer src="js/admin/table_def_forms/location_definitions_form.js"></script>
	<script defer src="js/admin/table_def_forms/bodypart_definitions.js"></script>
	<script defer src="js/admin/table_def_forms/consumable_definitions_form.js"></script>
	<script defer src="js/admin/table_def_forms/consumable_type_definitions_form.js"></script>
	<script defer src="js/admin/table_def_forms/asset_definitions_form.js"></script>
	<script defer src="js/admin/table_def_forms/event_type_definitions_form.js"></script>
	<script defer src="js/admin/table_def_forms/event_template_definitions_form.js"></script>

	<script defer src="js/common/def_search.js"></script>
	<script defer src="js/common/additional_functions.js"></script>

	<script defer src="js/common/formatters.js"></script>
	<script defer src="js/common/filtered_select_from_defs.js"></script>

	<script defer src="js/common/dynamic_form.js"></script>

	<script defer src="js/common/subjectSelectWidget.js"></script>
	<script defer src="js/common/status_filter_widget.js"></script>

	<script defer src="js/admin/tools/event_args_editor.js"></script>
	<script defer src="js/admin/tools/event_planner.js"></script>
	<script defer src="js/admin/tools/subject_register.js"></script>
	<script defer src="js/admin/tools/user_management.js"></script>
	<script defer src="js/admin/tools/event_log_handler.js"></script>
	<script defer src="js/admin/tools/event_changelog_handler.js"></script>
	<script defer src="js/admin/tools/subject_changelog_handler.js"></script>
	<script defer src="js/admin/tools/resource_handler.js"></script>


	<!-- <script defer src="js/common/file_upload.js"></script> -->



</head>
<body>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark ">
		<div class="container-fluid">
			<a class="navbar-brand" href="#">ExamRegister</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarNavDropdown">
				<ul class="navbar-nav">
					<li class="nav-item dropdown me-3">
						<a class="nav-link dropdown-toggle active" href="#" 
						id="navbarAdminLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">Administration</a>
						<ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarAdminLink">
							<li>
								<a class="dropdown-item" href="#" onclick="show_table('users')">Manage users</a>
							</li>
							<li>
								<a class="dropdown-item" href="#" onclick="show_table('studies')">Define studies</a>
							</li>
							<li>
								<a class="dropdown-item" href="#" onclick="show_resouce_handler_tool()">Manage locks</a>
							</li>
						</ul>
					</li>
					
					<li class="nav-item dropdown me-3">
						<a class="nav-link dropdown-toggle active" href="#" 
						id="navbarDefsLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">Definitions</a>
						<ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDefsLink">
							<li><a class="dropdown-item" href="#" onclick="show_table('locations')">Location definitions</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('bodyparts')">Bodypart definitions</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('unit_types')">Unit Type definitions</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('units')">Unit definitions</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('consumable_types')">Consumable Type definitions</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('consmables')">Consumable definitions</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('assets')">Asset definitons</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('event_types')">Event type definitons</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_table('events')">Event template definitons</a></li>
						</ul>
					</li>

					<li class="nav-item dropdown me-3">
						<a class="nav-link dropdown-toggle active" href="#" 
						id="navbarSubjectsLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">Subjects</a>
						<ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarSubjectsLink">
							<li><a class="dropdown-item" href="#" onclick="show_subject_register_tool()">Subjects register</a>
							<li><a class="dropdown-item" href="#" onclick="show_subject_change_log_tool()">Subject change log</a>
						</ul>
					</li>

					<li class="nav-item dropdown me-3">
						<a class="nav-link dropdown-toggle active" href="#" 
						id="navbarEventsLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">Events</a>
						<ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarEventsLink">
							<li><a class="dropdown-item" href="#" onclick="show_table('events')">Event template definitons</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_event_args_editor_tool()">Event template editor</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_event_planner_tool()">Event planner</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_event_log_tool()">Event log</a></li>
							<li><a class="dropdown-item" href="#" onclick="show_event_change_log_tool()">Event change log</a></li>
						</ul>
					</li>

					<li class="nav-item me-3">
						<a class="nav-link active" href="#" id="become_user_button" >USER mode</a>
					</li>
					<li class="nav-item me-3">
						<a class="nav-link active" href="logout.php" >Logout</a>
					</li>
				</ul>

			</div>

		</div>


	</nav>

	<div class="container mt-3" id = "main_container">

	</div>


	<script>
		var available_def_tables = Object();
		
		var subject_deleted_status =  null;
		var subject_planned_status =  null;
		var event_deleted_status =  null;
		var event_planned_status =  null;

		function show_table(def_name){
			
			var exists = Object.keys(available_def_tables).includes(def_name);
			if (!exists){
				return
			}

			var main_container = $("#main_container");
			$("#main_container").empty();
			
			var def_params =available_def_tables[def_name];
			
			var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html(def_params.title));

			container_id = def_name + "_definitions_container";
			table_id = def_name + "_definitions_table";

			var _table = $("<div/>").addClass("row mt-2").attr("id",container_id);

			main_container.append(_title);
			main_container.append(_table);

			createAdminTable(_table, table_id, 600);
			var fun = def_params.func;
			fun(_table,table_id);

			clearAllStatusFromUrl();
			statusToUrl("def",def_name);

			$('.navbar-collapse').collapse('hide');
		}


		function show_event_args_editor_tool(){
			updateLocalDefinitionDatabase(
				function(){
					var main_container = $("#main_container");
					$("#main_container").empty();
					
					var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Event template editor"));
					main_container.append(_title);

					show_event_args_editor(main_container);		
					
					clearAllStatusFromUrl();
					statusToUrl("tool","EventArgEditor");
					
					$('.navbar-collapse').collapse('hide');
				}
			)			
		}

		function show_event_planner_tool(){
			updateLocalDefinitionDatabase(
				function(){
				var main_container = $("#main_container");
				$("#main_container").empty();
				
				var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Event planner"));
				main_container.append(_title);

				show_event_planner(main_container);		
				
				clearAllStatusFromUrl();
				statusToUrl("tool","EventPlanner");
				
				$('.navbar-collapse').collapse('hide');
			})
		}

		function show_subject_register_tool(){
			updateLocalDefinitionDatabase(
				function(){
				var main_container = $("#main_container");
				$("#main_container").empty();

				var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Subject register"));
				main_container.append(_title);

				show_subject_register(main_container);
				
				clearAllStatusFromUrl();
				statusToUrl("tool","SubjectRegister");
				
				$('.navbar-collapse').collapse('hide');
			})
		}

		function show_event_log_tool(){
			updateLocalDefinitionDatabase(
				function(){
				var main_container = $("#main_container");
				$("#main_container").empty();

				var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Event log"));
				main_container.append(_title);

				show_event_log_handler(main_container);
				
				clearAllStatusFromUrl();
				statusToUrl("tool","EventLog");
				
				$('.navbar-collapse').collapse('hide');
			})

		}

		function show_event_change_log_tool(){
			updateLocalDefinitionDatabase(
				function(){
				var main_container = $("#main_container");
				$("#main_container").empty();

				var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Event change log"));
				main_container.append(_title);

				show_event_changelog_handler(main_container);
				
				clearAllStatusFromUrl();
				statusToUrl("tool","EventChangeLog");
				
				$('.navbar-collapse').collapse('hide');
			})

		}


		function show_subject_change_log_tool(){
			updateLocalDefinitionDatabase(
				function(){
				var main_container = $("#main_container");
				$("#main_container").empty();

				var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Subject change log"));
				main_container.append(_title);

				show_subject_changelog_handler(main_container);
				
				clearAllStatusFromUrl();
				statusToUrl("tool","SubjectChangeLog");
				
				$('.navbar-collapse').collapse('hide');
			})

		}

		function show_resouce_handler_tool(){
			updateLocalDefinitionDatabase(
				function(){
				var main_container = $("#main_container");
				$("#main_container").empty();

				var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Manage locks"));
				main_container.append(_title);

				show_resource_handler(main_container);
				
				clearAllStatusFromUrl();
				statusToUrl("tool","ResouceLocks");
				
				$('.navbar-collapse').collapse('hide');
			})

		}

		$(document).ready(function() {
			$("#become_user_button").click(function(){
				clearAllStatusFromUrl();

				$.ajax({
					type: "POST",
					url: 'php/admin_mode_switch.php',
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
			
			$(document).ready(function () {
				startIncativityTimer();
			});

			// updateRemoteDefinitionChecksums();
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
							"events":{"title":"Event template definitons","func":initEventDefinitionsTable},
							"studies":{"title":"Studies","func":initStudyDefinitionsTable},
							};

				subject_deleted_status =  getDefEntryFieldWhere("subject_status_definitions","StatusName","deleted","StatusID");
				subject_planned_status =  getDefEntryFieldWhere("subject_status_definitions","StatusName","planned","StatusID");
				event_deleted_status =  getDefEntryFieldWhere("event_status_definitions","EventStatusName","deleted","EventStatusID");
				event_planned_status =  getDefEntryFieldWhere("event_status_definitions","EventStatusName","planned","EventStatusID");

				if (statusInUrl("def")){
					show_table(statusFromUrl("def"));
				}
				else if(statusInUrl("tool")){
					var tool = statusFromUrl("tool");
					if(tool=="EventArgEditor") show_event_args_editor_tool();
					if(tool=="EventPlanner") show_event_planner_tool();
					if(tool=="SubjectRegister") show_subject_register_tool();
					if(tool=="EventLog") show_event_log_tool();
					if(tool=="EventChangeLog") show_event_change_log_tool();
					if(tool=="SubjectChangeLog") show_subject_change_log_tool();
					if(tool=="ResouceLocks") show_resouce_handler_tool();
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
	header("Location: index.php?". $_SERVER["QUERY_STRING"]);
	exit;
} ?>