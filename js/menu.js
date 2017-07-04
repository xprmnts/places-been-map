// Definite function to slide the menu from left
$('#menu-toggle').click(function (e) {
  e.preventDefault();
  $('#wrapper').toggleClass('toggled');
});

// Define function to toggle animation for the hamburger
$('#hamburger').click(function () {
  $('#hamburger').toggleClass('change');
});
