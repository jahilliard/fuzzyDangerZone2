
function Pin(){
	var latitude;
	var longitude;
	var user_id;
};

Pin.prototype.initializePin = function(latitude, longitude, user_id) {
  this.latitude = Number(latitude);
  this.longitude = Number(longitude);
  this.user_id = Number(user_id);
};

module.exports = Pin;
