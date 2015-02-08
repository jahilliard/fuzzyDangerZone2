
function User () {
    var name;
    var fbId;
    var username;
    var provider;
    var facebook;
    var accessToken;
}

User.prototype.initializeUser = function(name, fbId, username, provider, facebook, accessToken) {
    this.name = name;
    this.fbId = fbId;
    this.username = username;
    this.provider = provider;
    this.facebook = facebook;
    this.accessToken = accessToken;
};

module.exports = User;
