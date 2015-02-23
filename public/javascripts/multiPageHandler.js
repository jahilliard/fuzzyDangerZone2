$(document).ready(function() {
  $("#pin-set").hide();
  $("#place-pin-con").hide();
  $("#shairButton").click(function(event){
    $("#pin-set").hide();
  	event.preventDefault();
  	$('#total-container').hide();
  	$("#place-pin-con").show();
  });
  $("#backButton").click(function(event){
  	event.preventDefault();
  	$('#place-pin-con').hide();
  	$("#total-container").show();
  });
  $("#setButton").click(function(event){
    setCurrPin(); 
  });
  $('#setForm').on('submit', function () {
    setCurrPin();
  });
  $('#betaForm').on('submit', function (stuff) {
    event.preventDefault();
    console.log("submit");
    sendBetaForm(document.getElementById('betaFeedback').value);
    $('#betaFormId').append("<li id='successHide'><br><br>SUCCESS</li>");
    $('#successHide').hide(1500);
  });
});

function sendBetaForm(formFeedBack){
  $.ajax({
          url:"/sendBetaFeed/"+ profileId +"?thisInfo="+ formFeedBack,
          type:'POST',
          success : function(data){
              console.log("data back   " + data);
              var feedBack = document.getElementById('betaFeedback').value;
              console.log(feedBack);
          }
      });
}


function setCurrPin() {
    event.preventDefault();
    $('#place-pin-con').hide("slow");
    $("#total-container").show("slow");
    var doing = document.getElementById('whatDoingIn').value
    var time = document.getElementById('timeIn').value
    console.log(doing + " " + time);
    $.ajax({
          //creates route for pastaCreate
          url:"/makePin/"+pinLat+"/"+ pinLong + "/"+ profileId + 
                    "?whatDoing=" + doing + "&timeIn=" + time,
          type:'POST',
          success: function(data){
                  console.log(data);
                     var useCurrLocation = new google.maps.LatLng(data[0].latitude,
                                                                 data[0].longitude);
                     var whatDo = data[0].whatDoing;
                     $.ajax({
                        url:"https://graph.facebook.com/"+data[0].user_id+"/picture",
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
    });
}