function simpleFlatFormatter(index, row) {
    var html = []
    var hidden_keys = ["state"]
    $.each(row, function (key, value) {
      if(!(hidden_keys.includes(key))){
        html.push('<p><b>' + key + ':</b> ' + value + '</p>')
      }

    })
    return html.join('')
  }