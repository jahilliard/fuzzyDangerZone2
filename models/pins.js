
function Pin(){
	var latitude;
	var longitude;
	var user_id;
	var whatDoing;
	var timeFor;
};

Pin.prototype.initializePin = function(latitude, longitude, user_id, whatDoing, timeFor, callback) {
  this.latitude = Number(latitude);
  this.longitude = Number(longitude);
  this.user_id = user_id.toString();
  this.whatDoing = whatDoing;
  this.timeFor = timeFor;
  callback(this);
};

module.exports = Pin;
