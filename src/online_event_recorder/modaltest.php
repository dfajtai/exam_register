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
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
        data-bs-whatever="@mdo">Open modal for @mdo</button>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
        data-bs-whatever="@fat">Open modal for @fat</button>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"
        data-bs-whatever="@getbootstrap">Open modal for @getbootstrap</button>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title display-4 fs-1" id="exampleModalLabel">Event creation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <form class="needs-validation">
                            <div class="row mb-1">
                                <label for="dateLabel" class="col-sm-2 col-form-label">Event Date</label>
                                <div class="col-sm-4">
                                    <input type="date" class="form-control" id="currentDate" name="currentDate"
                                        readonly>
                                </div>
                                <div class="col-sm-2">
                                    <button type="button" class="form-control btn-light bi bi-arrow-right"
                                        id="refreshDate" name="refreshDate">
                                </div>
                                <div class="col-sm-4">
                                    <input type="date" class="form-control" id="datePicker" name="currentDate" required>
                                </div>
                            </div>
                            <div class="row mb-1">
                                <label for="dateLabel" class="col-sm-2 col-form-label">Event Time</label>
                                <div class="col-sm-4">
                                    <input type="time" class="form-control" id="currentTime" name="currentTime" step='1'
                                        readonly>
                                </div>
                                <div class="col-sm-2">
                                    <button type="button" class="form-control btn-light bi bi-arrow-right"
                                        id="refreshTime" name="refreshTime">
                                </div>
                                <div class="col-sm-4">
                                    <input type="time" class="form-control" id="timePicker" name="timePicker" step='1'
                                        required>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="subbmit" class="btn btn-primary">Send message</button>
                </div>
            </div>
        </div>
    </div>

</body>
<script>
    var exampleModal = document.getElementById('exampleModal')
    exampleModal.addEventListener('show.bs.modal', function (event) {
        // Button that triggered the modal
        var button = event.relatedTarget
        // Extract info from data-bs-* attributes
        var recipient = button.getAttribute('data-bs-whatever')
        // If necessary, you could initiate an AJAX request here
        // and then do the updating in a callback.
        //
        // Update the modal's content.
        var modalTitle = exampleModal.querySelector('.modal-title')
        var modalBodyInput = exampleModal.querySelector('.modal-body input')

        modalTitle.textContent = 'New message to ' + recipient
        modalBodyInput.value = recipient
    })


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