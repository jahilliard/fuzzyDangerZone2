
function Event() {
    var name;
    var longitude;
    var latitude;
    var type;
    var datetime;
}

Event.prototype.initializeEvent = function(name, longitude, latitude, type, datetime) {
    this.name = name;
    this.longitude = Number(longitude);
    this.latitude = Number(latitude);
    this.type = type;
    this.datetime = datetime;
};


Event.prototype.calculateIfInEvent = function(event) {
    var tempLong = Math.pow(event.longitude-this.longitude, 2);
    var tempLat = Math.pow(event.latitude-this.latitude, 2);
    var toSqrt = tempLat+tempLong;
    var toCheck = Math.round(Math.sqrt(toSqrt*10000000000000))/10000000000000;
    var hyp = (0.00625/5240)*(1.4142135623730950488016887242096980785);
    return (toCheck <= hyp);
}


module.exports = Event;
