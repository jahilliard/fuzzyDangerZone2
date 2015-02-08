var pinMod = require("../models/pins.js");
var myMongo = require("../models/mymongo.js");
var userMod = require('../models/user.js');

exports.storePin = function(req, res){
	var pin = new pinMod();
	pin.initializePin(req.params.pinLat, req.params.pinLong, req.params.user_id);
	myMongo.insert('pins', pin, function(){
		console.log(' DOLLAR huge dump');
	});
}

// sends all the pins for now, so that we can 
// see all the pins on our client side map 
exports.sendPins = function(req, res){
    var arrayOfPins; 
    myMongo.find('pins', {}, function(crsr){
        //arrayOfPins = crsr.toArray();
        console.log('Baby here');
        console.log(crsr);
        res.send(arrayOfPins);  
    })

}

// exports.fbUserCreation = function (profile, done, accessToken){
//     console.log(String(profile._json.id));
//     currUser = profile._json.id;
//     var tempCompare = String(profile._json.id);
//     console.log("I am here whats up");
//     done(null, currUser)
// }
// var currUser;
// var pin;
// var location;
// var eventcurr;
// var score



// // Finds or creates user

exports.findOrCreate = function (profile, accessToken) {
     var currUser;
     console.log(String(profile._json.id));
     var tempCompare = String(profile._json.id);
     myMongo.findOne('users', { "facebook.id" : tempCompare },
         function(model) {
                 currUser = model;
                 console.log(currUser);
                 currUser = new userMod();
                 currUser.initializeUser(profile.displayName, profile.id, profile.username, 'facebook', profile._json, accessToken);
                 if (currUser === null) {
                     console.log(currUser);
                     myMongo.insert('users', currUser,
                                        function(model1) {
                                            return model1;
                                         });
                  }   
                 else if (currUser.fbId === tempCompare) {
                    myMongo.update('users', { 'find' : { 'fbId' : currUser.fbId},
                                                'update' : { '$set' : currUser} }, 
                            function(model){console.log(model);});
                    return currUser;
                 }
                 else {
                   return myMongo.doError("error");
                 }
         });
 }

exports.findInUserDB = function (user) {
    console.log(String(user.id));
    myMongo.findOne('users', { "facebook.id" : user.facebook.id },
        function(err, model) {
                currUser = model;
                console.log(currUser);
                if (typeof currUser !== 'undefined') {
                  done(null, currUser);
                }
                else {
                  return myMongo.doError("error");
                }
        });
}


// exports.IfUInEvent = function(req, res, next) {
//     location = new locationMod();
//     location.initializeLocation(req.params.currLat, req.params.currLong);
//     console.log("req.query is " + JSON.stringify(req.params));
//     myMongo.find('events', {}, function(crsr){
//         for (var i = crsr.length - 1; i >= 0; i--) {
//             if(location.calculateIfInEvent(crsr[i])){
//                 eventcurr = crsr[i];
//                 res.render('redirEvent.ejs', { message : "In An Event"});
//             } 
//         };
//     });
// }

// //makes a pin or a pin and event depending on if you are in a location

/*
exports.makePin = function(req, res, next) {
    var locationToCheck = new locationMod();
    locationToCheck.initializeLocation(req.params.currLat, req.params.currLong);
    if(location.calculateIfInLocation(locationToCheck) && eventcurr){
        if (!pin){
            pin = new pinMod();
            pin.initializePin(req.params.currLat, req.params.currLong, req.params.vote, eventcurr._id);
            myMongo.insert('pins', pin, function(pin) {
                res.render('redirEvent.ejs', { message : "pin added"});
            });
        } else {
            res.render('redirEvent.ejs', { message : "pin not added"});
        } 
    } else if (!location.calculateIfInLocation(locationToCheck) && eventcurr) {
        location = new locationMod();
        location.initializeLocation(req.params.currLat, req.params.currLong);
        myMongo.find('events', {}, function(crsr){
            var inEvent = false;
            var i = crsr.length
            while (i >= 0) {
                if(location.calculateIfInEvent(crsr[i])) {
                    eventcurr = crsr[i];
                    inEvent = true;
                    res.render('redirEvent.ejs', { message : "In An Event"});
                } 
                i--;
            }
            if (inEvent == false) {
                eventcurr = new eventMod();
                eventcurr.initializeEvent(req.params.name, req.params.currLat, req.params.currLong, req.params.type, req.params.datetime);
                myMongo.insert('events', eventcurr, function(eventcurrData) { 
                    pin = new pinMod();
                    pin.initializePin(req.params.currLat, req.params.currLong, req.params.vote, eventcurrData[0]._id);
                    myMongo.insert('pins', pin, function(pin) { 
                        res.render('redirEvent.ejs');
                    });
                });
            }
        });
    } else {
        makeEventWhilePlacingPin(req, res);
    }
}
*/

// exports.gotoEventPage = function(req, res, next){
//     console.log(eventcurr);
//     res.render('eventForm.ejs',  {'eventcurr' : eventcurr});
// }

// function makeEventWhilePlacingPin(req, res){
//     eventcurr = new eventMod();
//     eventcurr.initializeEvent(req.params.name, req.params.currLat, req.params.currLong, req.params.type, req.params.datetime);
//     myMongo.insert('events', eventcurr, function(eventcurrData) { 
//         pin = new pinMod();
//         pin.initializePin(req.params.currLat, req.params.currLong, req.params.vote, eventcurrData[0]._id);
//         myMongo.insert('pins', pin, function(pin) { 
//             res.render('redirEvent.ejs');
//         });
//     });

// }

// findScoreForEvent = function(thisid, callback) {
//     var tempScore = 0;
//     myMongo.find('pins', {event_id: thisid}, function(crsr){
//         crsr.forEach(function(x){
//             if(x.vote === "true"){
//                 tempScore = tempScore +1;
//             } else {
//                 tempScore = tempScore -1;
//             }
//         });
//         console.log('score is' + tempScore);
//         score = Number(tempScore);
//         callback(score);
//     });
// };

exports.loggedIn = function(req, res, next) {
    if (currUser) {
        next();
    } 
    else { 
        res.redirect('/');
    }
}



// exports.ioInit = function(io) {
//     io.on('connection', function(socket){
//       socket.on('chat message', function(msg){
//         io.emit('chat message', msg);
//       });
//     });

// }

// // In the case that no route has been matched
// exports.errorMessage = function(req, res, next) {
//   var message = '<p>Error, did not understand path '+req.path+"</p>";
// 	// Set the status to 404 not found, and render a message to the user.
//   res.status(404).send(message);
// }



//     console.log(location);
//     var isInLoc=false;
//     console.log("req.query is " + JSON.stringify(req.params));
//     myMongo.find('events', {}, function(crsr){
//         crsr.forEach(function(x){
//             if(location.calculateIfInEvent(x)){
//                 eventcurr = new eventMod();
//                 eventcurr.initializeEvent(x.name, x.longitude, x.latitude, x.type, x.datetime);
//                 if (!pin){
//                     pin = new pinMod();
//                     pin.initializePin(req.params.currLat, req.params.currLong, req.params.vote, x._id);
//                     myMongo.insert('pins', pin, function(pin) {
//                         setScore(x._id, function(score){
//                             eventcurr.score = score;
//                             res.render('redirEvent.ejs');
//                         });
//                     });
//                 } 
//                 isInLoc = true;
//             }
//         });
//         ifNotInLoc(isInLoc, req, res);
//     });
// }
