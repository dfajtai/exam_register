<!doctype html>
<html lang="en">

<head>
	<!-- Required meta tags -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>Hello, Bootstrap Table!</title>

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


	<script defer src="js/core/admin_definition_form_handler.js"></script>
	<script defer src="js/core/definition_handler.js"></script>
	<script defer src="js/core/table_creation.js"></script>

	<script defer src="js/forms/table_formatters.js"></script>
	
	<script defer src="js/forms/study_definition_form.js"></script>

	<script defer src="js/forms/unit_type_definitions_form.js"></script>
	<script defer src="js/forms/unit_definitions_form.js"></script>

	<script defer src="js/forms/location_definitions_form.js"></script>

	<script defer src="js/forms/specimen_bodypart_definitions.js"></script>

	<script defer src="js/forms/consumable_definitions_form.js"></script>
	<script defer src="js/forms/consumable_type_definitions_form.js"></script>

	<script defer src="js/forms/asset_definitions_form.js"></script>

	<script defer src="js/forms/event_type_definitions_form.js"></script>
	<script defer src="js/forms/event_definitions_form.js"></script>



</head>

<body>
	<main class="container">
		<div class="row">
			<div id="main_container"></div>
		</div>

	</main>


	<script>

		$(document).ready(function () {
			updateRemoteDefinitionChecksum();
			updateLocalDefinitionDatabase();
			
			var defintitions_to_show = {
										"Location definitions":initLocationDefinitionsTable,
										"Bodypart definitions":initSpecimenBodypartDefinitionsTable,
										"Unit Type definitions": initUnitTypeDefinitionsTable,
										"Unit definitions": initUnitDefinitionsTable,
										"Consumable Type definitions": initConsumableTypeDefinitionsTable,
										"Consumable definitons": initConsumableDefinitionsTable,
										"Asset definitons": initAssetDefinitionsTable,
										// "Event type definitons": initEventTypeDefinitionsTable,
										"Event definitons": initEventDefinitionsTable,
										"Studies": initStudyDefinitionsTable,
										}
			
			var main_container = $("#main_container");

			$.each(defintitions_to_show,function(title,fun){
				var _title = $("<div/>").addClass("row").html($("<div/>").addClass("display-3 fs-1").html(title));
				container_id = String(title).split(" ").join("_").toLowerCase()+ "_container";

				table_id = String(title).split(" ").join("_").toLowerCase()+ "_table";

				var _table = $("<div/>").addClass("row").attr("id",container_id);

				main_container.append(_title);
				main_container.append(_table);
	
				createAdminTable(_table, table_id, 500);
				fun(_table,table_id);

    		});

		});

	</script>


</body>

</html>