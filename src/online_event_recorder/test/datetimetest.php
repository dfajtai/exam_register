<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<title>Event form test</title>

	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
	<link rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.47/css/bootstrap-datetimepicker.min.css">

	<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.8/umd/popper.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"></script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment-with-locales.min.js"></script>

</head>

<body>
	<main class="container-md">
		<div class="mx-auto p-5">
			<form class="needs-validation">
				<h4 class="display-4 fs-1">Event creation</h4><br>
				<div class="row mb-3">
					<label for="dateLabel" class="col-sm-2 col-form-label">Event Date</label>
					<div class="col-sm-4">
						<input type="date" class="form-control" id="currentDate" name="currentDate" readonly>
					</div>
					<div class="col-sm-2">
						<button type="button" class="form-control btn-light bi bi-arrow-right" id="refreshDate"
							name="refreshDate">
					</div>
					<div class="col-sm-4">
						<input type="date" class="form-control" id="datePicker" name="currentDate" required>
					</div>
				</div>
				<div class="row mb-3">
					<label for="dateLabel" class="col-sm-2 col-form-label">Event Time</label>
					<div class="col-sm-4">
						<input type="time" class="form-control" id="currentTime" name="currentTime" step='1' readonly>
					</div>
					<div class="col-sm-2">
						<button type="button" class="form-control btn-light bi bi-arrow-right" id="refreshTime"
							name="refreshTime">
					</div>
					<div class="col-sm-4">
						<input type="time" class="form-control" id="timePicker" name="timePicker" step='1' required>
					</div>
				</div>
			</form>
		</div>
	</main>


</body>
<script>

	$(document).ready(function () {
		moment.locale("hu");
		$("#datePicker").val(moment().format("YYYY-MM-DD"));
		$("#timePicker").val(moment().format("HH:mm:ss"));
		$("#currentDate").val(moment().format("YYYY-MM-DD"));
		$("#currentTime").val(moment().format("HH:mm:ss"));

		$("#refreshDate").click(function () {
			$("#datePicker").val(moment().format("YYYY-MM-DD"));
		});

		$("#refreshTime").click(function () {
			$("#timePicker").val(moment().format("HH:mm:ss"));
		});

		setInterval(function () {
			$("#currentDate").val(moment().format("YYYY-MM-DD"));
			$("#currentTime").val(moment().format("HH:mm:ss"));
		}, 1000);


	})

</script>

</html>