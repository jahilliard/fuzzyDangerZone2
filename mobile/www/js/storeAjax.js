function storePrepare() {
   console.log("Loaded");
    $(".pinMakerButton").click(function(event){
          //to prevent default GET call
          event.preventDefault();
          // var initialLocationT= initialLocation.trim();
  
        $.ajax({
          //creates route for pastaCreate
          url:"/makePin/"+pinLat+"/"+ pinLong,
          type:'POST',
          success: function(data){
            $("#responseArea").html(data);
          }
        });
    });
};

function getPrepare(){
  console.log("Loadem");
    $(".pinGetButton").click(function(event){
      event.preventDefault();
      $.ajax({
        url:"/getPins",
        type: "GET",
        success: function(data){
            $("#responseArea").html(data);
        }
      });
    });
};
