$(document).ready(function() {
	$("#menuIcon").click(function(event){
        console.log("hit");
          //to prevent default GET call
          event.preventDefault();
          // var initialLocationT= initialLocation.trim();
  
        $.ajax({
          //creates route for pastaCreate
          url:"https://graph.facebook.com/"+profileId+"/friends?access_token="+ accessToken,
          type:'GET',
          dataType: "jsonp",
          success: function(data){
              console.log(data.data);
          }
        });
    });
});