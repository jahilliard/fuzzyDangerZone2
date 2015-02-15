
function User () {
    var name;
    var fbId;
    var username;
    var provider;
    var facebook;
    var accessToken;
    var friendsList;
    var hateList;
}

User.prototype.initializeUser = function(name, fbId, username, provider, facebook, accessToken, fList, hList, callback) {
    this.name = name;
    this.fbId = fbId;
    this.username = username;
    this.provider = provider;
    this.facebook = facebook;
    this.accessToken = accessToken;
    this.friendsList = fList;
    this.hateList = hList;
    callback(this);
};



module.exports = User;
