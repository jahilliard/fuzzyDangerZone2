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
        $.ajax({
          //creates route for pastaCreate
          url:"https://graph.facebook.com/"+profileId+"/picture?type=large&access_token="+ accessToken,
          type:'GET',
          dataType: "jsonp",
          success: function(data){
            $('#profile-pic').attr('src', data.data.url);
          }
        });
        $("#user-name").text(displayName);

          // <li class="Label">A</li>
          // <li class="img">
          //   <a href="#/">
          //     <img src="http://lorempixel.com/50/50/people/1/" />
          //     Alan<br />
          //     <small>Thompson</small>
          //   </a>
          // </li>

    });
});