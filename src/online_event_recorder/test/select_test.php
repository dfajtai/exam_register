<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>Event form test</title>


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
	<script defer src="js/common/filtered_select_from_defs.js"></script>

</head>

<body>
	<main class="container-md">
		<div id = "firstSelect" class = "col-md-6 offset-md-3 mt-5">
        </div>
        <div id = "secondSelect" class = "col-md-6 offset-md-3">
        </div>
	</main>


</body>
<script>

    $(document).ready(function() {

        updateRemoteDefinitionChecksums();
        updateLocalDefinitionDatabase(function(){
            var typeForm = $("<div/>").addClass("row mb-3");
            typeForm.append($("<label/>").addClass("col-sm-3 ").html("UnitType"));
            var typeSelect = $("<div/>").addClass("col-sm-9");

            var type_select_dropdow = $("<select/>").attr("type","text").attr("id","type").attr("name","UnitType");
            type_select_dropdow.append($("<option/>").html("Choose UnitType...").prop('selected',true).attr("disabled","disabled").attr("value",""));
            // $.each(defs.unit_type_definitions,function(key,entry){
            //     type_select_dropdow.append($("<option/>").html(entry.UnitTypeName).attr("value",entry.UnitTypeID))
            // });

			showAllDefs(type_select_dropdow,"unit_type_definitions","UnitTypeID","UnitTypeName");

            typeSelect.append(type_select_dropdow);
            typeForm.append(typeSelect);

            $("#firstSelect").append(typeForm);
			

			var typeForm = $("<div/>").addClass("row mb-3");
            typeForm.append($("<label/>").addClass("col-sm-3 ").html("Unit"));
            var typeSelect = $("<div/>").addClass("col-sm-9");

            var type_select_dropdow = $("<select/>").attr("type","text").attr("id","type").attr("name","UnitType");
            type_select_dropdow.append($("<option/>").html("Choose Unit...").prop('selected',true).attr("disabled","disabled").attr("value",""));
            // $.each(defs.unit_type_definitions,function(key,entry){
            //     type_select_dropdow.append($("<option/>").html(entry.UnitTypeName).attr("value",entry.UnitTypeID))
            // });

			showAllDefs(type_select_dropdow,"unit_definitions","UnitUnit","UnitUnit");

            typeSelect.append(type_select_dropdow);
            typeForm.append(typeSelect);

            $("#secondSelect").append(typeForm);
			
			connectSelectByAttr($("#firstSelect"),$("#secondSelect"),"unit_definitions","UnitType", "UnitTypeID", "UnitID");

        });


    });

</script>

</html>