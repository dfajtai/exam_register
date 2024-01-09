var idleTime = 0;
var idleInterval = null;

function inactivityLogout() {
    idleTime = idleTime + 1;
    if (idleTime > 9) { // 10 minutes
        clearInterval(idleInterval);

        $.ajax({
            type: "POST",
            url: 'php/inactive_logout.php',
            dataType: "json",
            success: function (result) {
                console.log(result);

                bootbox.alert({
                message: 'You were logged out due to inactivity.',
                buttons: {
                    ok: {
                        label: 'Ok',
                        className: 'btn-outline-dark'
                        },
                    },
                callback: function () {								
                    var searchParams = new URLSearchParams(window.location.search);
                    var newRelativePathQuery = 'login.php' +'?' + searchParams.toString();
                    window.location= newRelativePathQuery;
                    $(this).find('[name=uname]').val(result);
                }
                });							
            }
        });
        
    }
}