function scrollToElement(selector, hash) {
  $('html, body').animate({
    scrollTop: $(selector).offset().top
  }, function() {
    if (hash != '') window.location.hash = hash;
  });
}

$(document).ready(function() {
  $('a[href^="#"]').on('click', function(event) {
    event.preventDefault();

    var hash = decodeURIComponent(this.hash);
    var selector = '[id="' + hash.substring(1, hash.length) + '_title"]';

    $('html, body').animate({
      scrollTop: $(selector).offset().top
    }, 1200, function() {
      window.location.hash = hash + '_title';
    });
  });
});
