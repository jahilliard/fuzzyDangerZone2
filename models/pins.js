
function Pin(){
	var latitude;
	var longitude;
	var user_id;
	var whatDoing;
  var timeCreated; //stored in milliseconds since beggining
	var timeFor; // int representitive of hours 
  var whatTime; // int representitive of hours
};

Pin.prototype.initializePin = function(latitude, longitude, user_id, whatDoing, timeFor, whatTime, callback) {
  this.latitude = Number(latitude);
  this.longitude = Number(longitude);
  this.user_id = user_id.toString();
  this.whatDoing = whatDoing;
  this.timeCreated = Date.now();
  this.timeFor = timeFor;
  this.whatTime = whatTime;
  callback(this);
};

module.exports = Pin;
