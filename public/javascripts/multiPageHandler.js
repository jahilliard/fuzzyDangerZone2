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
  	event.preventDefault();
  	$('#place-pin-con').hide("slow");
  	$("#total-container").show("slow");
    var doing = document.getElementById('whatDoingIn').value
    var time = document.getElementById('timeIn').value
    console.log(doing + " " + time);
    $.ajax({
          //creates route for pastaCreate
          url:"/makePin/"+pinLat+"/"+ pinLong +"?whatDoing=" + doing + "&timeIn=" + time 
                    +"&user_id=" + profileId,
          type:'POST',
          success: function(data){
            console.log(data);
          }
    });
  });
});