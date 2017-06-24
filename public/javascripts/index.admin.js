$('#add_pic').on('click', function() {
  $('#add_pic').fadeOut(function() {
    $('#upload').fadeIn();
  });
});

$('#add_location').on('click', function() {
  $('#add_location').fadeOut(function() {
    $('#mkdir').fadeIn();
  });
});
