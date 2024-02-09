var idleConter = 0;
var idleInterval = null;

function startIncativityTimer(){
    idleConter = 0;
    if(idleInterval!=null)  clearInterval(idleInterval);

    idleInterval = setInterval(inactivityLogout, 5000); // 5 second

    // Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleConter = 0;
    });
    $(this).keypress(function (e) {
        idleConter = 0;
    });
}

function inactivityLogout() {
    idleConter = idleConter + 1;
    if (idleConter > 120) { // 10 minutes
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