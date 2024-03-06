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

	<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/polyfills.umd.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>
	<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.js"></script> -->

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

	<script defer src="js/common/subjectSearchWidget.js"></script>
	<script defer src="js/common/status_filter_widget.js"></script>
	<script defer src="js/common/subjectPool/subjectPoolMain.js"></script>
	<script defer src="js/common/subjectPool/subjectPoolEditor.js"></script>
	<script defer src="js/common/subjectPool/subjectSelectFromPoolWidget.js"></script>
	

	<script defer src="js/admin/tools/event_template_editor.js"></script>
	<script defer src="js/admin/tools/event_planner.js"></script>
	<script defer src="js/admin/tools/subject_register.js"></script>
	<script defer src="js/admin/tools/user_management.js"></script>
	<script defer src="js/admin/tools/event_log_handler.js"></script>
	<script defer src="js/admin/tools/event_changelog_handler.js"></script>
	<script defer src="js/admin/tools/subject_changelog_handler.js"></script>
	<script defer src="js/admin/tools/resource_handler.js"></script>

	<!-- <script>
		import jsPDF from 'jspdf'
		import autoTable from 'jspdf-autotable'
	</script> -->



	<!-- <script defer src="js/common/file_upload.js"></script> -->



</head>
<body>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark ">
		<div class="container-fluid">
			<a class="navbar-brand" onclick="resolve_url_params()">ExamRegister</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarNavDropdown">
				<ul class="navbar-nav">
					<li class="nav-item dropdown me-3">
						<a class="nav-link dropdown-toggle active"
						id="navbarAdminLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">Administration</a>
						<ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarAdminLink">
							<li>
								<a class="dropdown-item" onclick="show_table('users',true)">Manage users</a>
							</li>
							<li>
								<a class="dropdown-item" onclick="show_table('studies',true)">Define studies</a>
							</li>
							<li>
								<a class="dropdown-item" onclick="show_resource_handler_tool(true)">Manage locks</a>
							</li>
						</ul>
					</li>
					
					<li class="nav-item dropdown me-3">
						<a class="nav-link dropdown-toggle active"
						id="navbarDefsLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">Definitions</a>
						<ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDefsLink">
							<li><a class="dropdown-item"  onclick="show_table('locations',true)">Location definitions</a></li>
							<li><a class="dropdown-item"  onclick="show_table('bodyparts',true)">Bodypart definitions</a></li>
							<li><a class="dropdown-item" onclick="show_table('unit_types',true)">Unit Type definitions</a></li>
							<li><a class="dropdown-item" onclick="show_table('units',true)">Unit definitions</a></li>
							<li><a class="dropdown-item" onclick="show_table('consumable_types',true)">Consumable Type definitions</a></li>
							<li><a class="dropdown-item" onclick="show_table('consmables',true)">Consumable definitions</a></li>
							<li><a class="dropdown-item" onclick="show_table('assets',true)">Asset definitons</a></li>
							<li><a class="dropdown-item" onclick="show_table('event_types',true)">Event type definitons</a></li>
							<li><a class="dropdown-item" onclick="show_table('events',true)">Event template definitons</a></li>
						</ul>
					</li>

					<li class="nav-item dropdown me-3">
						<a class="nav-link dropdown-toggle active"
						id="navbarSubjectsLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">Subjects</a>
						<ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarSubjectsLink">
							<li><a class="dropdown-item" onclick="show_subject_register_tool(true)">Subjects register</a>
							<li><a class="dropdown-item" onclick="show_subject_pool_tool(null,true)">Subjects pool editor</a>
							<li><a class="dropdown-item" onclick="show_subject_change_log_tool(true)">Subject change log</a>
						</ul>
					</li>

					<li class="nav-item dropdown me-3">
						<a class="nav-link dropdown-toggle active" 
						id="navbarEventsLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">Events</a>
						<ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarEventsLink">
							<li><a class="dropdown-item" onclick="show_table('events',true)">Event template definitons</a></li>
							<li><a class="dropdown-item" onclick="show_event_template_editor_tool(true)">Event template editor</a></li>
							<li><a class="dropdown-item" onclick="show_event_planner_tool(true)">Event planner</a></li>
							<li><a class="dropdown-item" onclick="show_event_log_tool(true)">Event log</a></li>
							<li><a class="dropdown-item" onclick="show_event_change_log_tool(true)">Event change log</a></li>
						</ul>
					</li>

					<li class="nav-item me-3">
						<a class="nav-link active" href="#" onclick="become_user()" >USER mode</a>
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

		var main_title = "ExamRegister - ADMIN";

		function become_user(){
			saveCurrentStatusToHistory();
			clearAllStatusFromUrl();

			$.ajax({
				type: "POST",
				url: 'php/admin_mode_switch.php',
				dataType: "json",
				success: function (result) {
					// console.log(result);
					window.location = "home.php";
				}})
		}

		function show_table(def_name, click = false){
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

			// clearAllStatusFromUrl();			
			contentToUrl("def",def_name,true,click);

			$('.navbar-collapse').collapse('hide');
		}


		function show_event_template_editor_tool(click = false){
			var main_container = $("#main_container");
			$("#main_container").empty();
			
			var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Event template editor"));
			main_container.append(_title);

			show_event_template_editor(main_container);	


			contentToUrl("tool","EventTemplateEditor",true,click);

			
			$('.navbar-collapse').collapse('hide');		
		}

		function show_event_planner_tool( click = false){
			var main_container = $("#main_container");
			$("#main_container").empty();
			
			var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Event planner"));
			main_container.append(_title);

			show_event_planner(main_container);

			contentToUrl("tool","EventPlanner",true,click);

			
			$('.navbar-collapse').collapse('hide');
		}

		function show_subject_register_tool( click = false){
			var main_container = $("#main_container");
			$("#main_container").empty();

			var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Subject register"));
			main_container.append(_title);

			show_subject_register(main_container);
			contentToUrl("tool","SubjectRegister",true,click);

			$('.navbar-collapse').collapse('hide');
		}
		
		function show_event_log_tool( click = false){
			var main_container = $("#main_container");
			$("#main_container").empty();

			var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Event log"));
			main_container.append(_title);

			show_event_log_handler(main_container);
			contentToUrl("tool","EventLog",true,click);

			
			$('.navbar-collapse').collapse('hide');

		}

		function show_event_change_log_tool( click = false){
			var main_container = $("#main_container");
			$("#main_container").empty();

			var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Event change log"));
			main_container.append(_title);

			show_event_changelog_handler(main_container);

			contentToUrl("tool","EventChangeLog",true,click);

			
			$('.navbar-collapse').collapse('hide');

		}

		function show_subject_pool_tool(init_indices = null, click = false){
			var main_container = $("#main_container");
			$("#main_container").empty();

			var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Subject pool editor"));
			main_container.append(_title);

			showSubjectPoolEditor(main_container,init_indices);

			contentToUrl("tool","SubjectPool",true,click);

			
			$('.navbar-collapse').collapse('hide');

		}

		function show_subject_change_log_tool( click = false){
			var main_container = $("#main_container");
			$("#main_container").empty();

			var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Subject change log"));
			main_container.append(_title);

			show_subject_changelog_handler(main_container);

			contentToUrl("tool","SubjectChangeLog",true,click);


			
			$('.navbar-collapse').collapse('hide');
		}

		function show_resource_handler_tool( click = false){
			var main_container = $("#main_container");
			$("#main_container").empty();

			var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-3").html("Manage locks"));
			main_container.append(_title);

			show_resource_handler(main_container);

			contentToUrl("tool","ResouceLocks",true,click);


			
			$('.navbar-collapse').collapse('hide');

		}

		function resolve_url_params(){
			clearStatusFromUrl(["uname","error"]);

			if(statusInUrl("setSubjectPool")){
					setSubjectPool(JSON.parse(statusFromUrl("setSubjectPool")));
					clearStatusFromUrl("setSubjectPool");
				}
				
				if(statusInUrl("def")){
					show_table(statusFromUrl("def"));
				}
				else if(statusInUrl("tool")){
					var tool = statusFromUrl("tool");
					switch (tool) {
						case "EventTemplateEditor":
							show_event_template_editor_tool();
							break;
						case "EventPlanner":
							show_event_planner_tool();
							break;
						case "SubjectRegister":
							show_subject_register_tool();
							break;
						case "EventLog":
							show_event_log_tool();
							break;
						case "EventChangeLog":
							show_event_change_log_tool();
							break;
						case "SubjectChangeLog":
							show_subject_change_log_tool();
							break;
						case "ResouceLocks":
							show_resource_handler_tool();
							break;
						case "SubjectPool":
							show_subject_pool_tool();
							break;					
						default:
							show_table("users");
							break;
					}
				}
				else{
					show_table("users");
				}
		}

		$(document).ready(function() {
			$("#become_user_button").click(function(){
				// clearAllStatusFromUrl();

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
				
				resolve_url_params();
			});
		});


		window.addEventListener('popstate', function(event) {
    		resolve_url_params();
			// console.log(event)
			
			set_window_title(isObject(event.state)?event.state["content"]:null);

		});


	</script>

</body>
</html>

<?php }else {
	header("Location: index.php?". $_SERVER["QUERY_STRING"]);
	exit;
} ?>