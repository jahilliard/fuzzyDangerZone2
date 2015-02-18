var initialLocation;
var pinLong;
var pinLat;
var siberia = new google.maps.LatLng(60, 105);
var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
var browserSupportFlag =  new Boolean();
var map;

function initialize() {
  var myOptions = {
    zoom: 15,
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
      friendMarkerMaker();
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
    var marker = new google.maps.Marker({
                position: initialLocation,
                draggable:true,
                icon: 'img/pin.png',
                map: map,
                animation: google.maps.Animation.DROP,
                title:"Current Location"
            });
    google.maps.event.addListener(marker,'dragend',function(event) {
        pinLat = event.latLng.lat();
        pinLong = event.latLng.lng();
        console.log(pinLat, pinLong);
    });
}

function friendMarkerMaker() {
   $.ajax({
          url:"/getShowPins/"+profileId,
          type:'GET',
          success: function(data){
                  var pinsToShow = data;
                  for (var i = pinsToShow.length - 1; i >= 0; i--) {
                     var useCurrLocation = new google.maps.LatLng(pinsToShow[i].latitude,
                                                                  pinsToShow[i].longitude);
                     var whatDo = pinsToShow[i].whatDoing;
                     $.ajax({
                        url:"https://graph.facebook.com/"+pinsToShow[i].user_id+"/picture",
                        type:'GET',
                        dataType: "jsonp",
                        success: function(picdata){
                            var marker = new google.maps.Marker({
                                position: useCurrLocation,
                                icon: new google.maps.MarkerImage(
                                       picdata.data.url,
                                       new google.maps.Size(40, 40),
                                       new google.maps.Point(0, 0), 
                                       new google.maps.Point(20, 20), 
                                       new google.maps.Size(40, 40)
                                      ),
                                map: map
                            });
                            var infoWindow = new google.maps.InfoWindow({ content: whatDo });
                            google.maps.event.addListener(marker, 'click', function() {
                                        infoWindow.open(map, marker);
                                      });
                          }
                      });
                }
            }
        });
}



                            // var myoverlay = new google.maps.OverlayView();
                            //    myoverlay.draw = function () {
                            //        this.getPanes().markerLayer.id='markerLayer';
                            //    };
                            // myoverlay.setMap(map);