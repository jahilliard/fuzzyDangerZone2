var initialLocation;
var pinLong;
var pinLat;
var siberia = new google.maps.LatLng(60, 105);
var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
var browserSupportFlag =  new Boolean();
var map;

function initialize() {
  var myOptions = {
    zoom: 18,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);

  // Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      pinLong = position.coords.longitude;
      pinLat = position.coords.latitude;
      initialLocation = new google.maps.LatLng(pinLat,pinLong);
      map.setCenter(initialLocation);
      currMarkerMaker(initialLocation);
      storePrepare();
      getPrepare();
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
  // Browser doesn't support Geolocation
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
    map.setCenter(initialLocation);
  }
}
google.maps.event.addDomListener(window, 'load', initialize);

function currMarkerMaker (initialLocation) {
    new google.maps.Marker({
                position: initialLocation,
                map: map,
                animation: google.maps.Animation.DROP,
                draggable: true,
                title:"Current Location"
            });
}