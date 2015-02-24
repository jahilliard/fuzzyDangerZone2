var initialLocation;
var pinLong;
var pinLat;
var siberia = new google.maps.LatLng(60, 105);
var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
var browserSupportFlag =  new Boolean();
var map;

function initialize() {
  var myOptions = {
    zoom: 16,
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
      friendMarkerMaker();
      currMarkerMaker(initialLocation);
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
    });
}



function friendMarkerMaker() {
   $.ajax({
          url:"/getShowPins/"+profileId,
          type:'GET',
          success: function(data){
                  var pinsToShow = data;
                  var timeNow = Date.now();
                  for (var i = pinsToShow.length - 1; i >= 0; i--) {
                    (function(cntr){
                     var useCurrLocation = new google.maps.LatLng(pinsToShow[cntr].latitude,
                                                                  pinsToShow[cntr].longitude);
                     var whatDo = pinsToShow[cntr].whatDoing;
                     var timeCreated = pinsToShow[cntr].timeCreated;
                     var whatTime = pinsToShow[cntr].whatTime;
                     var contentString = "not assigned";
                     var timeToGo = (timeCreated + (whatTime*3600000)) - timeNow;
                     if (timeToGo > 0){
                        var howLong = Math.floor(timeToGo/360000);
                        contentString = "In " + howLong/10 + " hour(s): " + whatDo; 
                     } else{
                        contentString = "Now: " + whatDo; 
                     }
                     $.ajax({
                        url:"https://graph.facebook.com/"+pinsToShow[cntr].user_id+"/picture",
                        type:'GET',
                        dataType: "jsonp",
                        success: function(picdata){
                            var marker = new google.maps.Marker({
                                position: useCurrLocation,
                                icon: new google.maps.MarkerImage(
                                       picdata.data.url,
                                       new google.maps.Size(40, 40),
                                       new google.maps.Point(0, 0), 
                                       new google.maps.Point(22, 22), 
                                       new google.maps.Size(40, 40)
                                      ),
                                map: map
                            });
                            var infoWindow = new google.maps.InfoWindow({ content: contentString });
                            google.maps.event.addListener(marker, 'click', function() {
                                        infoWindow.open(map, marker);
                                      });
                          }
                      });
                  })(i);
                }
            }
        });
}

// function placeFriendMark(){

// }



                            // var myoverlay = new google.maps.OverlayView();
                            //    myoverlay.draw = function () {
                            //        this.getPanes().markerLayer.id='markerLayer';
                            //    };
                            // myoverlay.setMap(map);