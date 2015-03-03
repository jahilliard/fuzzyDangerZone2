var util = require("util");
var mongoClient = require('mongodb').MongoClient;
var mongoDB; // The connected database

// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/socialmap';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

// Use connect method to connect to the Server
mongoClient.connect('mongodb://'+connection_string, function(err, db) {
  if (err) doError(err);
  console.log("Connected correctly to server");
  mongoDB = db;
});


// INSERT
exports.insert = function(collection, query, callback) {
        mongoDB.collection(collection).insert(
          query,
          {safe: true},
          function(err, crsr) {
            if (err) doError(err);
            callback(crsr);
          });
}

// FIND
exports.find = function(collection, query, callback) {
        var crsr = mongoDB.collection(collection).find(query);
        crsr.toArray(function(err, docs) {
          if (err) doError(err);
          callback(docs);
        });
 }

exports.findOne = function(collection, query, callback) {
        mongoDB.collection(collection).findOne(query,
          function(err, docs) {
          if (err) doError(err); 
          callback(docs);
        });
 }

// exports.findOneWithErr = function(collection, query, callback) {
//         mongoDB.collection(collection).findOne(query,
//           function(err, docs) {
//           if (err) doError(err); 
//           callback(err, docs);
//         });
//  }


// UPDATE
exports.update = function(collection, query, callback) {
          mongoDB.collection(collection).update(
            query.find,
            query.update,
            function(err, crsr) {
              if (err) doError(err);
              callback(crsr);
        });
  }

// Remove
exports.remove = function(collection, query, callback) {
      mongoDB.collection(collection).remove( 
          query,
          {safe: true},
          function(err, docs) {
            if (err) doError(err);
            callback(docs);
          });
 }

var doError = function(e) {
        util.debug("ERROR: " + e);
        throw new Error(e);
    }

