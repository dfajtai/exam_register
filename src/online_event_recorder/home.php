<?php 
session_start();
if (isset($_SESSION['id']) && isset($_SESSION['fname'])) {
	if($_SESSION['adminMode']===1){
		header("Location: admin_home.php?". $_SERVER["QUERY_STRING"]);
		exit;
	}
 ?>
 
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>ExamRegister</title>

	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
	
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
	<link rel="stylesheet" href="https://unpkg.com/bootstrap-table@1.22.1/dist/bootstrap-table.min.css">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/jquery-flexdatalist/2.3.0/jquery.flexdatalist.css" rel="stylesheet" type="text/css">

	<link rel="stylesheet" href="css/my_styles.css">

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

	<script defer src="js/common/definition_handler.js"></script>
	<script defer src="js/common/status_handler.js"></script>

	<script defer src="js/user/core/flat_def_info_block.js"></script>
	<script defer src="js/common/filtered_select_from_defs.js"></script>
	<script defer src="js/common/def_search.js"></script>
	<script defer src="js/common/additional_functions.js"></script>


	<script defer src="js/common/dynamic_form.js"></script>
	<script defer src="js/common/formatters.js"></script>

	<script defer src="js/admin/tools/subject_register.js"></script>
	<script defer src="js/common/subjectSelectWidget.js"></script>

	<script defer src="js/common/inactivity_protection.js"></script>

	<script defer src="js/user/forms/select_active_study_form.js" ></script>
	<script defer src="js/user/tools/users_main_tool.js" ></script>
		

</head>
<body>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<div class="container-fluid">
			<a class="navbar-brand" href="#">ExamRegister</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarNavDropdown">
				<ul class="navbar-nav">
					<li class="nav-item me-3">
						<a class="nav-link active" href = "#" onclick="show_users_home()">Home</a>
					</li>
					<li class="nav-item dropdown me-3">
						<a class="nav-link dropdown-toggle active" href="#" 
						id="navbarConfigLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">Configuration</a>
						<ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarConfigLink">
							<li><a class="nav-link active" href = "#" onclick="study_select()">Select study</a></li>
							<li><a class="nav-link active" href = "#" onclick="subject_pool()">Config subject pool</a></li>
						</ul>
					</li>
					
					<?php if($_SESSION['isAdmin']){
					echo('<li class="nav-item me-3"><a class = "nav-link active" href="#" id="become_admin_button">ADMIN mode</a></li>');}?>
					<li class="nav-item me-3">
						<a class="nav-link active" href="logout.php" >Logout</a>
					</li>

				</ul>
			</div>
		</div>

	</nav>

	<div class="container mt-3" id="main_container">
	</div>

	<script>
		function study_select(){
			$('.navbar-collapse').collapse('hide');
			showSelectActiveStudyForm($("#main_container"));
		}

		function show_users_home(){
			$('.navbar-collapse').collapse('hide');
			show_users_main_tool($("#main_container"));
		}

		$(document).ready(function() {
			$("#become_admin_button").click(function(){
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
				subject_deleted_status =  getDefEntryFieldWhere("subject_status_definitions","StatusName","deleted","StatusID");
				subject_planned_status =  getDefEntryFieldWhere("subject_status_definitions","StatusName","planned","StatusID");
				event_deleted_status =  getDefEntryFieldWhere("event_status_definitions","EventStatusName","deleted","EventStatusID");
				event_planned_status =  getDefEntryFieldWhere("event_status_definitions","EventStatusName","planned","EventStatusID");


				if(statusInUrl("activeStudy")){
					syncStatusFromUrlToStorage("activeStudy");
				}
				if(!statusInStorage("activeStudy")){
					study_select();
				}
				else{
					syncStatusFromStorageToUrl("activeStudy");
					show_users_main_tool($("#main_container"));
				}	
			});



			


		});

	</script>

</body>
</html>

<?php }else {
	header("Location: login.php?" . $_SERVER["QUERY_STRING"]);
	exit;
} ?>