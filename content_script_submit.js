
// ask what are the yt url and format to backend script, then submits form.
browser.runtime.sendMessage({query:'options'}).then(function(resp){
  submitForm(resp);
});

// submit
function submitForm(options){
    $('#urlinput').val(options.url);
    $('select[name=format]').val(options.format);
    $('button.mainbtn').click();
}
