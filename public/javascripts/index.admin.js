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


$('img').on('click', function() {
  var img = this;
  $('html, body').animate({
    scrollTop: $('[id="' + img.id + '_title"]').offset().top
  }, 400, function() {
    window.location.hash = img.id + '_title';

    $('[id="' + img.id + '_actions"]').fadeIn('fast', function() {

      $('[id="' + img.id + '_cancel"]').off('click').on('click', function() {
        $('[id="' + img.id + '_actions"]').fadeOut('fast');
      });

      $('[id="' + img.id + '_rename"]').off('click').on('click', function() {
        $('[id="' + img.id + '_rename_form"]').toggle();
      });

      $('[id="' + img.id + '_delete"]').off('click').on('click', function() {
        if (window.confirm('The pic will be deleted permanently'))
          $.post('/rm', { path: $('div#path').html(), name: img.alt }, () => { window.location.reload(); });
      });

    });
  });
});
