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
                          var currUseId = $(this).attr("data-userId");  
                          if ( $(this).parents("#FBfriend").length == 1 ) { 
                            console.log("This is True    " +currUseId);
                            var htmlString = "<li class='img'>" + this.outerHTML + "</li>";
                            $(this).html("Added to Your ShairList");
                            $(this).hide(1500, function (){
                              $(this).parent(".img").remove();
                              var $ul = $menu.find( "#shairList" );
                              $ul.append( htmlString );
                              _menu._init( $ul );
                                  $.ajax({
                                    url:"/addFriendsList/"+profileId+"/" + currUseId,
                                    type:'POST',
                                    dataType: "jsonp",
                                    success: function(data){
                                      console.log("sent");
                                    }
                                  });
                            });
                          } else {
                            console.log("This is False    " +currUseId);
                            var htmlString = "<li class='img'>" + this.outerHTML + "</li>";
                            $(this).html("Deleted From Your ShairList");
                            $(this).hide(1500, function (){
                              $(this).parent(".img").remove();
                              var $ul = $menu.find( "#FBfriend" );
                              $ul.append( htmlString );
                              _menu._init( $ul );
                                  $.ajax({
                                    url:"/deleteFriendsList/"+profileId+"/" + currUseId,
                                    type:'DELETE',
                                    dataType: "jsonp",
                                    success: function(data){
                                      console.log("sent");
                                    }
                                  });
                            });
                          }
                          return false;
                        }
        );




    _menu = $menu.data( "mmenu" );




    $.ajax({
          url:"https://graph.facebook.com/"+profileId+"/friends?access_token="+ accessToken,
          type:'GET',
          dataType: "jsonp",
          success: function(data){
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
                    if (friendsList.indexOf(currUseId) > -1) {
                        var $ul = $menu.find( "#shairList" ); 
                        var firstN = nameArr[0];
                        var lastN = nameArr[1];
                        var toAppend = "<li class='img'><a data-userId='" + currUseId + "' href='#/'>" + 
                        "<img src='" + picdata.data.url + "' />\n              " + firstN + "<br /><small>"
                         + lastN + "</small></a></li>";
                        $ul.append( toAppend );
                        _menu._init( $ul );
                    } else {
                        var $ul = $menu.find( "#FBfriend" );
                        var firstN = nameArr[0];
                        var lastN = nameArr[1];
                        var toAppend = "<li class='img'><a data-userId=" + currUseId + " href='#/'>" +
                         "<img src='" + picdata.data.url + "' />\n              " + firstN + "<br /><small>"
                         + lastN + "</small></a></li>";
                        $ul.append( toAppend );
                        _menu._init( $ul );
                    }
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