
function Pin(){
	var latitude;
	var longitude;
	var vote;
	var event_id;
};

Pin.prototype.initializePin = function(latitude, longitude, vote, event_id) {
  this.latitude = Number(latitude);
  this.longitude = Number(longitude);
  this.vote = vote;
  this.event_id = event_id;
};

module.exports = Pin;
