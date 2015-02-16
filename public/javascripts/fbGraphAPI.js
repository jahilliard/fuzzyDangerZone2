$(document).ready(function() {
  var $menu = $("nav#menu").mmenu({
                classes   : "mm-light",
                counters  : true,
                searchfield : true,
                header    : {
                  add     : true,
                  update    : true,
                  title   : "Contacts"
                  }
                }).on( 'click', 'a[href^="#/"]', function() {
                          alert( "Thank you for clicking, but that's a demo link." );
                          return false;
                        }
        );
    _menu = $menu.data( "mmenu" );

    $.ajax({
          url:"https://graph.facebook.com/"+profileId+"/friends?access_token="+ accessToken,
          type:'GET',
          dataType: "jsonp",
          success: function(data){
            var $ul = $menu.find( "#FBfriend" );
            console.log(data.data[0]);
            for (var i = data.data.length - 1; i >= 0; i--) {
              var currUseId = data.data[i].id;
              var currUseName = data.data[i].name;
              $.ajax({
                url:"https://graph.facebook.com/"+currUseId+"/picture",
                type:'GET',
                dataType: "jsonp",
                success: function(picdata){
                  picdata.data.url
                  nameArr = currUseName.split(" ");
                  if (nameArr.length === 2){
                    var firstN = nameArr[0];
                    var lastN = nameArr[1];
                    var toAppend = "<li class='img'><a href='#/'>" + "<img src='" + picdata.data.url + 
                    "' />\n              " + firstN + "<br /><small>" + lastN + "</small></a></li>";
                    $ul.append( toAppend );
                    _menu._init( $ul );
                  }
                  }
              });
            }
          }
        });




	$("#menuIcon").click(function(event){
        console.log("hit");
          //to prevent default GET call
          event.preventDefault();
        $.ajax({
          url:"https://graph.facebook.com/"+profileId+"/picture?type=large&access_token="+ accessToken,
          type:'GET',
          dataType: "jsonp",
          success: function(data){
            $('#profile-pic').attr('src', data.data.url);
          }
        });
        $("#user-name").text(displayName);

    });
});