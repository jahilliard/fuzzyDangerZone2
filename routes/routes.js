var pinMod = require("../models/pins.js");
var myMongo = require("../models/mymongo.js");
var userMod = require('../models/user.js');
var ObjectID = require('mongodb').ObjectID;

exports.storePin = function(req, res){
  var UseId = req.params.user_id.toString();
	var pin = new pinMod();
	pin.initializePin(req.params.pinLat, req.params.pinLong, req.params.user_id, 
                        req.query.whatDoing, req.query.timeIn, req.query.whenTime, 
    function(pin){
      myMongo.findOne('pins',{'user_id' : UseId}, function(currPin){
        if(currPin == null){
                 myMongo.insert('pins', pin, function(currpin){
                   res.send(currpin);
                  });
        } else {
          myMongo.remove('pins', {'user_id' : UseId}, function(didSucceed){
                console.log(didSucceed);
                  myMongo.insert('pins', pin, function(currpin){
                   res.send(currpin);
                  });
          });
        }
      });
    });
}

exports.serializeUser = function(user, done) {
      done(null, user.id);
}

exports.deserializeUser = function(user, done) {
  myMongo.findOne('users', { "fbId" : user }, 
    function(user1){
        // if(!err){
        //    console.log(" NOO err hit");
           done(null, user1);
        // }
        // else {
        //   console.log(" errr hit");
        //   done(err, null);
        // }
    })
}

exports.sendBetaFeed = function (req, res) {
  var profId = req.params.profileId;
  var thisInfo = req.query.thisInfo;
  myMongo.insert('feedbacks', { "profileId": profId, 
    "feedback" : thisInfo}, 
    function(didSuc){
      res.send(didSuc);
  });
}

exports.addToFriendList = function(req, res) {
  var profileId = req.params.profileId;
  var toAddId = req.params.toAddId;
  myMongo.findOne('users', { "fbId" : toAddId },
                 function(model) {
                 if (model != null) {
                  var tempArrCS = model.canSeeList;
                  tempArrCS.push(profileId.toString());
                  myMongo.update('users', { 'find' : { 'fbId' : toAddId},
                                            'update' : { '$set' : {"canSeeList": tempArrCS}}},
                  function(didSucceed){
                        myMongo.findOne('users', { "fbId" : profileId },
                                    function(model) {
                                            var tempArrFL = model.friendsList;
                                            tempArrFL.push(toAddId.toString());
                                            myMongo.update('users', { 'find' : { 'fbId' : profileId},
                                            'update' : { '$set' : {"friendsList": tempArrFL}}},
                                            function(didSucceed){
                                                res.send(didSucceed);
                                            });
                      });
                  });
                }
               });
}

exports.sendPins = function(req, res){
  var user_id = req.params.user_id;
  myMongo.findOne('users', { "fbId" : user_id.toString() },
                 function(model) {
                  var arrayOfPins = [];
                  var canSee = model.canSeeList;
                  var tempCount = 0;
                  myMongo.find('pins', {'user_id' : {'$in': canSee}},
                    function(crsr){
                      res.send(crsr);
                    });
  });
}

exports.deleteFriendsList = function(req, res) {
  var profileId = req.params.profileId;
  var toAddId = req.params.toAddId;
  myMongo.findOne('users', { "fbId" : toAddId },
                 function(model) {
                  if (model !=null) {
                  var tempArrCS = model.canSeeList;
                  var index = tempArrCS.indexOf(profileId.toString());
                  if (index > -1) {
                     tempArrCS.splice(index, 1);
                  }
                  myMongo.update('users', { 'find' : { 'fbId' : toAddId},
                                            'update' : { '$set' : {"canSeeList": tempArrCS}}},
                  function(didSucceed){
                       myMongo.findOne('users', { "fbId" : profileId },
                        function(model) {
                          var tempArrFL = model.friendsList;
                          var index = tempArrFL.indexOf(toAddId.toString());
                          if (index > -1) {
                             tempArrFL.splice(index, 1);
                          }
                          myMongo.update('users', { 'find' : { 'fbId' : profileId},
                                            'update' : { '$set' : {"friendsList": tempArrFL}}},
                                            function(didSucceed){
                                                res.send(didSucceed);
                                            });
                        });
                    });
                  };
               });
}

exports.clearPinsInDb = function(){
  setInterval(
    function(){
      var collect = "pins"
      myMongo.find("pins", {}, function(crsr){
        var timeNow = Date.now();
        for (var i = crsr.length - 1; i >= 0; i--) {
          var todelete = crsr[i];
          var mongoId = ObjectID.ObjectId(todelete._id);
          var currDate = mongoId.getTimestamp();
          var newTime = currDate.getTime() + (todelete.timeFor * 3600000) + (todelete.whatTime * 3600000);
          if (newTime < timeNow) {
            myMongo.remove("pins", { "_id" : mongoId }, function (docs){
              console.log(docs);
            });
          };
        };
      });
    }, 
  60 * 60 * 1000);
}

exports.findOrCreate = function (profile, accessToken, callback) {
     var currUser;
     console.log(profile.fbId);
     var tempCompare = profile.fbId;
     myMongo.findOne('users', { "facebook.id" : tempCompare },
         function(model) {
                 currUser = new userMod();
                 if (model === null) {
                    currUser.initializeUser(profile.displayName, profile.id, profile.username, 'facebook', 
                                                profile._json, accessToken, [], [profile.id.toString()], 
                      function(currUser){
                         myMongo.insert('users', currUser,
                                        function(currUser) {
                                            callback(currUser[0], accessToken);
                                         });
                      });
                  }   
                 else if (model.fbId === tempCompare) {
                    currUser.initializeUser(profile.displayName, profile.id, profile.username, 'facebook', 
                      profile._json, accessToken, model.friendsList, model.canSeeList,
                          function(thisIstheUse){
                              myMongo.update('users', { 'find' : { 'fbId' : thisIstheUse.fbId},
                                                          'update' : { '$set' : thisIstheUse} }, 
                                      function(didSucceed){
                                          callback(thisIstheUse, accessToken);
                                      });
                              });
                 }
                 else {
                   return myMongo.doError("error");
                 }
         });
 }

// exports.findInUserDB = function (user) {
//     console.log(String(user.id));
//     myMongo.findOne('users', { "facebook.id" : user.facebook.id },
//         function(err, model) {
//                 currUser = model;
//                 console.log(currUser);
//                 if (typeof currUser !== 'undefined') {
//                   done(null, currUser);
//                 }
//                 else {
//                   return myMongo.doError("error");
//                 }
//         });
// }