var jQuery = require('jquery');

require('jquery-hammerjs');
require('materialize-css/js/sideNav');
require('materialize-css/js/parallax');

(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space