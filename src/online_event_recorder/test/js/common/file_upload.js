function uploadCsv(event, callback = null) {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            if(typeof callback === 'function')
                return callback(e.target.result);
            else console.log(e.target.result);
        };

        reader.readAsText(fileInput.files[0]);
    }
}